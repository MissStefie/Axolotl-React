<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servidor = 'b8efrmaprfgkjynzewxy-mysql.services.clever-cloud.com';
$usuario = 'u3mcdxgytei10bbd';
$contrasenia = 'HAjm5zFyIsaHSFzD1alf';
$nombreBaseDatos = 'b8efrmaprfgkjynzewxy';
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

if ($conexionBD->connect_error) {
    die("Error de conexión a la base de datos: " . $conexionBD->connect_error);
}

if (isset($_GET["login"])) {
    error_log("intentando loguearse");
    $data = json_decode(file_get_contents("php://input"));

    $password = mysqli_real_escape_string($conexionBD, sha1(md5($data->password)));
    $usuario = mysqli_real_escape_string($conexionBD, $data->usuario);

    $sqlSesion = mysqli_query($conexionBD, "SELECT * FROM vendedor WHERE usuario = '$usuario' AND password = '$password'");
    $sqlUsuario = mysqli_query($conexionBD, "SELECT * FROM vendedor WHERE usuario = '$usuario'");
    $sqlPassword = mysqli_query($conexionBD, "SELECT * FROM vendedor WHERE password = '$password'");

    if (mysqli_num_rows($sqlSesion) > 0) {
        $row = mysqli_fetch_assoc($sqlSesion);
        echo json_encode(["success" => 1, "data" => $row]);
    } else {
        if (mysqli_num_rows($sqlUsuario) > 0) {
            echo json_encode(["success" => 2]);
        } else {
            if (mysqli_num_rows($sqlPassword) > 0) {
                echo json_encode(["success" => 3]);
            } else {
                echo json_encode(["success" => 0]);
            }
        }
    }
    exit();
}
