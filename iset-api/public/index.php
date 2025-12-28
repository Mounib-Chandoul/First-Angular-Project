<?php

declare(strict_types=1);


header("Access-Control-Allow-Origin: *"); // later: set your frontend domain
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonResponse($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonBody(): array {
    $raw = file_get_contents("php://input");
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
require_once __DIR__ . "/../src/controllers/admin/AdmTrainersController.php";
require_once __DIR__ . "/../src/controllers/admin/AdmTrainingsController.php";
require_once __DIR__ . "/../src/controllers/admin/AdmSessionsController.php";
require_once __DIR__ . "/../src/controllers/admin/AdmCandidatesController.php";

require_once __DIR__ . "/../src/config/db.php";
require_once __DIR__ . "/../src/controllers/CategoriesController.php";
require_once __DIR__ . "/../src/controllers/TrainingsController.php";
require_once __DIR__ . "/../src/controllers/EnrollmentsController.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$basePath = "/iset-api/public";
$path = str_starts_with($uri, $basePath) ? substr($uri, strlen($basePath)) : $uri;

if ($path === '') $path = '/';

// IMPORTANT: if URL contains index.php (no rewrite), remove it
$path = preg_replace('#^/index\.php#', '', $path);
if ($path === '') $path = '/';


$pdo = getPDO();

// Routes
try {

    
    if ($method === 'GET' && $path === '/') {
        jsonResponse(["status" => "ok", "message" => "ISET API is running"]);
    }

    if ($method === 'GET' && $path === '/categories') {
        $controller = new CategoriesController($pdo);
        jsonResponse($controller->index());
    }

    if ($method === 'GET' && $path === '/trainings/search') {
        $q = $_GET['q'] ?? '';
        $controller = new TrainingsController($pdo);
        jsonResponse($controller->search($q));
    }

    if ($method === 'GET' && preg_match('#^/trainings/(\d+)$#', $path, $m)) {
        $controller = new TrainingsController($pdo);
        jsonResponse($controller->show((int)$m[1]));
    }

    if ($method === 'POST' && $path === '/enrollments') {
        $controller = new EnrollmentsController($pdo);
        jsonResponse($controller->storePublic(getJsonBody()));
    }

    if ($method === 'GET' && $path === '/admin/trainings') {
        $c = new AdmTrainingsController($pdo);
        jsonResponse($c->index());
    }

    if ($method === 'GET' && preg_match('#^/admin/trainings/(\d+)$#', $path, $m)) {
        $c = new AdmTrainingsController($pdo);
        jsonResponse($c->show((int)$m[1]));
    }

    if ($method === 'POST' && $path === '/admin/trainings') {
        $c = new AdmTrainingsController($pdo);
        jsonResponse($c->store(getJsonBody()));
    }

    if ($method === 'PUT' && preg_match('#^/admin/trainings/(\d+)$#', $path, $m)) {
        $c = new AdmTrainingsController($pdo);
        jsonResponse($c->update((int)$m[1], getJsonBody()));
    }

    if ($method === 'DELETE' && preg_match('#^/admin/trainings/(\d+)$#', $path, $m)) {
        $c = new AdmTrainingsController($pdo);
        jsonResponse($c->destroy((int)$m[1]));
    }

    if ($method === 'GET' && $path === '/admin/candidates') {
        $c = new AdmCandidatesController($pdo);
        jsonResponse($c->index());
    }

    if ($method === 'GET' && preg_match('#^/admin/candidates/(\d+)$#', $path, $m)) {
        $c = new AdmCandidatesController($pdo);
        jsonResponse($c->show((int)$m[1]));
    }

    if ($method === 'POST' && $path === '/admin/candidates') {
        $c = new AdmCandidatesController($pdo);
        jsonResponse($c->store(getJsonBody()));
    }

    if ($method === 'PUT' && preg_match('#^/admin/candidates/(\d+)$#', $path, $m)) {
        $c = new AdmCandidatesController($pdo);
        jsonResponse($c->update((int)$m[1], getJsonBody()));
    }

    if ($method === 'DELETE' && preg_match('#^/admin/candidates/(\d+)$#', $path, $m)) {
        $c = new AdmCandidatesController($pdo);
        jsonResponse($c->destroy((int)$m[1]));
    }

    if ($method === 'GET' && $path === '/admin/sessions') {
        $c = new AdmSessionsController($pdo);
        jsonResponse($c->index());
    }

    if ($method === 'GET' && preg_match('#^/admin/sessions/(\d+)$#', $path, $m)) {
        $c = new AdmSessionsController($pdo);
        jsonResponse($c->show((int)$m[1]));
    }

    if ($method === 'POST' && $path === '/admin/sessions') {
        $c = new AdmSessionsController($pdo);
        jsonResponse($c->store(getJsonBody()));
    }

    if ($method === 'PUT' && preg_match('#^/admin/sessions/(\d+)$#', $path, $m)) {
        $c = new AdmSessionsController($pdo);
        jsonResponse($c->update((int)$m[1], getJsonBody()));
    }

    if ($method === 'DELETE' && preg_match('#^/admin/sessions/(\d+)$#', $path, $m)) {
        $c = new AdmSessionsController($pdo);
        jsonResponse($c->destroy((int)$m[1]));
    }

    if ($method === 'GET' && $path === '/admin/trainers') {
        $c = new AdmTrainersController($pdo);
        jsonResponse($c->index());
    }

    if ($method === 'GET' && preg_match('#^/admin/trainers/(\d+)$#', $path, $m)) {
        $c = new AdmTrainersController($pdo);
        jsonResponse($c->show((int)$m[1]));
    }

    if ($method === 'POST' && $path === '/admin/trainers') {
        $c = new AdmTrainersController($pdo);
        jsonResponse($c->store(getJsonBody()));
    }

    if ($method === 'PUT' && preg_match('#^/admin/trainers/(\d+)$#', $path, $m)) {
        $c = new AdmTrainersController($pdo);
        jsonResponse($c->update((int)$m[1], getJsonBody()));
    }

    if ($method === 'DELETE' && preg_match('#^/admin/trainers/(\d+)$#', $path, $m)) {
        $c = new AdmTrainersController($pdo);
        jsonResponse($c->destroy((int)$m[1]));
    }


    // Repeat same pattern for trainings, sessions, candidates...


    // Not found
    jsonResponse(["error" => "Route not found"], 404);

} catch (Throwable $e) {
    jsonResponse([
        "error" => "Server error",
        "message" => $e->getMessage()
    ], 500);
}

