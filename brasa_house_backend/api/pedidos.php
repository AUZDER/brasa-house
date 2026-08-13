<?php
require_once '../config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

// ---------- POST: confirmar un pedido (carrito) ----------
if ($metodo === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['idusuario']) || empty($data['items']) || empty($data['tipopago'])) {
        http_response_code(400);
        echo json_encode(["error" => "Debes iniciar sesión y tener al menos un plato en el carrito"]);
        exit();
    }

    $idusuario = $data['idusuario'];
    $tipopago = $data['tipopago'];
    $items = $data['items']; // [{idplato, cantidad, precio}]

    $total = 0;
    foreach ($items as $item) {
        $total += $item['cantidad'] * $item['precio'];
    }

    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare("INSERT INTO pedido (idusuario, tipopago, total) VALUES (?, ?, ?)");
        $stmt->bind_param("isd", $idusuario, $tipopago, $total);
        $stmt->execute();
        $idpedido = $stmt->insert_id;
        $stmt->close();

        $stmt2 = $conn->prepare("INSERT INTO detalle_pedido (idpedido, idplato, cantidad, subtotal) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $subtotal = $item['cantidad'] * $item['precio'];
            $stmt2->bind_param("iiid", $idpedido, $item['idplato'], $item['cantidad'], $subtotal);
            $stmt2->execute();
        }
        $stmt2->close();

        $conn->commit();
        http_response_code(201);
        echo json_encode(["mensaje" => "Pedido confirmado", "idpedido" => $idpedido, "total" => $total]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["error" => "No se pudo procesar el pedido: " . $e->getMessage()]);
    }
    exit();
}

// ---------- GET: listar pedidos (panel Admin) ----------
if ($metodo === 'GET') {
    $sql = "SELECT p.idpedido, CONCAT(u.nombres, ' ', u.apellidos) AS cliente, p.fecha_pedido, p.tipopago, p.total, p.estado
            FROM pedido p
            INNER JOIN usuario u ON p.idusuario = u.idusuario
            ORDER BY p.fecha_pedido DESC";
    $result = $conn->query($sql);
    $pedidos = [];
    while ($fila = $result->fetch_assoc()) {
        $pedidos[] = $fila;
    }
    echo json_encode($pedidos);
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
