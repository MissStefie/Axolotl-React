import React from "react";
import NavEditar from "./NavEditar";
import { Api, ApiPS, ApiPI, ApiAcc, ApiColores, ApiTam, ApiTal } from "../api";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import "../css/editarProducto.css";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class EditarProducto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datosCargados: false,
      producto: [],

      idpsuperior: "",
      valorSeleccionadoPsuperior: "",
      descripcionSeleccionadoPsuperior: "",
      datosPsuperior: [],

      idpinferior: "",
      valorSeleccionadoPinferior: "",
      descripcionSeleccionadoPinferior: "",
      datosPinferior: [],

      idaccesorio: "",
      valorSeleccionadoAccesorio: "",
      descripcionSeleccionadoAccesorio: "",
      datosAccesorio: [],

      idcolor: "",
      valorSeleccionadoColor: "",
      descripcionSeleccionadoColor: "",
      datosColor: [],

      idtamano: "",
      valorSeleccionadoTamano: "",
      descripcionSeleccionadoTamano: "",
      datosTamano: [],

      idtalle: "",
      valorSeleccionadoTalle: "",
      descripcionSeleccionadoTalle: "",
      datosTalle: [],

      tipoProducto: "",
      tipoDimension: "",

      errores: [],
    };
  }

  cambioValor = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validar que no se ingresen valores negativos en los campos de precio y cantidad
    if (name === "preciocpa" || name === "preciovta" || name === "cantidad") {
      newValue = Math.max(0, parseFloat(value)) || "";
    }

    this.setState((prevState) => ({
      producto: {
        ...prevState.producto,
        [name]: newValue,
        errores: [],
      },
    }));
  };

  enviarDatos = (e) => {
    e.preventDefault();
    const {
      producto: {
        id,
        codigo,
        nombre,
        descripcion,
        preciocpa,
        preciovta,
        cantidad,
        descuento,
      },
    } = this.state;

    var errores = [];
    if (!nombre) errores.push("error_nombre");
    if (!descripcion) errores.push("error_descripcion");
    if (!preciocpa) errores.push("error_preciocpa");
    if (!preciovta) errores.push("error_preciovta");
    if (!cantidad) errores.push("error_cantidad");
    if (!descuento) errores.push("error_descuento");

    this.setState({ errores: errores });
    if (errores.length > 0) return false;

    var datosEnviar = {
      id: id,
      codigo: codigo,
      nombre: nombre,
      descripcion: descripcion,
      preciocpa: preciocpa,
      preciovta: preciovta,
      cantidad: cantidad,
      descuento: descuento,
    };

    //console.log(datosEnviar);

    fetch(Api + "?actualizar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        //console.log(datosRespuesta);

        this.props.history.push("/consultar");
      })
      .catch(console.log());
  };

  componentDidMount() {
    fetch(Api + "?consultar=" + this.props.match.params.id)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        this.setState({
          datosCargados: true,
          producto: datosRespuesta[0],
          idpsuperior: datosRespuesta[0].psuperiorid,
          idpinferior: datosRespuesta[0].pinferiorid,
          idaccesorio: datosRespuesta[0].accesorioid,
          idcolor: datosRespuesta[0].colorid,
          idtamano: datosRespuesta[0].tamanoid,
          idtalle: datosRespuesta[0].talleid,
        });
      })
      .catch(console.log());

    fetch(ApiPS)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosPsuperior: data,
          valorSeleccionadoPsuperior:
            data.length > 0
              ? data.find(
                  (prendasuperior) =>
                    prendasuperior.id === this.state.idpsuperior
                )?.id
              : "",
          descripcionSeleccionadoPsuperior:
            data.length > 0
              ? data.find(
                  (prendasuperior) =>
                    prendasuperior.id === this.state.idpsuperior
                )?.descripcion
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener prenda superior de la API:", error);
      });

    fetch(ApiPI)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosPinferior: data,
          valorSeleccionadoPinferior:
            data.length > 0
              ? data.find(
                  (prendainferior) =>
                    prendainferior.id === this.state.idpinferior
                )?.id
              : "",
          descripcionSeleccionadoPinferior:
            data.length > 0
              ? data.find(
                  (prendainferior) =>
                    prendainferior.id === this.state.idpinferior
                )?.descripcion
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener prenda inferior de la API:", error);
      });

    fetch(ApiAcc)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosAccesorio: data,
          valorSeleccionadoAccesorio:
            data.length > 0
              ? data.find(
                  (accesorio) => accesorio.id === this.state.idaccesorio
                )?.id
              : "",
          descripcionSeleccionadoAccesorio:
            data.length > 0
              ? data.find(
                  (accesorio) => accesorio.id === this.state.idaccesorio
                )?.descripcion
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener accesorio de la API:", error);
      });

    fetch(ApiColores)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosColor: data,
          valorSeleccionadoColor:
            data.length > 0
              ? data.find((color) => color.id === this.state.idcolor)?.id
              : "",
          descripcionSeleccionadoColor:
            data.length > 0
              ? data.find((color) => color.id === this.state.idcolor)
                  ?.descripcion
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener color de la API:", error);
      });

    fetch(ApiTam)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosTamano: data,
          valorSeleccionadoTamano:
            data.length > 0
              ? data.find((tamano) => tamano.id === this.state.idtamano)?.id
              : "",
          descripcionSeleccionadoTamano:
            data.length > 0
              ? data.find((tamano) => tamano.id === this.state.idtamano)
                  ?.descripcion
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener tamano de la API:", error);
      });

    fetch(ApiTal)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosTalle: data,
          valorSeleccionadoTalle:
            data.length > 0
              ? data.find((talle) => talle.id === this.state.idtalle)?.id
              : "",
          descripcionSeleccionadoTalle:
            data.length > 0
              ? data.find((talle) => talle.id === this.state.idtalle)
                  ?.descripcion
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener talle de la API:", error);
      });
  }

  verificarError(elemento) {
    return this.state.errores.indexOf(elemento) !== -1;
  }

  render() {
    const { user } = this.props;
    //console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }
    const {
      datosCargados,
      producto,
      //valorSeleccionadoPsuperior,
      descripcionSeleccionadoPsuperior,
      //datosPsuperior,
      //valorSeleccionadoPinferior,
      descripcionSeleccionadoPinferior,
      //datosPinferior,
      //valorSeleccionadoAccesorio,
      descripcionSeleccionadoAccesorio,
      //datosAccesorio,
      //valorSeleccionadoColor,
      descripcionSeleccionadoColor,
      //datosColor,
      //valorSeleccionadoTamano,
      descripcionSeleccionadoTamano,
      //datosTamano,
      //valorSeleccionadoTalle,
      descripcionSeleccionadoTalle,
      //datosTalle,
    } = this.state;

    //console.log(this.state);

    if (!datosCargados) {
      return <div>Cargando...</div>;
    } else {
      return (
        <Container>
          <NavEditar></NavEditar>
          <div className="card-editarProducto">
            <div className="card-body-editarProducto">
              <form action="" onSubmit={this.enviarDatos}>
                {/*<div className="contenedorSelects-editarProducto">
                  <div className="editarProductotipos">
                    <div className="elemento-card">
                      <select
                        value={valorSeleccionadoPsuperior}
                        disabled
                        style={{
                          display:
                            valorSeleccionadoPsuperior === "1"
                              ? "none"
                              : "block",
                        }}
                      >
                        {datosPsuperior.map((prendasuperior) => (
                          <option
                            key={prendasuperior.id}
                            value={prendasuperior.id}
                          >
                            {prendasuperior.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="elemento-card">
                      <select
                        value={valorSeleccionadoPinferior}
                        disabled
                        style={{
                          display:
                            valorSeleccionadoPinferior === "1"
                              ? "none"
                              : "block",
                        }}
                      >
                        {datosPinferior.map((prendainferior) => (
                          <option
                            key={prendainferior.id}
                            value={prendainferior.id}
                          >
                            {prendainferior.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="elemento-card">
                      <select
                        value={valorSeleccionadoAccesorio}
                        disabled
                        style={{
                          display:
                            valorSeleccionadoAccesorio === "1"
                              ? "none"
                              : "block",
                        }}
                      >
                        {datosAccesorio.map((accesorio) => (
                          <option key={accesorio.id} value={accesorio.id}>
                            {accesorio.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label>
                      Producto:{" "}
                      {descripcionSeleccionadoPsuperior !== "NULL"
                        ? `${descripcionSeleccionadoPsuperior} `
                        : ""}
                      {descripcionSeleccionadoPinferior !== "NULL"
                        ? `${descripcionSeleccionadoPinferior} `
                        : ""}
                      {descripcionSeleccionadoAccesorio !== "NULL"
                        ? descripcionSeleccionadoAccesorio
                        : ""}
                    </label>
                  </div>
                  <div className="editarProductoColor">
                    <div className="elemento-card">
                      <select value={valorSeleccionadoColor} disabled>
                        {datosColor.map((color) => (
                          <option key={color.id} value={color.id}>
                            {color.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label>Color: {descripcionSeleccionadoColor}</label>
                  </div>
                  <div className="editarProductoTamTalle">
                    <div className="elemento-card">
                      <select
                        value={valorSeleccionadoTamano}
                        disabled
                        style={{
                          display:
                            valorSeleccionadoTamano === "1" ? "none" : "block",
                        }}
                      >
                        {datosTamano.map((tamano) => (
                          <option key={tamano.id} value={tamano.id}>
                            {tamano.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="elemento-card">
                      <select
                        value={valorSeleccionadoTalle}
                        disabled
                        style={{
                          display:
                            valorSeleccionadoTalle === "1" ? "none" : "block",
                        }}
                      >
                        {datosTalle.map((talle) => (
                          <option key={talle.id} value={talle.id}>
                            {talle.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label>
                      Tamaño/Talle:{" "}
                      {descripcionSeleccionadoTamano !== "NULL"
                        ? `${descripcionSeleccionadoTamano} `
                        : ""}
                      {descripcionSeleccionadoTalle !== "NULL"
                        ? descripcionSeleccionadoTalle
                        : ""}
                    </label>
                  </div>
                </div>*/}

                <div className="contenedorInputs">
                  <div className="form-group elemento-card">
                    <label htmlFor="">Codigo:</label>
                    <input
                      required
                      type="text"
                      name="codigo"
                      onChange={this.cambioValor}
                      value={producto.codigo}
                      id="codigo"
                      className="form-codigo"
                      placeholder="Ingrese un codigo"
                      aria-describedby="helpId"
                    />
                  </div>
                  <div className="form-group elemento-card">
                    <label htmlFor="">Nombre:</label>
                    <input
                      required
                      type="text"
                      name="nombre"
                      onChange={this.cambioValor}
                      value={producto.nombre}
                      id="nombre"
                      className={
                        (this.verificarError("error_nombre")
                          ? "is-invalid"
                          : "") + " form-control"
                      }
                      placeholder="Ingrese un nombre"
                      aria-describedby="helpId"
                    />
                  </div>

                  <div className="form-group elemento-card">
                    <label htmlFor="">Descripcion:</label>
                    <input
                      required
                      type="text"
                      name="descripcion"
                      onChange={this.cambioValor}
                      value={producto.descripcion}
                      id="descripcion"
                      className={
                        (this.verificarError("error_descripcion")
                          ? "is-invalid"
                          : "") + " form-control"
                      }
                      placeholder="Ingrese una descripcion"
                      aria-describedby="helpId"
                    />
                  </div>

                  <div className="form-group elemento-card">
                    <label htmlFor="">Precio de compra:</label>
                    <input
                      required
                      type="number"
                      name="preciocpa"
                      onChange={this.cambioValor}
                      value={producto.preciocpa}
                      id="preciocpa"
                      className={
                        (this.verificarError("error_preciocpa")
                          ? "is-invalid"
                          : "") + " form-control"
                      }
                      placeholder="Ingrese el precio de compra"
                      aria-describedby="helpId"
                    />
                  </div>

                  <div className="form-group elemento-card">
                    <label htmlFor="">Precio de venta:</label>
                    <input
                      required
                      type="number"
                      name="preciovta"
                      onChange={this.cambioValor}
                      value={producto.preciovta}
                      id="preciovta"
                      className={
                        (this.verificarError("error_preciovta")
                          ? "is-invalid"
                          : "") + " form-control"
                      }
                      placeholder="Ingrese el precio de venta"
                      aria-describedby="helpId"
                    />
                  </div>

                  <div className="form-group elemento-card">
                    <label htmlFor="">Cantidad disponible:</label>
                    <input
                      required
                      type="number"
                      name="cantidad"
                      onChange={this.cambioValor}
                      value={producto.cantidad}
                      id="cantidad"
                      className={
                        (this.verificarError("error_cantidad")
                          ? "is-invalid"
                          : "") + " form-control"
                      }
                      placeholder="Ingrese la cantidad"
                      aria-describedby="helpId"
                    />
                  </div>

                  <div className="form-group elemento-card">
                    <label htmlFor="">Descuento:</label>
                    <input
                      required
                      type="number"
                      name="descuento"
                      onChange={this.cambioValor}
                      value={producto.descuento}
                      id="descuento"
                      className={
                        (this.verificarError("error_descuento")
                          ? "is-invalid"
                          : "") + " form-control"
                      }
                      placeholder="Ingrese el descuento"
                      aria-describedby="helpId"
                    />
                  </div>
                </div>

                <div
                  className="btn-group grupoBotones"
                  role="group"
                  aria-label=""
                >
                  <button type="submit" className="btn boton-actualizar">
                    Actualizar producto
                  </button>

                  <Link to={"/consultar"} className="btn boton-cancelar">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Container>
      );
    }
  }
}

EditarProducto.propTypes = {
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
