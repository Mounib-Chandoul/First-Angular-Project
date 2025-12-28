<?php
declare(strict_types=1);

class TrainingsController
{
    public function __construct(private PDO $pdo) {}

    public function search(string $q): array
    {
        $q = trim($q);
        if ($q === '') return [];

        $sql = "
            SELECT DISTINCT t.id, t.title, t.description, t.level, t.duration_hours
            FROM trainings t
            LEFT JOIN training_tags tt ON tt.training_id = t.id
            LEFT JOIN tags tg ON tg.id = tt.tag_id
            WHERE t.title LIKE :q
                OR t.description LIKE :q
                OR tg.name LIKE :q
            ORDER BY t.id DESC
            LIMIT 50
        ";


        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['q' => "%$q%"]);
        return $stmt->fetchAll();
    }

    public function show(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM trainings WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $training = $stmt->fetch();

        if (!$training) {
            http_response_code(404);
            return ["error" => "Training not found"];
        }

        $stmt = $this->pdo->prepare("
            SELECT c.id, c.name
            FROM categories c
            INNER JOIN training_categories tc ON tc.category_id = c.id
            WHERE tc.training_id = :id
            ORDER BY c.name
        ");
        $stmt->execute(['id' => $id]);
        $categories = $stmt->fetchAll();

        $stmt = $this->pdo->prepare("
            SELECT tg.id, tg.name
            FROM tags tg
            INNER JOIN training_tags tt ON tt.tag_id = tg.id
            WHERE tt.training_id = :id
            ORDER BY tg.name
        ");
        $stmt->execute(['id' => $id]);
        $tags = $stmt->fetchAll();

        $stmt = $this->pdo->prepare("
            SELECT s.*
            FROM sessions s
            WHERE s.training_id = :id
              AND s.start_date >= CURDATE()
              AND s.status IN ('planned','open')
            ORDER BY s.start_date ASC
        ");
        $stmt->execute(['id' => $id]);
        $sessions = $stmt->fetchAll();

        foreach ($sessions as &$s) {
            $sid = (int)$s['id'];

            $stT = $this->pdo->prepare("
                SELECT tr.id, tr.full_name, tr.email, tr.phone, st.role
                FROM session_trainers st
                INNER JOIN trainers tr ON tr.id = st.trainer_id
                WHERE st.session_id = :sid
                ORDER BY FIELD(st.role,'main','assistant'), tr.full_name
            ");
            $stT->execute(['sid' => $sid]);
            $s['trainers'] = $stT->fetchAll();

            $stC = $this->pdo->prepare("
                SELECT COUNT(*) AS cnt
                FROM enrollments
                WHERE session_id = :sid
                  AND status IN ('pending','accepted')
            ");
            $stC->execute(['sid' => $sid]);
            $cnt = (int)$stC->fetch()['cnt'];

            $s['enrolled_count'] = $cnt;
            $s['is_full'] = ($cnt >= 15);
        }
        unset($s);

        return [
            "training" => $training,
            "categories" => $categories,
            "tags" => $tags,
            "upcoming_sessions" => $sessions
        ];
    }
}
