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
// Verifica si la solicitud es un POST

/*	id (int)	vendedorid (int)	clienteid (int)	cantidad (int)	fecha (date)	codventa (int)	preciounit (int)	precioxcant (int)	totalventa (int)	*/


if (isset($_GET["procesar"])) {
    $data = json_decode(file_get_contents("php://input"));

    $totalventa = $data->precioTotal;
    $vendedorId = $data->vendedorId;
    $fecha_de_hoy = $data->fecha;
    $fecha_de_hoy = date("Y-m-d", strtotime($fecha_de_hoy));

    $cliente_ruc = $data->selectedRuc;
    $sql_buscar_id = "SELECT id FROM cliente WHERE ruc = '$cliente_ruc'";
    $resultado_id = $conexionBD->query($sql_buscar_id);

    if ($resultado_id && $resultado_id->num_rows > 0) {
        $fila = $resultado_id->fetch_assoc();
        $clienteId = $fila['id'];
    } else {
        echo "No se encontró un cliente con el RUC proporcionado.";
    }

    $sql_cantidad_ventas = 'UPDATE ventas_realizadas SET cantidad = cantidad + 1 WHERE id = 1';
    $resultado_cantidad_ventas = mysqli_query($conexionBD, $sql_cantidad_ventas);
    $sql_obtener_cantidad = 'SELECT cantidad FROM ventas_realizadas WHERE id = 1';
    $resultado_obtener_cantidad = mysqli_query($conexionBD, $sql_obtener_cantidad);

    if ($resultado_obtener_cantidad) {
        $fila = mysqli_fetch_assoc($resultado_obtener_cantidad);
        $cantidad_ventas = $fila['cantidad'];
    }
    $codventa = "GSV" . str_pad($cantidad_ventas, 4, "0", STR_PAD_LEFT);

    // Itera a través de los datos de la venta
    foreach ($data->productos as $venta) {
        $producto_id = $venta->id;
        $cantidad = $venta->cantidad;
        $preciounit = $venta->preciovta;
        $precioxcant = $preciounit * $cantidad;

        // Realiza una consulta SQL para actualizar la cantidad en la tabla de productos
        $sql = "UPDATE producto SET cantidad = cantidad - $cantidad WHERE id = $producto_id";


        $sqlVenta = "INSERT INTO venta (vendedorid, clienteid, cantidad, fecha, codventa, preciounit, precioxcant, totalventa, productoid) VALUES ($vendedorId, $clienteId, $cantidad, '$fecha_de_hoy', '$codventa', $preciounit, $precioxcant, $totalventa, $producto_id)";

        // Ejecuta la consulta
        if ($conexionBD->query($sql) === TRUE and $conexionBD->query($sqlVenta) === TRUE) {
            // Operación exitosa
            // Puedes hacer algo aquí si lo deseas
        } else {
            // Error en la consulta SQL
            $response = [
                "exito" => false,
                "mensaje" => "Error en la actualización de la cantidad de productos."
            ];
            header("HTTP/1.1 500 Internal Server Error");
            header("Content-Type: application/json");
            echo json_encode($response);
            exit();
        }
    }

    // Prepara una respuesta JSON
    $response = [
        "exito" => true,
        "mensaje" => "Venta confirmada exitosamente."
    ];

    // Envía la respuesta JSON
    header("Content-Type: application/json");
    echo json_encode($response);
    exit();
}
// Consulta todos los registros de la tabla venta
$sqlVentas = mysqli_query($conexionBD, "SELECT * FROM venta");
if (mysqli_num_rows($sqlVentas) > 0) {
    $registrosVentas = mysqli_fetch_all($sqlVentas, MYSQLI_ASSOC);
    echo json_encode($registrosVentas);
} else {
    echo json_encode([["success" => 0]]);
}
