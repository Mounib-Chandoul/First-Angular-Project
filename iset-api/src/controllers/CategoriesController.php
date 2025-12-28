<?php

declare(strict_types=1);

class CategoriesController
{
    public function __construct(private PDO $pdo) {}

    public function index(): array
    {
        $stmt = $this->pdo->query("SELECT id, name FROM categories ORDER BY name ASC");
        return $stmt->fetchAll();
    }
}
