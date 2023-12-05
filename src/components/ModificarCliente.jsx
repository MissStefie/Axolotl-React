import React, { Component } from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import ApiC from "../services/clientes";
import "../css/modificarClientes.css";
import swal from "sweetalert2";
import NavModificarCliente from "./NavModificarCliente";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class ModificarCliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      apellido: "",
      ruc: "",
      direccion: "",
      id: "",
      errores: [],
      erroresMostrados: false,
      clienteEncontrado: true,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    // Aplicar restricciones solo al campo RUC
    let updatedValue = value;
    if (name === "ruc") {
      // Filtrar solo los dígitos numéricos y limitar a 8 caracteres (7 dígitos + 1 número)
      updatedValue = value.replace(/\D/g, "").substring(0, 8);

      // Separar en dos partes: los primeros 7 dígitos y el último número
      if (updatedValue.length > 7) {
        const firstPart = updatedValue.slice(0, 7);
        const lastDigit = updatedValue.slice(7);

        // Formar la cadena con el guión
        updatedValue = firstPart + "-" + lastDigit;
      }
    }

    this.setState(
      {
        [name]: updatedValue,
      },
      () => {
        // Imprimir el valor actualizado en la consola
        console.log(`Valor de ${name}: ${updatedValue}`);
      }
    );
  };

  verificarError(elemento) {
    return (
      this.state.errores.indexOf(elemento) !== -1 && this.state.erroresMostrados
    );
  }

  buscarCliente = () => {
    const { ruc } = this.state;
    console.log(ruc);

    if (ruc.trim() === "") {
      this.setState({
        nombre: "",
        apellido: "",
        direccion: "",
        clienteEncontrado: true,
        id: "", // Reiniciar el valor de id si no hay RUC
      });
      return;
    }

    fetch(ApiC + "?consultar=" + ruc)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((cliente) => {
        if (Array.isArray(cliente) && cliente.length > 0) {
          const { nombre, apellido, direccion, id } = cliente[0];
          this.setState(
            {
              nombre: nombre,
              apellido: apellido,
              direccion: direccion,
              id: id, // Actualizar el valor de id
              clienteEncontrado: true,
            },
            () => {
              console.log(this.state); // Asegurarse de que id se haya actualizado
            }
          );
        } else {
          this.setState({ clienteEncontrado: false, id: "" });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  enviarDatosCliente = (e) => {
    e.preventDefault();
    console.log(e);
    const { nombre, apellido, ruc, direccion, id } = this.state;

    var errores = [];
    if (!nombre) errores.push("error_nombre");
    if (!apellido) errores.push("error_apellido");
    if (!ruc) errores.push("error_ruc");
    if (!direccion) errores.push("error_direccion");
    if (ruc.length !== 9) errores.push("error_ruc_length"); // Nueva validación

    this.setState({ errores: errores, erroresMostrados: true });
    if (errores.length > 0) return false;

    var datosEnviar = {
      nombre: nombre,
      apellido: apellido,
      ruc: ruc,
      direccion: direccion,
      id: id,
    };

    fetch(ApiC + "?actualizar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);

        this.props.history.push("/menu_principal");
      })
      .catch(console.log());
  };

  borrarCliente = (id) => {
    fetch(ApiC + "?borrar=1", {
      method: "POST",
      body: JSON.stringify(id),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        console.log("Datos enviados.......");
        this.props.history.push("/menu_principal");
      })
      .catch(console.log);
  };

  mostrarAlerta = (id) => {
    swal
      .fire({
        title: "Borrar",
        text: "¿Está seguro que desea eliminar a este cliente?",
        icon: "question",
        confirmButtonText: "Sí, eliminar",
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
          this.borrarCliente(id);
          swal.fire({
            text: "El cliente se ha borrado exitosamente.",
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

  render() {
    const { user } = this.props;
    console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }

    const { nombre, apellido, ruc, direccion, id, clienteEncontrado } =
      this.state;
    return (
      <Container>
        <NavModificarCliente></NavModificarCliente>
        <Container className="containerModificarCliente">
          <Container className="titleIconModificarCliente">
            <FontAwesomeIcon
              icon={faUserPen}
              style={{ color: "#2A2F4F" }}
              className="iconoModificarCliente"
            />
            <h1 className="tituloModificarCliente">Modificar cliente</h1>
          </Container>
          <Container className="formModificarCliente">
            <form>
              <div className="divCamposModificarCliente">
                <label htmlFor="ruc" className="labelModificarCliente">
                  RUC del cliente
                </label>
                <input
                  name="ruc"
                  type="text"
                  value={ruc}
                  id="ruc"
                  placeholder="#######-#"
                  onChange={this.handleChange}
                  inputMode="numeric" // Asegura que solo se acepten caracteres numéricos
                  pattern="^\d{7}-\d$" // Patrón para aceptar el formato "0000000-0"
                  maxLength="9" // Establece el máximo de caracteres a 9 (7 dígitos + 1 guión + 1 dígito)
                  className={
                    (this.verificarError("error_ruc") ? "is-invalid" : "") +
                    " form-control inputModificarCliente"
                  }
                />
              </div>
              {this.verificarError("error_ruc_length") && ( // Nuevo div de mensaje de error
                <div className="rucIncompleto">
                  El RUC debe tener exactamente 9 caracteres.
                </div>
              )}
              {!clienteEncontrado && (
                <div className="mensajeNoEncontradoModificarCliente">
                  Cliente no encontrado...
                </div>
              )}
              <div>
                <button
                  className="btnBuscarCliente"
                  type="button"
                  onClick={this.buscarCliente}
                >
                  Buscar cliente
                </button>
              </div>
              <div>
                <div className="divCamposModificarCliente">
                  <label htmlFor="nombre" className="labelModificarCliente">
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    type="text"
                    value={nombre}
                    id="nombre"
                    placeholder="Ingrese un nombre"
                    onChange={this.handleChange}
                    className={
                      (this.verificarError("error_nombre")
                        ? "is-invalid"
                        : "") + " form-control inputModificarCliente"
                    }
                  ></input>
                </div>
                <div className="divCamposModificarCliente">
                  <label htmlFor="apellido" className="labelModificarCliente">
                    Apellido
                  </label>
                  <input
                    name="apellido"
                    type="text"
                    value={apellido}
                    id="apellido"
                    placeholder="Ingrese un apellido"
                    onChange={this.handleChange}
                    className={
                      (this.verificarError("error_apellido")
                        ? "is-invalid"
                        : "") + " form-control inputModificarCliente"
                    }
                  ></input>
                </div>
                <div className="divCamposModificarCliente">
                  <label htmlFor="direccion" className="labelModificarCliente">
                    Dirección
                  </label>
                  <input
                    name="direccion"
                    type="text"
                    value={direccion}
                    id="direccion"
                    placeholder="Ingrese la direccion"
                    onChange={this.handleChange}
                    className={
                      (this.verificarError("error_direccion")
                        ? "is-invalid"
                        : "") + " form-control inputModificarCliente"
                    }
                  ></input>
                </div>
              </div>
            </form>
          </Container>

          <div className="divBtnModificarCliente">
            <div className="divBtnModEliModificarCliente">
              <div>
                <button
                  type="button"
                  onClick={this.enviarDatosCliente}
                  className="aceptarBtnModificarCliente"
                >
                  Actualizar cliente
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="aceptarBtnEliminarCliente"
                  onClick={() => this.mostrarAlerta(id)}
                >
                  Eliminar cliente
                </button>
              </div>
            </div>
            <div>
              <Link
                to="/menu_principal"
                className="cancelarBtnModificarCliente"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}

ModificarCliente.propTypes = {
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
