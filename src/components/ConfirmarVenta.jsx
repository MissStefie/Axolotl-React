import React from "react";
import { Container, Table } from "@mui/material";
import { Link } from "react-router-dom";
import "../css/confirmarVenta.css";
import swal from "sweetalert2";
import NavConfirmarVenta from "./NavConfirmarVenta";
import ApiPV from "../services/procesoVenta";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class ConfirmarVenta extends React.Component {
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

  mostrarAlertaRetirar = (indice) => {
    const producto = this.state.filasSeleccionadas[indice];
    swal
      .fire({
        title: "Retirar producto",
        text: `¿Está seguro que desea retirar el producto "${producto.codigo}"?`,
        icon: "question",
        confirmButtonText: "Sí, retirar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        customClass: {
          popup: "popup-class",
          title: "my-swal-title",
          text: "my-swal-text",
          content: "my-swal-content",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
        },
      })
      .then((respuestaAlert) => {
        if (respuestaAlert.isConfirmed) {
          this.eliminarFila(indice);
          swal.fire({
            text: "El producto se ha retirado exitosamente.",
            icon: "success",
            customClass: {
              popup: "popup-class",
              title: "my-swal-title",
              text: "my-swal-text",
              content: "my-swal-content",
              icon: "my-swal-icon",
              confirmButton: "swal-confirm",
              cancelButton: "swal-cancel",
            },
          });
        }
      });
  };

  mostrarAlertaConfirmarVenta = () => {
    swal
      .fire({
        title: "Confirmar venta",
        text: "¿Quiere confirmar la venta?",
        icon: "question",
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        customClass: {
          popup: "popup-class",
          title: "my-swal-title",
          text: "my-swal-text",
          content: "my-swal-content",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
        },
      })
      .then((respuestaAlert) => {
        if (respuestaAlert.isConfirmed) {
          if (this.state.filasSeleccionadas.length === 0) {
            swal.fire({
              title: "Error",
              text: "No se puede realizar la venta sin productos seleccionados.",
              icon: "error",
              customClass: {
                popup: "popup-class",
                title: "my-swal-title",
                text: "my-swal-text",
                content: "my-swal-content",
                icon: "my-swal-icon",
                confirmButton: "swal-confirm",
                cancelButton: "swal-cancel",
              },
            });
          } else {
            this.procesarVenta();
            swal.fire({
              text: "Confirmado.",
              icon: "success",
              customClass: {
                popup: "popup-class",
                title: "my-swal-title",
                text: "my-swal-text",
                content: "my-swal-content",
                icon: "my-swal-icon",
                confirmButton: "swal-confirm",
                cancelButton: "swal-cancel",
              },
            });
          }
        }
      });
  };

  procesarVenta = () => {
    console.log("Dentro de funcion procesar venta...");

    const datosEnviar = {
      productos: this.state.filasSeleccionadas,
      precioTotal: this.calcularPrecioTotal(),
    };

    console.log("Datos a enviar:", datosEnviar);

    fetch(ApiPV + "?procesar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log("Respuesta de la API:", datosRespuesta);
        this.props.history.push("/menu_principal");
      })
      .catch(console.error);
  };

  render() {
    const { user } = this.props;
    console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }

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
                    <th className="ocultar_columnaConfirmarVenta">ID</th>
                    <th>Codigo</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th className="ocultar_columnaConfirmarVenta">
                      Prenda Superior
                    </th>
                    <th className="ocultar_columnaConfirmarVenta">
                      Prenda Inferior
                    </th>
                    <th className="ocultar_columnaConfirmarVenta">Accesorio</th>
                    <th>Color</th>
                    <th>Tamaño/Talle</th>
                    <th className="ocultar_columnaConfirmarVenta">Tamaño</th>
                    <th className="ocultar_columnaConfirmarVenta">Talle</th>
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
                      <td className="ocultar_columnaConfirmarVenta">
                        {fila.id}
                      </td>
                      <td>{fila.codigo}</td>
                      {fila.psuperiorid !== "NULL" &&
                      fila.pinferiorid === "NULL" &&
                      fila.accesorioid === "NULL" ? (
                        <td>Superior</td>
                      ) : fila.psuperiorid === "NULL" &&
                        fila.pinferiorid !== "NULL" &&
                        fila.accesorioid === "NULL" ? (
                        <td>Inferior</td>
                      ) : fila.psuperiorid === "NULL" &&
                        fila.pinferiorid === "NULL" &&
                        fila.accesorioid !== "NULL" ? (
                        <td>Accesorio</td>
                      ) : (
                        <td></td>
                      )}
                      {fila.psuperiorid !== "NULL" &&
                      fila.pinferiorid === "NULL" &&
                      fila.accesorioid === "NULL" ? (
                        <td>{fila.psuperiorid}</td>
                      ) : fila.psuperiorid === "NULL" &&
                        fila.pinferiorid !== "NULL" &&
                        fila.accesorioid === "NULL" ? (
                        <td>{fila.pinferiorid}</td>
                      ) : fila.psuperiorid === "NULL" &&
                        fila.pinferiorid === "NULL" &&
                        fila.accesorioid !== "NULL" ? (
                        <td>{fila.accesorioid}</td>
                      ) : (
                        <td></td>
                      )}
                      <td className="ocultar_columnaConfirmarVenta">
                        {fila.psuperiorid}
                      </td>
                      <td className="ocultar_columnaConfirmarVenta">
                        {fila.pinferiorid}
                      </td>
                      <td className="ocultar_columnaConfirmarVenta">
                        {fila.accesorioid}
                      </td>
                      <td>{fila.colorid}</td>
                      {fila.tamanoid !== "NULL" && fila.talleid === "NULL" ? (
                        <td>{fila.tamanoid}</td>
                      ) : fila.tamanoid === "NULL" &&
                        fila.talleid !== "NULL" ? (
                        <td>{fila.talleid}</td>
                      ) : (
                        <td></td>
                      )}
                      <td className="ocultar_columnaConfirmarVenta">
                        {fila.tamanoid}
                      </td>
                      <td className="ocultar_columnaConfirmarVenta">
                        {fila.talleid}
                      </td>
                      <td>{fila.nombre}</td>
                      <td>{fila.descripcion}</td>
                      <td>{fila.preciovta}</td>
                      <td>{fila.cantidad}</td>
                      <td>{fila.descuento}</td>
                      <td>{fila.preciodct}</td>
                      <td>{fila.cantidad * fila.preciodct}</td>

                      <td>
                        <button
                          onClick={() => this.mostrarAlertaRetirar(indice)}
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
          <Link className="agrPrdConfirmarVentaLink" to={"/realizar_venta"}>
            Añadir producto
          </Link>
        </div>

        <div className="precioTotalConfirmarVenta">
          Precio total {precioTotal} Gs.
        </div>
        <div
          className="btn-group grupoBotonesConfirmarVenta"
          role="group"
          aria-label=""
        >
          <button
            onClick={this.mostrarAlertaConfirmarVenta}
            type="submit"
            className="btn boton-guardarConfirmarVenta"
          >
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

ConfirmarVenta.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    correo: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired,
    telefono: PropTypes.string.isRequired,
    usuario: PropTypes.string.isRequired,
  }),
};
