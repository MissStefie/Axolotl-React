import React from "react";
import { Container, Table } from "@mui/material"; // Asegúrate de importar Table desde MUI

class ConfirmarVenta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filasSeleccionadas: this.props.location.state.filasSeleccionadas,
    };
  }

  eliminarFila = (indice) => {
    const nuevasFilasSeleccionadas = [...this.state.filasSeleccionadas];
    nuevasFilasSeleccionadas.splice(indice, 1);
    this.setState({ filasSeleccionadas: nuevasFilasSeleccionadas });
  };

  render() {
    return (
      <Container>
        <h2>Detalle de las Filas Seleccionadas</h2>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Codigo</th>
              <th>Prenda Superior</th>
              <th>Prenda Inferior</th>
              <th>Accesorio</th>
              <th>Color</th>
              <th>Tamaño</th>
              <th>Talle</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio Venta</th>
              <th>Descuento</th>
              <th>Precio Descuento</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filasSeleccionadas.map((fila, indice) => (
              <tr key={fila.id}>
                <td>{fila.id}</td>
                <td>{fila.codigo}</td>
                <td>{fila.psuperiorid}</td>
                <td>{fila.pinferiorid}</td>
                <td>{fila.accesorioid}</td>
                <td>{fila.colorid}</td>
                <td>{fila.tamanoid}</td>
                <td>{fila.talleid}</td>
                <td>{fila.nombre}</td>
                <td>{fila.descripcion}</td>
                <td>{fila.preciovta}</td>
                <td>{fila.descuento}</td>
                <td>{fila.preciodct}</td>
                <td>{fila.cantidad}</td>
                <td>
                  <button onClick={() => this.eliminarFila(indice)}>Retirar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default ConfirmarVenta;
