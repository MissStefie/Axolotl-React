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

$sqlPrendasSuperiores = mysqli_query($conexionBD, "SELECT * FROM `color` ;");
if (mysqli_num_rows($sqlPrendasSuperiores) > 0) {
    $prendasSuperiores = mysqli_fetch_all($sqlPrendasSuperiores, MYSQLI_ASSOC);
    echo json_encode($prendasSuperiores);
} else {
    echo json_encode([["success" => 0]]);
}
