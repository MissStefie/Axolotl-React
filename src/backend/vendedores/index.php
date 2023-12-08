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

// Consulta todos los registros de la tabla vendedor
$sqlVendedores = mysqli_query($conexionBD, "SELECT * FROM vendedor");
if (mysqli_num_rows($sqlVendedores) > 0) {
    $vendedores = mysqli_fetch_all($sqlVendedores, MYSQLI_ASSOC);
    echo json_encode($vendedores);
} else {
    echo json_encode([["success" => 0]]);
}
