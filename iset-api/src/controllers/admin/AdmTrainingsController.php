<?php
declare(strict_types=1);

class AdmTrainingsController
{
    public function __construct(private PDO $pdo) {}

    // GET /admin/trainings
    public function index(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM trainings ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    // GET /admin/trainings/{id}
    public function show(int $id): array
    {
        $t = $this->pdo->prepare("SELECT * FROM trainings WHERE id = :id");
        $t->execute(['id' => $id]);
        $training = $t->fetch();

        if (!$training) {
            http_response_code(404);
            return ["error" => "Training not found"];
        }

        $c = $this->pdo->prepare("
            SELECT c.id, c.name
            FROM categories c
            INNER JOIN training_categories tc ON tc.category_id = c.id
            WHERE tc.training_id = :id
        ");
        $c->execute(['id' => $id]);

        $g = $this->pdo->prepare("
            SELECT tg.id, tg.name
            FROM tags tg
            INNER JOIN training_tags tt ON tt.tag_id = tg.id
            WHERE tt.training_id = :id
        ");
        $g->execute(['id' => $id]);

        return [
            "training" => $training,
            "categories" => $c->fetchAll(),
            "tags" => $g->fetchAll()
        ];
    }

    // POST /admin/trainings
    // body example:
    // {
    //   "title":"Angular",
    //   "description":"..",
    //   "level":"beginner",
    //   "duration_hours":40,
    //   "program_pdf":"/uploads/programs/a.pdf",
    //   "category_ids":[2,3],
    //   "tag_ids":[1,7]
    // }
    public function store(array $body): array
    {
        $title = trim((string)($body['title'] ?? ''));
        if ($title === '') {
            http_response_code(400);
            return ["error" => "title is required"];
        }

        $description = trim((string)($body['description'] ?? ''));
        $level = trim((string)($body['level'] ?? 'beginner'));
        $hours = (int)($body['duration_hours'] ?? 0);
        $programPdf = trim((string)($body['program_pdf'] ?? ''));

        $categoryIds = $body['category_ids'] ?? [];
        $tagIds = $body['tag_ids'] ?? [];

        $this->pdo->beginTransaction();
        try {
            $ins = $this->pdo->prepare("
                INSERT INTO trainings (title, description, level, duration_hours, program_pdf, is_active, created_at, updated_at)
                VALUES (:title, :description, :level, :hours, :pdf, 1, NOW(), NOW())
            ");
            $ins->execute([
                'title' => $title,
                'description' => $description !== '' ? $description : null,
                'level' => $level !== '' ? $level : 'beginner',
                'hours' => $hours > 0 ? $hours : null,
                'pdf' => $programPdf !== '' ? $programPdf : null
            ]);

            $trainingId = (int)$this->pdo->lastInsertId();

            $this->syncIds('training_categories', 'training_id', 'category_id', $trainingId, $categoryIds);
            $this->syncIds('training_tags', 'training_id', 'tag_id', $trainingId, $tagIds);

            $this->pdo->commit();
            http_response_code(201);
            return ["message" => "Training created", "id" => $trainingId];

        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    // PUT /admin/trainings/{id}
    public function update(int $id, array $body): array
    {
        $exists = $this->pdo->prepare("SELECT id FROM trainings WHERE id = :id");
        $exists->execute(['id' => $id]);
        if (!$exists->fetch()) {
            http_response_code(404);
            return ["error" => "Training not found"];
        }

        $title = array_key_exists('title', $body) ? trim((string)$body['title']) : null;
        $description = array_key_exists('description', $body) ? trim((string)$body['description']) : null;
        $level = array_key_exists('level', $body) ? trim((string)$body['level']) : null;
        $hours = array_key_exists('duration_hours', $body) ? (int)$body['duration_hours'] : null;
        $programPdf = array_key_exists('program_pdf', $body) ? trim((string)$body['program_pdf']) : null;
        $isActive = array_key_exists('is_active', $body) ? (int)$body['is_active'] : null;

        $categoryIds = $body['category_ids'] ?? null;
        $tagIds = $body['tag_ids'] ?? null;

        $this->pdo->beginTransaction();
        try {
            $upd = $this->pdo->prepare("
                UPDATE trainings
                SET title = COALESCE(:title, title),
                    description = :description,
                    level = COALESCE(:level, level),
                    duration_hours = :hours,
                    program_pdf = :pdf,
                    is_active = COALESCE(:active, is_active),
                    updated_at = NOW()
                WHERE id = :id
            ");
            $upd->execute([
                'id' => $id,
                'title' => ($title !== null && $title !== '') ? $title : null,
                'description' => ($description !== null && $description !== '') ? $description : null,
                'level' => ($level !== null && $level !== '') ? $level : null,
                'hours' => ($hours !== null && $hours > 0) ? $hours : null,
                'pdf' => ($programPdf !== null && $programPdf !== '') ? $programPdf : null,
                'active' => $isActive
            ]);

            if (is_array($categoryIds)) {
                $this->syncIds('training_categories', 'training_id', 'category_id', $id, $categoryIds);
            }
            if (is_array($tagIds)) {
                $this->syncIds('training_tags', 'training_id', 'tag_id', $id, $tagIds);
            }

            $this->pdo->commit();
            return ["message" => "Training updated"];

        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    // DELETE /admin/trainings/{id}
    public function destroy(int $id): array
    {
        $stmt = $this->pdo->prepare("DELETE FROM trainings WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            return ["error" => "Training not found"];
        }
        return ["message" => "Training deleted"];
    }

    // Helper to sync pivot table
    private function syncIds(string $table, string $leftKey, string $rightKey, int $leftId, array $ids): void
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));

        $del = $this->pdo->prepare("DELETE FROM {$table} WHERE {$leftKey} = :id");
        $del->execute(['id' => $leftId]);

        if (count($ids) === 0) return;

        $ins = $this->pdo->prepare("INSERT INTO {$table} ({$leftKey}, {$rightKey}) VALUES (:lid, :rid)");
        foreach ($ids as $rid) {
            if ($rid > 0) $ins->execute(['lid' => $leftId, 'rid' => $rid]);
        }
    }
}
