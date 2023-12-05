import React from "react";
import Api from "../services/api";
import NavEditar from "./NavEditar";
import ApiPS from "../services/prendasSuperior";
import ApiIn from "../services/prendasInferiores";
import ApiAcc from "../services/accesorios";
import ApiCol from "../services/colores";
import ApiTam from "../services/tamanos";
import ApiTal from "../services/talles";
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
      datosPsuperior: [],

      idpinferior: "",
      valorSeleccionadoPinferior: "",
      datosPinferior: [],

      idaccesorio: "",
      valorSeleccionadoAccesorio: "",
      datosAccesorio: [],

      idcolor: "",
      valorSeleccionadoColor: "",
      datosColor: [],

      idtamano: "",
      valorSeleccionadoTamano: "",
      datosTamano: [],

      idtalle: "",
      valorSeleccionadoTalle: "",
      datosTalle: [],

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

    console.log(datosEnviar);

    fetch(Api + "?actualizar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);

        this.props.history.push("/consultar");
      })
      .catch(console.log());
  };

  componentDidMount() {
    //agarrando los datos con el fetch usando el id del navegador y asignando los id de las otras tablas a las variables
    fetch(Api + "?consultar=" + this.props.match.params.id)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
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
        console.log(this.state.nombre);
      })
      .catch(console.log());
    console.log(this.state);

    //asignando el id de psuperiorid al fecth de la tabla de prendas superiores para traer la prenda
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
        });
      })
      .catch((error) => {
        console.error("Error al obtener prenda superior de la API:", error);
      });

    //asignando el id de pinferiorid al fecth de la tabla de prendas inferiores para traer la prenda
    fetch(ApiIn)
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
        });
      })
      .catch((error) => {
        console.error("Error al obtener prenda inferior de la API:", error);
      });

    //asignando el id de accesorioid al fecth de la tabla de accesorio para traer el accesorio
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
        });
      })
      .catch((error) => {
        console.error("Error al obtener accesorio de la API:", error);
      });

    //asignando el id de colorid al fecth de la tabla de colores para traer el color
    fetch(ApiCol)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosColor: data,
          valorSeleccionadoColor:
            data.length > 0
              ? data.find((color) => color.id === this.state.idcolor)?.id
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener color de la API:", error);
      });

    //asignando el id de colorid al fecth de la tabla de colores para traer el color
    fetch(ApiTam)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosTamano: data,
          valorSeleccionadoTamano:
            data.length > 0
              ? data.find((tamano) => tamano.id === this.state.idtamano)?.id
              : "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener tamano de la API:", error);
      });

    //asignando el id de talleid al fecth de la tabla de talles para traer el talle
    fetch(ApiTal)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          datosTalle: data,
          valorSeleccionadoTalle:
            data.length > 0
              ? data.find((talle) => talle.id === this.state.idtalle)?.id
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
    console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }
    const {
      datosCargados,
      producto,
      datosPsuperior,
      valorSeleccionadoPsuperior,
      valorSeleccionadoPinferior,
      datosPinferior,
      valorSeleccionadoAccesorio,
      datosAccesorio,
      valorSeleccionadoColor,
      datosColor,
      valorSeleccionadoTamano,
      datosTamano,
      valorSeleccionadoTalle,
      datosTalle,
    } = this.state;

    if (!datosCargados) {
      return <div>Cargando...</div>;
    } else {
      return (
        <Container>
          <NavEditar></NavEditar>
          <div className="card">
            <div className="card-body">
              <form action="" onSubmit={this.enviarDatos}>
                <div className="form-group elemento-card">
                  <label htmlFor="">Clave:</label>
                  <input
                    type="text"
                    readOnly
                    className="form-control inputClave"
                    onChange={this.cambioValor}
                    value={producto.id}
                    name="id"
                    id="id"
                    aria-describedby="helpId"
                    placeholder=""
                  />
                </div>
                <div className="contenedorSelects">
                  {/*select de prenda superior*/}
                  <div className="elemento-card">
                    <select value={valorSeleccionadoPsuperior} disabled>
                      <option value="">Seleccionar</option>
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

                  {/*select de prenda inferior*/}
                  <div className="elemento-card">
                    <select value={valorSeleccionadoPinferior} disabled>
                      <option value="">Seleccionar</option>
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

                  {/*select de accesorio*/}
                  <div className="elemento-card">
                    <select value={valorSeleccionadoAccesorio} disabled>
                      <option value="">Seleccionar</option>
                      {datosAccesorio.map((accesorio) => (
                        <option key={accesorio.id} value={accesorio.id}>
                          {accesorio.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/*select de color*/}
                  <div className="elemento-card">
                    <select value={valorSeleccionadoColor} disabled>
                      <option value="">Seleccionar</option>
                      {datosColor.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/*select de tamano*/}
                  <div className="elemento-card">
                    <select value={valorSeleccionadoTamano} disabled>
                      <option value="">Seleccionar</option>
                      {datosTamano.map((tamano) => (
                        <option key={tamano.id} value={tamano.id}>
                          {tamano.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/*select de talle*/}
                  <div className="elemento-card">
                    <select value={valorSeleccionadoTalle} disabled>
                      <option value="">Seleccionar</option>
                      {datosTalle.map((talle) => (
                        <option key={talle.id} value={talle.id}>
                          {talle.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
