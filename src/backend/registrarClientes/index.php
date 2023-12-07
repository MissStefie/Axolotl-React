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

if (isset($_GET["insertar"])) {
    $data = json_decode(file_get_contents("php://input"));

    // Acceder a las propiedades del objeto $data
    $nombre = $data->nombre;
    $apellido = $data->apellido;
    $ruc = $data->ruc;
    $direccion = $data->direccion;
    $rucExiste = 0;
    $estado = 'activo';

    $consultaExiste = $conexionBD->prepare("SELECT COUNT(*) AS ruc_count FROM cliente WHERE ruc = ?");
    $consultaExiste->bind_param("s", $ruc);
    $consultaExiste->execute();
    $resultadoConsulta = $consultaExiste->get_result();
    $row = $resultadoConsulta->fetch_assoc();
    $consultaExiste->close();

    if ($row['ruc_count'] > 0) {
        // El RUC ya existe, obtenemos el estado correspondiente
        $consultaEstado = $conexionBD->prepare("SELECT estado FROM cliente WHERE ruc = ?");
        $consultaEstado->bind_param("s", $ruc);
        $consultaEstado->execute();
        $resultadoEstado = $consultaEstado->get_result();
        $rowEstado = $resultadoEstado->fetch_assoc();

        $estado = $rowEstado['estado'];  // Almacenamos el estado correspondiente

        $rucExiste = 1;  // El RUC ya existe
        $consultaEstado->close();
    } else {
        // Si el RUC no existe, proceder con la inserción
        if ($rucExiste === 0) {
            $sqlInsertar = $conexionBD->prepare("INSERT INTO cliente(ruc, nombre, apellido, direccion, estado) VALUES (?, ?, ?, ?, ?)");
            $sqlInsertar->bind_param("sssss", $ruc, $nombre, $apellido, $direccion, $estado);

            if ($sqlInsertar->execute()) {
                echo json_encode(["success" => true, "data" => [
                    "nombre" => $nombre,
                    "apellido" => $apellido,
                    "ruc" => $ruc,
                    "direccion" => $direccion,
                    "rucExiste" => $rucExiste
                ]]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al insertar el registro", "data" => [
                    "nombre" => $nombre,
                    "apellido" => $apellido,
                    "ruc" => $ruc,
                    "direccion" => $direccion,
                    "rucExiste" => $rucExiste
                ]]);
            }

            $sqlInsertar->close();
        }
    }

    if ($rucExiste === 1 && $estado === 'inactivo') {
        // Actualizar los datos del registro con el mismo RUC y cambiar el estado a 'activo'
        $estado = 'activo';
        $sqlActualizar = $conexionBD->prepare("UPDATE cliente SET nombre = ?, apellido = ?, direccion = ?, estado = ? WHERE ruc = ?");
        $sqlActualizar->bind_param("sssss", $nombre, $apellido, $direccion, $estado, $ruc);

        $rucExiste = 0;

        if ($sqlActualizar->execute()) {
            echo json_encode(["success" => true, "message" => "Registro actualizado y activado con éxito", "data" => [
                "nombre" => $nombre,
                "apellido" => $apellido,
                "ruc" => $ruc,
                "direccion" => $direccion,
                "rucExiste" => $rucExiste,
                "estado" => $estado
            ]]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar el registro", "data" => [
                "nombre" => $nombre,
                "apellido" => $apellido,
                "ruc" => $ruc,
                "direccion" => $direccion,
                "rucExiste" => $rucExiste,
                "estado" => $estado
            ]]);
        }

        $sqlActualizar->close();
        exit();
    } else {
        if ($rucExiste === 1 && $estado === 'activo') {
            echo json_encode(["success" => false, "message" => "El RUC ya existe en la base de datos", "data" => [
                "nombre" => $nombre,
                "apellido" => $apellido,
                "ruc" => $ruc,
                "direccion" => $direccion,
                "rucExiste" => $rucExiste
            ]]);
        }
    }

    exit();
}
