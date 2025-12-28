<?php
// src/controllers/admin/AdminTrainersController.php
declare(strict_types=1);

class AdmTrainersController
{
    public function __construct(private PDO $pdo) {}

    // GET /admin/trainers
    public function index(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM trainers ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    // GET /admin/trainers/{id}
    public function show(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM trainers WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            return ["error" => "Trainer not found"];
        }
        return $row;
    }

    // POST /admin/trainers
    // body example:
    // { "full_name":"...", "email":"...", "phone":"...", "cin":"...", "specialties":"..." }
    public function store(array $body): array
    {
        $fullName = trim((string)($body['full_name'] ?? ''));
        $email    = strtolower(trim((string)($body['email'] ?? '')));
        $phone    = trim((string)($body['phone'] ?? ''));
        $cin      = trim((string)($body['cin'] ?? ''));
        $spec     = trim((string)($body['specialties'] ?? ''));

        if ($fullName === '' || $email === '') {
            http_response_code(400);
            return ["error" => "full_name and email are required"];
        }

        // If your trainers table has specialties as a column, this works.
        // If specialties is a separate table, tell me and I’ll adapt.
        $stmt = $this->pdo->prepare("
            INSERT INTO trainers (full_name, email, phone, cin, specialties, created_at, updated_at)
            VALUES (:full_name, :email, :phone, :cin, :spec, NOW(), NOW())
        ");

        $stmt->execute([
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone ?: null,
            'cin' => $cin ?: null,
            'spec' => $spec ?: null,
        ]);

        http_response_code(201);
        return ["message" => "Trainer created", "id" => (int)$this->pdo->lastInsertId()];
    }

    // PUT /admin/trainers/{id}
    public function update(int $id, array $body): array
    {
        // ensure exists
        $exists = $this->pdo->prepare("SELECT id FROM trainers WHERE id = :id");
        $exists->execute(['id' => $id]);
        if (!$exists->fetch()) {
            http_response_code(404);
            return ["error" => "Trainer not found"];
        }

        $fullName = trim((string)($body['full_name'] ?? ''));
        $email    = strtolower(trim((string)($body['email'] ?? '')));
        $phone    = trim((string)($body['phone'] ?? ''));
        $cin      = trim((string)($body['cin'] ?? ''));
        $spec     = trim((string)($body['specialties'] ?? ''));

        $stmt = $this->pdo->prepare("
            UPDATE trainers
            SET full_name = COALESCE(:full_name, full_name),
                email     = COALESCE(:email, email),
                phone     = :phone,
                cin       = :cin,
                specialties = :spec,
                updated_at = NOW()
            WHERE id = :id
        ");

        $stmt->execute([
            'id' => $id,
            'full_name' => $fullName !== '' ? $fullName : null,
            'email' => $email !== '' ? $email : null,
            'phone' => $phone !== '' ? $phone : null,
            'cin' => $cin !== '' ? $cin : null,
            'spec' => $spec !== '' ? $spec : null,
        ]);

        return ["message" => "Trainer updated"];
    }

    // DELETE /admin/trainers/{id}
    public function destroy(int $id): array
    {
        $stmt = $this->pdo->prepare("DELETE FROM trainers WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            return ["error" => "Trainer not found"];
        }

        return ["message" => "Trainer deleted"];
    }
}
