import React from "react";
import { Container, Table } from "@mui/material";
import { Link } from "react-router-dom";
import "../css/confirmarVenta.css";
import NavConfirmarVenta from "./NavConfirmarVenta";

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

  calcularPrecioTotal = () => {
    let precioTotal = 0;
    this.state.filasSeleccionadas.forEach((fila) => {
      precioTotal += fila.cantidad * fila.preciodct;
    });
    return precioTotal;
  };

  render() {
    const precioTotal = this.calcularPrecioTotal();
    return (
      <Container>
        <NavConfirmarVenta />
        <div className="card-headerConfirmarVenta">
          <div className="contenidoListarConfirmarVenta">
            <div className="scrollTablaConfirmarVenta">
              <Table className="tablaConfirmarVenta" id="tablaConfirmarVenta">
                <thead className="tabla-headerConfirmarVenta">
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
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Descuento</th>
                    <th>Precio Descontado</th>
                    <th>Total</th>

                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="tabla-containerConfirmarVenta">
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
                      <td>{fila.cantidad}</td>
                      <td>{fila.descuento}</td>
                      <td>{fila.preciodct}</td>
                      <td>{fila.cantidad * fila.preciodct}</td>

                      <td>
                        <button
                          onClick={() => this.eliminarFila(indice)}
                          className="btn boton-retirar"
                        >
                          Retirar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="agrPrdConfirmarVenta">
          <Link to={"/realizar_venta"}>Añadir producto</Link>
        </div>

        <div className="precioTotalConfirmarVenta">
          Precio total {precioTotal} Gs.
        </div>
        <div
          className="btn-group grupoBotonesConfirmarVenta"
          role="group"
          aria-label=""
        >
          <button type="submit" className="btn boton-guardarConfirmarVenta">
            Confirmar venta
          </button>
          <Link
            to={"/menu_principal"}
            className="btn boton-cancelarConfirmarVenta"
          >
            Cancelar venta
          </Link>
        </div>
      </Container>
    );
  }
}

export default ConfirmarVenta;
