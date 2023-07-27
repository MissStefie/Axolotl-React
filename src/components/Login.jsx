import React, { Component } from "react";
import ImageSlider from "./ImageSlider";
import "../css/login.css";
import LoginApi from "../services/login";
import GSLOGO from "../img/glowing_store_logo.jpg";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: "",
      password: "",
      errorSesion: false,
      errorUsuario: false,
      errorPassword: false,
    };
  }

  enviarDatos = () => {
    this.setState({
      errorSesion: false,
      errorUsuario: false,
      errorPassword: false,
    });

    const { usuario, password } = this.state;

    var datosEnviar = {
      usuario: usuario,
      password: password,
    };

    console.log(datosEnviar);

    fetch(LoginApi + "?login=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);

        if (datosRespuesta.success === 1) {
          this.props.history.push("/menu_principal");
        } else {
          //this.setState({ errorSesion: true });
          if (datosRespuesta.success === 2) {
            this.setState({ errorPassword: true });
          } else {
            if (datosRespuesta.success === 3) {
              this.setState({ errorUsuario: true });
            } else {
              this.setState({ errorSesion: true });
            }
          }
        }
      })
      .catch(console.log());
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const usuarioEsValido = this.validarUsuario(this.state.usuario);

    const contraEsValido = this.validarContrasena(this.state.password);

    if (usuarioEsValido && contraEsValido) {
      console.log("Los datos cumplen con los requisitos...");
      this.enviarDatos(); // Llamada a la función enviarDatos
    } else {
      console.log("Inicio de sesión fallido");
      // Aquí puedes mostrar un mensaje de errorSesion o realizar una acción correspondiente
    }
  };

  validarUsuario = (usuario) => {
    const patron = /^[A-Za-z]{4}\d$/;
    return patron.test(usuario);
  };

  validarContrasena = (contrasena) => {
    const patron = /^(?=.*[a-zA-Z]{4})(?=.*\d{4}).{8}$/;
    return patron.test(contrasena);
  };

  handleChangeUsuario = (event) => {
    this.setState({ usuario: event.target.value });
  };

  handleChangeContrasena = (event) => {
    this.setState({ password: event.target.value });
  };

  render() {
    return (
      <div className="login">
        <div className="image">
          <ImageSlider />
        </div>
        <section className="text-center">
          <div
            className="mx-4 mx-md-5"
            style={{
              marginTop: "-100px",
              background: "hsla(0, 0%, 100%, 0.5)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className=" cajaLoginContenido">
              <img
                src={GSLOGO}
                alt="Glowing Store Logo"
                className="logo-image-login"
              ></img>
              <h2 className="">Iniciar sesión</h2>
              <form className="formularioSesion" onSubmit={this.handleSubmit}>
                <div className="form-outline">
                  <input
                    id="usuario"
                    name="usuario"
                    className="formUsuario form-control"
                    placeholder="user#"
                    value={this.state.usuario}
                    onChange={this.handleChangeUsuario}
                  />
                  <label className="form-label" htmlFor="usuario">
                    Ingrese su usuario
                  </label>
                </div>
                {this.state.errorUsuario && (
                  <p className="errorUsuario-message">
                    Usuario no ingresado correctamente...
                  </p>
                )}

                <div className="form-outline">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="formPassword form-control"
                    placeholder="********"
                    value={this.state.password}
                    onChange={this.handleChangeContrasena}
                  />
                  <label className="form-label" htmlFor="password">
                    Ingrese su contraseña
                  </label>
                  {this.state.errorPassword && (
                    <p className="errorPassword-message">
                      Contraseña no ingresada correctamente...
                    </p>
                  )}
                </div>

                {this.state.errorSesion && (
                  <p className="errorSesion-message">
                    Usuario o contraseña no existen...
                  </p>
                )}

                <button type="submit" className="btn-iniciar-sesion">
                  Iniciar sesión
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
