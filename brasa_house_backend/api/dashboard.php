<?php
require_once '../config.php';

$reservasHoy = $conn->query("SELECT COUNT(*) AS total FROM reserva WHERE fecha = CURDATE()")->fetch_assoc()['total'];
$mesasOcupadas = $conn->query("SELECT COUNT(*) AS total FROM mesa WHERE estado = 'Ocupada'")->fetch_assoc()['total'];
$mesasTotal = $conn->query("SELECT COUNT(*) AS total FROM mesa")->fetch_assoc()['total'];
$clientesSemana = $conn->query("SELECT COUNT(DISTINCT idusuario) AS total FROM reserva WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_assoc()['total'];

echo json_encode([
    "reservasHoy" => (int)$reservasHoy,
    "mesasOcupadas" => (int)$mesasOcupadas,
    "mesasTotal" => (int)$mesasTotal,
    "clientesSemana" => (int)$clientesSemana
]);
