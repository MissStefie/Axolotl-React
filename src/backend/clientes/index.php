<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servidor = getenv("DB_SERVER") ?: "localhost";
$usuario = getenv("DB_USER") ?: "root";
$contrasenia = getenv("DB_PASSWORD") ?: "";
$nombreBaseDatos = getenv("DB_NAME") ?: "axolotl";
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);


if (isset($_GET["consultar"])) {
    $ruc = $_GET["consultar"];
    error_log("Valor de ruc recibido: " . $ruc);
    $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM cliente WHERE ruc= '$ruc' AND estado = 'activo'");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        echo json_encode([]);
    }
}

if (isset($_GET["consultarRucs"])) {
    $sqlProductos = mysqli_query($conexionBD, "SELECT ruc FROM cliente WHERE estado = 'activo'");
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        echo json_encode([]);
    }
}

if (isset($_GET["actualizar"])) {
    error_log("dentro de actualizar");
    $data = json_decode(file_get_contents("php://input"));

    $id = (isset($data->id)) ? $data->id : $_GET["actualizar"];
    $ruc = $data->ruc;
    $nombre = $data->nombre;
    $apellido = $data->apellido;
    $direccion = $data->direccion;

    $sqlProductos = mysqli_query($conexionBD, "UPDATE cliente SET ruc = '$ruc',nombre = '$nombre', apellido = '$apellido', direccion = '$direccion' WHERE id = $id");
    echo json_encode(["success" => 1]);
    exit();
}

if (isset($_GET["borrar"])) {
    $data = json_decode(file_get_contents("php://input"));

    $id = $data;

    $sqlProductos = mysqli_query($conexionBD, "update cliente set estado = 'inactivo' where id= $id");
    if ($sqlProductos) {
        echo json_encode(["success" => 1]);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

// Consulta todos los registros de la tabla cliente
$sqlClientes = mysqli_query($conexionBD, "SELECT * FROM cliente");
if (mysqli_num_rows($sqlClientes) > 0) {
    $clientes = mysqli_fetch_all($sqlClientes, MYSQLI_ASSOC);
    echo json_encode($clientes);
} else {
    echo json_encode([["success" => 0]]);
}
