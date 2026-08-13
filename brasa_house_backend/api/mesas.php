<?php
require_once '../config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $fecha = $_GET['fecha'] ?? null;
    $hora = $_GET['hora'] ?? null;

    if ($fecha && $hora) {
        // Solo mesas que NO tienen ya una reserva en esa fecha y hora
        // (y que no estén marcadas como Ocupada manualmente por el admin)
        $stmt = $conn->prepare("
            SELECT * FROM mesa
            WHERE estado = 'Disponible'
            AND idmesa NOT IN (
                SELECT idmesa FROM reserva
                WHERE fecha = ? AND hora = ? AND idmesa IS NOT NULL
            )
            ORDER BY idmesa
        ");
        $stmt->bind_param("ss", $fecha, $hora);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query("SELECT * FROM mesa ORDER BY idmesa");
    }

    $mesas = [];
    while ($fila = $result->fetch_assoc()) {
        $mesas[] = $fila;
    }
    echo json_encode($mesas);
    exit();
}

if ($metodo === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['idmesa']) || empty($data['estado'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos (idmesa, estado)"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE mesa SET estado = ? WHERE idmesa = ?");
    $stmt->bind_param("si", $data['estado'], $data['idmesa']);
    $stmt->execute();
    echo json_encode(["mensaje" => "Estado de mesa actualizado"]);
    $stmt->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
