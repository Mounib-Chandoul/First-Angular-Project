<?php
declare(strict_types=1);

class AdmCandidatesController
{
    public function __construct(private PDO $pdo) {}

    // GET /admin/candidates
    public function index(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM candidates ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    // GET /admin/candidates/{id}
    public function show(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM candidates WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            return ["error" => "Candidate not found"];
        }
        return $row;
    }

    // POST /admin/candidates
    public function store(array $body): array
    {
        $fullName  = trim((string)($body['full_name'] ?? ''));
        $email     = strtolower(trim((string)($body['email'] ?? '')));
        $phone     = trim((string)($body['phone'] ?? ''));
        $cin       = trim((string)($body['cin'] ?? ''));
        $birthDate = trim((string)($body['birth_date'] ?? ''));

        if ($fullName === '' || $email === '' || $cin === '') {
            http_response_code(400);
            return ["error" => "full_name, email, cin are required"];
        }

        $stmt = $this->pdo->prepare("
            INSERT INTO candidates (full_name, email, phone, cin, birth_date, created_at, updated_at)
            VALUES (:fn, :email, :phone, :cin, :bd, NOW(), NOW())
        ");
        $stmt->execute([
            'fn' => $fullName,
            'email' => $email,
            'phone' => $phone !== '' ? $phone : null,
            'cin' => $cin,
            'bd' => $birthDate !== '' ? $birthDate : null,
        ]);

        http_response_code(201);
        return ["message" => "Candidate created", "id" => (int)$this->pdo->lastInsertId()];
    }

    // PUT /admin/candidates/{id}
    public function update(int $id, array $body): array
    {
        $exists = $this->pdo->prepare("SELECT id FROM candidates WHERE id = :id");
        $exists->execute(['id' => $id]);
        if (!$exists->fetch()) {
            http_response_code(404);
            return ["error" => "Candidate not found"];
        }

        $fullName  = array_key_exists('full_name', $body) ? trim((string)$body['full_name']) : null;
        $email     = array_key_exists('email', $body) ? strtolower(trim((string)$body['email'])) : null;
        $phone     = array_key_exists('phone', $body) ? trim((string)$body['phone']) : null;
        $cin       = array_key_exists('cin', $body) ? trim((string)$body['cin']) : null;
        $birthDate = array_key_exists('birth_date', $body) ? trim((string)$body['birth_date']) : null;

        $stmt = $this->pdo->prepare("
            UPDATE candidates
            SET full_name = COALESCE(:fn, full_name),
                email = COALESCE(:email, email),
                phone = :phone,
                cin = COALESCE(:cin, cin),
                birth_date = :bd,
                updated_at = NOW()
            WHERE id = :id
        ");
        $stmt->execute([
            'id' => $id,
            'fn' => ($fullName !== null && $fullName !== '') ? $fullName : null,
            'email' => ($email !== null && $email !== '') ? $email : null,
            'phone' => ($phone !== null && $phone !== '') ? $phone : null,
            'cin' => ($cin !== null && $cin !== '') ? $cin : null,
            'bd' => ($birthDate !== null && $birthDate !== '') ? $birthDate : null,
        ]);

        return ["message" => "Candidate updated"];
    }

    // DELETE /admin/candidates/{id}
    public function destroy(int $id): array
    {
        $stmt = $this->pdo->prepare("DELETE FROM candidates WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            return ["error" => "Candidate not found"];
        }
        return ["message" => "Candidate deleted"];
    }
}
