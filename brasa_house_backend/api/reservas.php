<?php
require_once '../config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

// ---------- GET: listar todas las reservas (panel Admin) ----------
if ($metodo === 'GET') {
    $sql = "SELECT r.idreserva,
                   COALESCE(CONCAT(u.nombres, ' ', u.apellidos), c.nombre) AS nombre,
                   COALESCE(u.celular, c.telefono) AS telefono,
                   m.numero AS mesa,
                   r.fecha, r.hora, r.personas, r.ocasion, r.mensaje, r.estado
            FROM reserva r
            LEFT JOIN usuario u ON r.idusuario = u.idusuario
            LEFT JOIN cliente c ON r.idcliente = c.idcliente
            LEFT JOIN mesa m ON r.idmesa = m.idmesa
            ORDER BY r.fecha DESC, r.hora DESC";
    $result = $conn->query($sql);

    $reservas = [];
    while ($fila = $result->fetch_assoc()) {
        $reservas[] = $fila;
    }
    echo json_encode($reservas);
    exit();
}

// ---------- POST: crear una nueva reserva (requiere usuario logueado) ----------
if ($metodo === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['idusuario']) || empty($data['fecha']) || empty($data['hora']) || empty($data['idmesa'])) {
        http_response_code(400);
        echo json_encode(["error" => "Debes iniciar sesión y completar mesa, fecha y hora"]);
        exit();
    }

    $idusuario = $data['idusuario'];
    $idmesa = $data['idmesa'];

    // Verificar que el usuario exista y no esté bloqueado
    $stmtU = $conn->prepare("SELECT bloqueado FROM usuario WHERE idusuario = ?");
    $stmtU->bind_param("i", $idusuario);
    $stmtU->execute();
    $resU = $stmtU->get_result();
    if ($resU->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Usuario no encontrado, vuelve a iniciar sesión"]);
        exit();
    }
    $usuarioRow = $resU->fetch_assoc();
    if ($usuarioRow['bloqueado'] == 1) {
        http_response_code(403);
        echo json_encode(["error" => "Tu cuenta está bloqueada y no puede hacer reservas"]);
        exit();
    }
    $stmtU->close();

    // Límite: máximo 2 reservas activas (desde hoy en adelante) por usuario
    $stmtC = $conn->prepare("SELECT COUNT(*) AS total FROM reserva WHERE idusuario = ? AND fecha >= CURDATE()");
    $stmtC->bind_param("i", $idusuario);
    $stmtC->execute();
    $totalActivas = $stmtC->get_result()->fetch_assoc()['total'];
    $stmtC->close();

    if ($totalActivas >= 2) {
        http_response_code(429);
        echo json_encode(["error" => "Ya tienes el máximo de 2 reservas activas permitidas"]);
        exit();
    }

    // Verificar que esa mesa no esté ya reservada para esa fecha y hora
    $stmtM = $conn->prepare("SELECT idreserva FROM reserva WHERE idmesa = ? AND fecha = ? AND hora = ?");
    $stmtM->bind_param("iss", $idmesa, $data['fecha'], $data['hora']);
    $stmtM->execute();
    if ($stmtM->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["error" => "Esa mesa ya está reservada para esa fecha y hora. Elige otra mesa u horario."]);
        exit();
    }
    $stmtM->close();

    $ocasion = $data['ocasion'] ?? '';
    $mensaje = $data['mensaje'] ?? '';
    $personas = $data['personas'] ?? 2;

    $stmt3 = $conn->prepare("INSERT INTO reserva (idusuario, idmesa, fecha, hora, personas, ocasion, mensaje)
                              VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt3->bind_param("iississ", $idusuario, $idmesa, $data['fecha'], $data['hora'], $personas, $ocasion, $mensaje);

    if ($stmt3->execute()) {
        http_response_code(201);
        echo json_encode(["mensaje" => "Reserva creada correctamente", "idreserva" => $stmt3->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo crear la reserva: " . $conn->error]);
    }
    $stmt3->close();
    exit();
}

// ---------- PUT: cambiar estado de una reserva ----------
if ($metodo === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['idreserva']) || empty($data['estado'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos (idreserva, estado)"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE reserva SET estado = ? WHERE idreserva = ?");
    $stmt->bind_param("si", $data['estado'], $data['idreserva']);
    $stmt->execute();
    echo json_encode(["mensaje" => "Estado actualizado"]);
    $stmt->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
