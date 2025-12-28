<?php
// src/config/db.php

declare(strict_types=1);

function getPDO(): PDO
{
    $host = "127.0.0.1";
    $db   = "ISET_TRAINING";    
    $user = "pmauser";        
    $pass = "StrongPass123!";       
    $charset = "utf8mb4";

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    return new PDO($dsn, $user, $pass, $options);
}






?>