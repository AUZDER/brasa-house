<?php
require_once '../config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $result = $conn->query("SELECT * FROM plato ORDER BY categoria, idplato");
    $platos = [];
    while ($fila = $result->fetch_assoc()) {
        $platos[] = $fila;
    }
    echo json_encode($platos);
    exit();
}

if ($metodo === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['idplato']) || empty($data['estado'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos (idplato, estado)"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE plato SET estado = ? WHERE idplato = ?");
    $stmt->bind_param("si", $data['estado'], $data['idplato']);
    $stmt->execute();
    echo json_encode(["mensaje" => "Estado del plato actualizado"]);
    $stmt->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
