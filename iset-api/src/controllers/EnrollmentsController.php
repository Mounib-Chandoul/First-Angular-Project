<?php
declare(strict_types=1);

class EnrollmentsController
{
    public function __construct(private PDO $pdo) {}

    public function storePublic(array $body): array
    {
        $sessionId = (int)($body['session_id'] ?? 0);
        $firstName = trim((string)($body['first_name'] ?? ''));
        $lastName  = trim((string)($body['last_name'] ?? ''));
        $email     = strtolower(trim((string)($body['email'] ?? '')));

        if ($sessionId <= 0 || $firstName === '' || $lastName === '' || $email === '') {
            http_response_code(400);
            return ["error" => "session_id, first_name, last_name, email are required"];
        }

        $fullName = trim($firstName . " " . $lastName);

        // session exists?
        $st = $this->pdo->prepare("SELECT id FROM sessions WHERE id = :sid");
        $st->execute(['sid' => $sessionId]);
        if (!$st->fetch()) {
            http_response_code(404);
            return ["error" => "Session not found"];
        }

        // max 15 rule (count pending+accepted)
        $st = $this->pdo->prepare("
            SELECT COUNT(*) AS cnt
            FROM enrollments
            WHERE session_id = :sid
              AND status IN ('pending','accepted')
        ");
        $st->execute(['sid' => $sessionId]);
        if ((int)$st->fetch()['cnt'] >= 15) {
            http_response_code(409);
            return ["error" => "Session is full (max 15)"];
        }

        // candidate by email
        $st = $this->pdo->prepare("SELECT id FROM candidates WHERE email = :email LIMIT 1");
        $st->execute(['email' => $email]);
        $candidate = $st->fetch();

        if ($candidate) {
            $candidateId = (int)$candidate['id'];
        } else {
            $ins = $this->pdo->prepare("
                INSERT INTO candidates (full_name, email, created_at, updated_at)
                VALUES (:full_name, :email, NOW(), NOW())
            ");
            $ins->execute(['full_name' => $fullName, 'email' => $email]);
            $candidateId = (int)$this->pdo->lastInsertId();
        }

        // prevent duplicate
        $st = $this->pdo->prepare("
            SELECT id
            FROM enrollments
            WHERE candidate_id = :cid AND session_id = :sid
            LIMIT 1
        ");
        $st->execute(['cid' => $candidateId, 'sid' => $sessionId]);
        if ($st->fetch()) {
            http_response_code(409);
            return ["error" => "Already enrolled in this session"];
        }

        // insert enrollment
        $ins = $this->pdo->prepare("
            INSERT INTO enrollments (session_id, candidate_id, status)
            VALUES (:sid, :cid, 'pending')
        ");
        $ins->execute(['sid' => $sessionId, 'cid' => $candidateId]);

        http_response_code(201);
        return [
            "message" => "Enrolled successfully",
            "candidate_id" => $candidateId,
            "session_id" => $sessionId
        ];
    }
}
