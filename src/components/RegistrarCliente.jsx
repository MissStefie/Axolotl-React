import React, { Component } from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import NavCrearCliente from "./NavCrearCliente";
import ApiRC from "../services/registrarClientes";
import "../css/registrarClientes.css";

export default class RegistrarCliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      apellido: "",
      ruc: "",
      direccion: "",
      errores: [],
      rucExiste: 0,
    };
  }

  verificarError(elemento) {
    return this.state.errores.indexOf(elemento) !== -1;
  }

  enviarDatosCliente = (e) => {
    e.preventDefault();
    console.log("Dentro de funcion enviardatos...");
    const { nombre, apellido, ruc, direccion } = this.state;

    var errores = [];
    if (!nombre) errores.push("error_nombre");
    if (!apellido) errores.push("error_apellido");
    if (!direccion) errores.push("error_direccion");
    if (!ruc) errores.push("error_ruc");
    if (ruc.length !== 7) errores.push("error_ruc_length"); // Nueva validación

    this.setState({ errores: errores });
    if (errores.length > 0) return false;

    var datosEnviar = {
      nombre: nombre,
      apellido: apellido,
      ruc: ruc,
      direccion: direccion,
      rucExiste: 0,
    };

    console.log(datosEnviar)

    fetch(ApiRC + "?insertar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta.data);
        if (datosRespuesta.data.rucExiste === 0) {
          this.props.history.push("/menu_principal");
        } else {
          console.log("El RUC ya existe en la base de datos");
          errores.push("ruc_existe");
          this.setState({ errores: errores, rucExiste: 1 });
        }
      })
      .catch(console.log);
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    // Aplicar restricciones solo al campo RUC
    let updatedValue = value;
    if (name === "ruc") {
      // Filtrar solo los dígitos numéricos y limitar a 7 caracteres
      updatedValue = value.replace(/\D/g, "").substring(0, 7);
    }

    this.setState({
      [name]: updatedValue,
    });
  };

  render() {
    const { nombre, apellido, ruc, direccion } = this.state;
    return (
      <Container>
        <NavCrearCliente></NavCrearCliente>
        <Container className="containerRegistrarCliente">
          <Container className="titleIconRegistrarCliente">
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ color: "#e5beec" }}
              className="icono-CrearClienteGrande"
            />
            <h1 className="titulo-crearCliente">Registrar cliente</h1>
          </Container>
          <Container>
            <form onSubmit={this.enviarDatosCliente}>
              <div className="divCamposRegistrarCliente">
                <label htmlFor="nombre" className="labelRegistrarCliente">
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
                    (this.verificarError("error_nombre") ? "is-invalid" : "") +
                    " form-control inputRegistrarCliente"
                  }
                ></input>
              </div>
              <div className="divCamposRegistrarCliente">
                <label htmlFor="apellido" className="labelRegistrarCliente">
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
                      : "") + " form-control inputRegistrarCliente"
                  }
                ></input>
              </div>
              <div className="divCamposRegistrarCliente">
                <label htmlFor="ruc" className="labelRegistrarCliente">
                  RUC
                </label>
                <input
                  name="ruc"
                  type="text"
                  value={ruc}
                  id="ruc"
                  placeholder="Ingrese el ruc"
                  onChange={this.handleChange}
                  inputMode="numeric" // Asegura que solo se acepten caracteres numéricos
                  pattern="[0-9]*" // Patrón para aceptar solo dígitos numéricos
                  maxLength="7" // Establece el máximo de caracteres a 7
                  className={
                    (this.verificarError("error_ruc") ? "is-invalid" : "") +
                    " form-control inputRegistrarCliente"
                  }
                />
              </div>
              {this.verificarError("error_ruc_length") && ( // Nuevo div de mensaje de error
                <div className="rucIncompleto">
                  El RUC debe tener exactamente 7 caracteres.
                </div>
              )}
              {this.verificarError("ruc_existe") && (
                <div className="rucNoExiste">
                  El RUC ya existe en la base de datos.
                </div>
              )}
              <div className="divCamposRegistrarCliente">
                <label htmlFor="direccion" className="labelRegistrarCliente">
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
                      : "") + " form-control inputRegistrarCliente"
                  }
                ></input>
              </div>
              <div className="divBtnRegistrarCliente">
                <div>
                  <button
                    type="submit"
                    onClick={this.enviarDatosCliente}
                    className="aceptarBtnRegistrarCliente"
                  >
                    Registrar cliente
                  </button>
                </div>
                <div>
                  <Link
                    to="/menu_principal"
                    className="cancelarBtnRegistrarCliente"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </Container>
        </Container>
      </Container>
    );
  }
}
