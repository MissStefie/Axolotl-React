import React from "react";
import { Container, Table, Select, MenuItem, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import "../css/confirmarVenta.css";
import swal from "sweetalert2";
import NavConfirmarVenta from "./NavConfirmarVenta";
import { ApiPV, ApiClientes } from "../services/api";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class ConfirmarVenta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filasSeleccionadas: this.props.location.state.filasSeleccionadas,
      rucs: [],
      selectedRuc: "",
      mostrarSeEligeFactura: false,
      mostrarBotones: true,
      fechaActual: "",
    };
  }

  componentDidMount() {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
    const día = fechaActual.getDate();
    const fechaFormateada = `${año}-${mes}-${día}`;
    this.setState({ fechaActual: fechaFormateada });
    //console.log(fechaFormateada);
    this.cargarRucs();
  }

  cargarRucs = () => {
    fetch(ApiClientes + "?consultarRucs=1")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ rucs: data });
      })
      .catch((error) => console.log(error));
  };

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
            // Preguntar si el usuario quiere recibo o factura
            swal
              .fire({
                title: "Seleccionar tipo",
                text: "¿Quiere un recibo o una factura?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Recibo",
                cancelButtonText: "Factura",
                customClass: {
                  popup: "popup-class",
                  title: "my-swal-title",
                  text: "my-swal-text",
                  content: "my-swal-content",
                  confirmButton: "swal-confirm",
                  cancelButton: "swal-cancel",
                },
              })
              .then((respuestaTipo) => {
                if (respuestaTipo.isConfirmed) {
                  // El usuario eligió recibo
                  this.elegirProceso("recibo");
                } else {
                  // El usuario eligió factura
                  this.elegirProceso("factura");
                }
              });
          }
        }
      });
  };

  mostrarAlertaEfectuarVenta = () => {
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
            this.procesarVentaFactura();
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

  elegirProceso = (decision) => {
    if (decision === "factura") {
      this.setState({ mostrarSeEligeFactura: true });
      this.setState({ mostrarBotones: false });
    } else {
      if (decision === "recibo") {
        this.procesarVentaRecibo();
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
  };

  procesarVentaFactura = () => {
    //console.log("Dentro de funcion procesar venta...");
    const { user } = this.props;

    const datosEnviar = {
      productos: this.state.filasSeleccionadas,
      fecha: this.state.fechaActual,
      precioTotal: this.calcularPrecioTotal(),
      selectedRuc: this.state.selectedRuc,
      vendedorId: user.id,
    };

    //console.log("Datos a enviar:", datosEnviar);

    fetch(ApiPV + "?procesar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        //console.log("Respuesta de la API:", datosRespuesta);
        this.props.history.push("/menu_principal");
      })
      .catch(console.error);
  };

  procesarVentaRecibo = () => {
    //console.log("Dentro de funcion procesar venta...");
    const { user } = this.props;

    const datosEnviar = {
      productos: this.state.filasSeleccionadas,
      fecha: this.state.fechaActual,
      precioTotal: this.calcularPrecioTotal(),
      selectedRuc: "0000000-0",
      vendedorId: user.id,
    };

    //console.log("Datos a enviar:", datosEnviar);

    fetch(ApiPV + "?procesar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        //console.log("Respuesta de la API:", datosRespuesta);
        this.props.history.push("/menu_principal");
      })
      .catch(console.error);
  };

  render() {
    const { user } = this.props;
    //console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }

    const precioTotal = this.calcularPrecioTotal();
    return (
      <Container>
        <NavConfirmarVenta />
        <div className="contenedorBtnsIdCliente">
          {this.state.mostrarSeEligeFactura && (
            <div className="seEligeFactura">
              <div className="elegitrIDCliente">
                <InputLabel className="inputLabelConfVnta">
                  Elige el ruc del cliente
                </InputLabel>
                <Select
                  value={this.state.selectedRuc}
                  onChange={(event) =>
                    this.setState({ selectedRuc: event.target.value })
                  }
                  className="selectConfVta"
                >
                  {this.state.rucs
                    .filter((ruc) => ruc.ruc !== "0000000-0") // Filtra el RUC no deseado
                    .map((ruc) => (
                      <MenuItem key={ruc.ruc} value={ruc.ruc}>
                        {ruc.ruc}
                      </MenuItem>
                    ))}
                </Select>

                <Link
                  to={{
                    pathname: "/registrar_cliente",
                    state: {
                      filasSeleccionadas: this.state.filasSeleccionadas,
                    },
                  }}
                  className="clienteNuevoPreg"
                >
                  ¿Cliente nuevo?
                </Link>
              </div>

              <div className="btnsCanConFact">
                <button
                  onClick={this.mostrarAlertaEfectuarVenta}
                  type="submit"
                  className="btn boton-guardarEfectuarVenta"
                >
                  Confirmar venta
                </button>
                <Link
                  to={"/menu_principal"}
                  className="btn boton-cancelarEfectuarVenta"
                >
                  Cancelar venta
                </Link>
              </div>
            </div>
          )}
        </div>

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
        {this.state.mostrarBotones && (
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
              Continuar venta
            </button>
            <Link
              to={"/menu_principal"}
              className="btn boton-cancelarConfirmarVenta"
            >
              Cancelar venta
            </Link>
          </div>
        )}
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

