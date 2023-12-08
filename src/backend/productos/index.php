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


// Consulta datos y recepciona una clave para consultar dichos datos con dicha clave
if (isset($_GET["consultar"])) {
    $sqlProductos = mysqli_query($conexionBD, "SELECT * FROM producto WHERE id=" . $_GET["consultar"]);
    if (mysqli_num_rows($sqlProductos) > 0) {
        $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
        echo json_encode($productos);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

//borrar pero se le debe de enviar una clave ( para borrado )
if (isset($_GET["borrar"])) {
    $sqlProductos = mysqli_query($conexionBD, "update producto set estado = 'inactivo' where id=" . $_GET["borrar"]);
    if ($sqlProductos) {
        echo json_encode(["success" => 1]);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}
//Inserta un nuevo registro y recepciona en método post los datos de nombre y correo
if (isset($_GET["insertar"])) {
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;
    $psuperiorid = $data->psuperiorid;
    $pinferiorid = $data->pinferiorid;
    $accesorioid = $data->accesorioid;
    $colorid = $data->colorid;
    $tamanoid = $data->tamanoid;
    $talleid = $data->talleid;
    $nombre = $data->nombre;
    $descripcion = $data->descripcion;
    $preciocpa = $data->preciocpa;
    $preciovta = $data->preciovta;
    $cantidad = $data->cantidad;
    $descuento = $data->descuento;
    if ($descuento === "") {
        $descuento = 0;
    }
    //$preciodct=$data->preciodct;
    if (($codigo != "" && $psuperiorid != "" && $pinferiorid != "" && $accesorioid != "" && $colorid != "" && $tamanoid != "" && $talleid != "" && $nombre != "" && $descripcion != "" && $preciocpa != "" && $preciovta != "" && $cantidad != "" && $descuento != ""/*&&$preciodct!=""*/)) {

        $sqlProductos = mysqli_query($conexionBD, "INSERT INTO producto(colorid,tamanoid,talleid,psuperiorid,pinferiorid,accesorioid,nombre,descripcion,preciocpa,preciovta,codigo,cantidad,descuento, preciodct, estado) VALUES('$colorid','$tamanoid','$talleid','$psuperiorid','$pinferiorid','$accesorioid','$nombre','$descripcion','$preciocpa','$preciovta','$codigo','$cantidad','$descuento','$preciovta'-('$preciovta' * '$descuento' / 100),'activo')");
        echo json_encode(["success" => 1]);
    }
    exit();
}
// Actualiza datos pero recepciona datos de nombre, correo y una clave para realizar la actualización
if (isset($_GET["actualizar"])) {
    error_log("dentro de actualizar");
    $data = json_decode(file_get_contents("php://input"));

    $id = (isset($data->id)) ? $data->id : $_GET["actualizar"];
    $codigo = $data->codigo;
    $nombre = $data->nombre;
    $descripcion = $data->descripcion;
    $preciocpa = $data->preciocpa;
    $preciovta = $data->preciovta;
    $cantidad = $data->cantidad;
    $descuento = $data->descuento;
    //$preciodct = $data->preciodct;

    $sqlProductos = mysqli_query($conexionBD, "UPDATE producto SET codigo = '$codigo',nombre = '$nombre', descripcion = '$descripcion', preciocpa = '$preciocpa', preciovta = '$preciovta', descuento = '$descuento', preciodct = ('$preciovta'-('$preciovta' * '$descuento' / 100)), cantidad = '$cantidad' WHERE id = $id");
    echo json_encode(["success" => 1]);
    exit();
}
// Consulta todos los registros de la tabla productos
$sqlProductos = mysqli_query($conexionBD, "select p.id, p.nombre, p.descripcion, p.preciocpa, p.preciovta, p.codigo, p.cantidad, p.descuento, p.preciodct, c.descripcion as colorid, t.descripcion as tamanoid, l.descripcion as talleid, s.descripcion as psuperiorid, i.descripcion as pinferiorid, a.descripcion as accesorioid from producto p inner join color c on p.colorid = c.id inner join tamano t on p.tamanoid = t.id inner join talle l on p.talleid = l.id inner join psuperior s on p.psuperiorid = s.id inner join pinferior i on p.pinferiorid = i.id inner join accesorio a on p.accesorioid = a.id where estado = 'activo'");
if (mysqli_num_rows($sqlProductos) > 0) {
    $productos = mysqli_fetch_all($sqlProductos, MYSQLI_ASSOC);
    echo json_encode($productos);
} else {
    echo json_encode([["success" => 0]]);
}
