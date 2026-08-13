<?php
require_once '../config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

// Verifica el token de reCAPTCHA contra los servidores de Google
function verificarRecaptcha($token) {
    // Clave SECRETA de PRUEBA de Google (siempre aprueba). Reemplázala por la tuya
    // en https://www.google.com/recaptcha/admin cuando quieras la versión real.
    $secretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
    $url = "https://www.google.com/recaptcha/api/siteverify";

    $opciones = ["http" => [
        "method" => "POST",
        "header" => "Content-Type: application/x-www-form-urlencoded",
        "content" => http_build_query(["secret" => $secretKey, "response" => $token])
    ]];
    $contexto = stream_context_create($opciones);
    $resultado = @file_get_contents($url, false, $contexto);
    if ($resultado === false) return false;

    $respuesta = json_decode($resultado, true);
    return isset($respuesta['success']) && $respuesta['success'] === true;
}

if ($metodo === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $accion = $data['accion'] ?? '';

    // ---------- REGISTRO ----------
    if ($accion === 'registro') {
        $nombres = trim($data['nombres'] ?? '');
        $apellidos = trim($data['apellidos'] ?? '');
        $correo = trim($data['correo'] ?? '');
        $celular = trim($data['celular'] ?? '');
        $password = $data['password'] ?? '';
        $recaptchaToken = $data['recaptcha'] ?? '';

        if (empty($nombres) || empty($apellidos) || empty($correo) || empty($celular) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "Todos los campos son obligatorios"]);
            exit();
        }
        if (!preg_match('/^9\d{8}$/', $celular)) {
            http_response_code(400);
            echo json_encode(["error" => "El celular debe tener 9 dígitos y empezar con 9"]);
            exit();
        }
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["error" => "El correo no tiene un formato válido"]);
            exit();
        }
        if (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:,.<>?\/]).{8,}$/', $password)) {
            http_response_code(400);
            echo json_encode(["error" => "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un signo"]);
            exit();
        }
        if (!verificarRecaptcha($recaptchaToken)) {
            http_response_code(400);
            echo json_encode(["error" => "Verificación reCAPTCHA fallida, intenta de nuevo"]);
            exit();
        }

        $stmt = $conn->prepare("SELECT idusuario FROM usuario WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "Ya existe una cuenta con ese correo"]);
            exit();
        }
        $stmt->close();

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt2 = $conn->prepare("INSERT INTO usuario (nombres, apellidos, correo, celular, password) VALUES (?, ?, ?, ?, ?)");
        $stmt2->bind_param("sssss", $nombres, $apellidos, $correo, $celular, $passwordHash);

        if ($stmt2->execute()) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Cuenta creada correctamente, ya puedes iniciar sesión"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo registrar: " . $conn->error]);
        }
        $stmt2->close();
        exit();
    }

    // ---------- LOGIN ----------
    if ($accion === 'login') {
        $correo = trim($data['correo'] ?? '');
        $password = $data['password'] ?? '';

        $stmt = $conn->prepare("SELECT idusuario, nombres, apellidos, correo, celular, password, bloqueado FROM usuario WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(["error" => "Correo o contraseña incorrectos"]);
            exit();
        }

        $usuario = $result->fetch_assoc();

        if (!password_verify($password, $usuario['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "Correo o contraseña incorrectos"]);
            exit();
        }

        if ($usuario['bloqueado'] == 1) {
            http_response_code(403);
            echo json_encode(["error" => "Tu cuenta ha sido bloqueada por el administrador"]);
            exit();
        }

        unset($usuario['password']);
        echo json_encode(["mensaje" => "Login correcto", "usuario" => $usuario]);
        exit();
    }

    http_response_code(400);
    echo json_encode(["error" => "Acción no reconocida"]);
    exit();
}

// ---------- GET: listar usuarios (panel Admin) ----------
if ($metodo === 'GET') {
    $result = $conn->query("SELECT idusuario, nombres, apellidos, correo, celular, bloqueado, fecha_registro FROM usuario ORDER BY fecha_registro DESC");
    $usuarios = [];
    while ($fila = $result->fetch_assoc()) {
        $usuarios[] = $fila;
    }
    echo json_encode($usuarios);
    exit();
}

// ---------- PUT: bloquear / desbloquear usuario ----------
if ($metodo === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['idusuario']) || !isset($data['bloqueado'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos (idusuario, bloqueado)"]);
        exit();
    }
    $stmt = $conn->prepare("UPDATE usuario SET bloqueado = ? WHERE idusuario = ?");
    $stmt->bind_param("ii", $data['bloqueado'], $data['idusuario']);
    $stmt->execute();
    echo json_encode(["mensaje" => "Estado de usuario actualizado"]);
    $stmt->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Método no permitido"]);
