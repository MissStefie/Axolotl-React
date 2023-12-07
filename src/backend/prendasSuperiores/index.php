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
    $sqlProductos = mysqli_query($conexionBD, "SELECT descipcion FROM psuperior WHERE id=" . $_GET["consultar"]);
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

$sqlPrendasSuperiores = mysqli_query($conexionBD, "SELECT * FROM `psuperior` ;");
if (mysqli_num_rows($sqlPrendasSuperiores) > 0) {
    $prendasSuperiores = mysqli_fetch_all($sqlPrendasSuperiores, MYSQLI_ASSOC);
    echo json_encode($prendasSuperiores);
} else {
    echo json_encode([["success" => 0]]);
}
