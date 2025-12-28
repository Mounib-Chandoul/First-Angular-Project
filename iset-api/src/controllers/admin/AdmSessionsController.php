<?php
declare(strict_types=1);

class AdmSessionsController
{
    public function __construct(private PDO $pdo) {}

    // GET /admin/sessions
    public function index(): array
    {
        $stmt = $this->pdo->query("
            SELECT s.*, t.title AS training_title
            FROM sessions s
            INNER JOIN trainings t ON t.id = s.training_id
            ORDER BY s.start_date DESC
        ");
        return $stmt->fetchAll();
    }

    // GET /admin/sessions/{id}
    public function show(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM sessions WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $s = $stmt->fetch();

        if (!$s) {
            http_response_code(404);
            return ["error" => "Session not found"];
        }

        $tr = $this->pdo->prepare("
            SELECT tr.id, tr.full_name, tr.email, st.role
            FROM session_trainers st
            INNER JOIN trainers tr ON tr.id = st.trainer_id
            WHERE st.session_id = :sid
            ORDER BY FIELD(st.role,'main','assistant'), tr.full_name
        ");
        $tr->execute(['sid' => $id]);

        return ["session" => $s, "trainers" => $tr->fetchAll()];
    }

    // POST /admin/sessions
    // body:
    // {
    //   "training_id": 1,
    //   "start_date":"2026-01-10",
    //   "end_date":"2026-01-12",
    //   "description":"...",
    //   "status":"planned",
    //   "trainer_ids":[1,2]   // 1 or 2 only
    // }
    public function store(array $body): array
    {
        $trainingId = (int)($body['training_id'] ?? 0);
        $startDate  = trim((string)($body['start_date'] ?? ''));
        $endDate    = trim((string)($body['end_date'] ?? ''));
        $desc       = trim((string)($body['description'] ?? ''));
        $status     = trim((string)($body['status'] ?? 'planned'));
        $trainerIds = $body['trainer_ids'] ?? [];

        if ($trainingId <= 0 || $startDate === '' || $endDate === '') {
            http_response_code(400);
            return ["error" => "training_id, start_date, end_date are required"];
        }

        if (!is_array($trainerIds)) $trainerIds = [];
        $trainerIds = array_values(array_unique(array_map('intval', $trainerIds)));

        if (count($trainerIds) < 1 || count($trainerIds) > 2) {
            http_response_code(400);
            return ["error" => "trainer_ids must contain 1 or 2 trainers"];
        }

        $this->pdo->beginTransaction();
        try {
            $ins = $this->pdo->prepare("
                INSERT INTO sessions (training_id, start_date, end_date, description, status, capacity, created_at, updated_at)
                VALUES (:tid, :sd, :ed, :d, :st, 15, NOW(), NOW())
            ");
            $ins->execute([
                'tid' => $trainingId,
                'sd' => $startDate,
                'ed' => $endDate,
                'd'  => $desc !== '' ? $desc : null,
                'st' => $status !== '' ? $status : 'planned'
            ]);

            $sessionId = (int)$this->pdo->lastInsertId();
            $this->syncSessionTrainers($sessionId, $trainerIds);

            $this->pdo->commit();
            http_response_code(201);
            return ["message" => "Session created", "id" => $sessionId];

        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    // PUT /admin/sessions/{id}
    public function update(int $id, array $body): array
    {
        $exists = $this->pdo->prepare("SELECT id FROM sessions WHERE id = :id");
        $exists->execute(['id' => $id]);
        if (!$exists->fetch()) {
            http_response_code(404);
            return ["error" => "Session not found"];
        }

        $startDate  = array_key_exists('start_date', $body) ? trim((string)$body['start_date']) : null;
        $endDate    = array_key_exists('end_date', $body) ? trim((string)$body['end_date']) : null;
        $desc       = array_key_exists('description', $body) ? trim((string)$body['description']) : null;
        $status     = array_key_exists('status', $body) ? trim((string)$body['status']) : null;
        $capacity   = array_key_exists('capacity', $body) ? (int)$body['capacity'] : null;

        $trainerIds = $body['trainer_ids'] ?? null;

        $this->pdo->beginTransaction();
        try {
            $upd = $this->pdo->prepare("
                UPDATE sessions
                SET start_date = COALESCE(:sd, start_date),
                    end_date   = COALESCE(:ed, end_date),
                    description = :d,
                    status = COALESCE(:st, status),
                    capacity = COALESCE(:cap, capacity),
                    updated_at = NOW()
                WHERE id = :id
            ");
            $upd->execute([
                'id' => $id,
                'sd' => ($startDate !== null && $startDate !== '') ? $startDate : null,
                'ed' => ($endDate !== null && $endDate !== '') ? $endDate : null,
                'd' => ($desc !== null && $desc !== '') ? $desc : null,
                'st' => ($status !== null && $status !== '') ? $status : null,
                'cap' => $capacity
            ]);

            if (is_array($trainerIds)) {
                $trainerIds = array_values(array_unique(array_map('intval', $trainerIds)));
                if (count($trainerIds) < 1 || count($trainerIds) > 2) {
                    http_response_code(400);
                    $this->pdo->rollBack();
                    return ["error" => "trainer_ids must contain 1 or 2 trainers"];
                }
                $this->syncSessionTrainers($id, $trainerIds);
            }

            $this->pdo->commit();
            return ["message" => "Session updated"];

        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    // DELETE /admin/sessions/{id}
    public function destroy(int $id): array
    {
        $stmt = $this->pdo->prepare("DELETE FROM sessions WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            return ["error" => "Session not found"];
        }
        return ["message" => "Session deleted"];
    }

    private function syncSessionTrainers(int $sessionId, array $trainerIds): void
    {
        // delete old
        $del = $this->pdo->prepare("DELETE FROM session_trainers WHERE session_id = :sid");
        $del->execute(['sid' => $sessionId]);

        // insert new with roles
        $ins = $this->pdo->prepare("
            INSERT INTO session_trainers (session_id, trainer_id, role)
            VALUES (:sid, :tid, :role)
        ");

        foreach ($trainerIds as $i => $tid) {
            if ($tid <= 0) continue;
            $role = ($i === 0) ? 'main' : 'assistant';
            $ins->execute(['sid' => $sessionId, 'tid' => $tid, 'role' => $role]);
        }
    }
}
