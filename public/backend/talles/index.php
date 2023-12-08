<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servidor = 'localhost'; 
$usuario = 'id21641321_root'; 
$contrasenia = 'id21641321_rootA'; 
$nombreBaseDatos = 'id21641321_axolotl';
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

$sqlPrendasSuperiores = mysqli_query($conexionBD, "SELECT * FROM `talle` ;");
if (mysqli_num_rows($sqlPrendasSuperiores) > 0) {
    $prendasSuperiores = mysqli_fetch_all($sqlPrendasSuperiores, MYSQLI_ASSOC);
    echo json_encode($prendasSuperiores);
} else {
    echo json_encode([["success" => 0]]);
}
