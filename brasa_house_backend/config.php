<?php
// Permitir que React (localhost:3000) consuma esta API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Si el navegador manda una petición OPTIONS (preflight), respondemos vacío
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Datos de conexión (ajusta si tu XAMPP tiene otro usuario/contraseña)
$host = "localhost";
$user = "root";
$pass = "";
$db   = "brasahouse";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");
