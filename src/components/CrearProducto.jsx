import React from "react";
import NavAgregar from "./NavAgregar";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import "../css/agregarProducto.css";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Api,
  ApiPS,
  ApiPI,
  ApiAcc,
  ApiColores,
  ApiTam,
  ApiTal,
} from "../api";

export default class CrearProducto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: "",
      psuperiorid: "",
      pinferiorid: "",
      accesorioid: "",
      colorid: "",
      tamanoid: "",
      talleid: "",
      nombre: "",
      descripcion: "",
      preciocpa: "",
      preciovta: "",
      cantidad: "",
      descuento: "",
      preciodct: "",

      selectDataSuperiores: [],
      selectedValueSuperiores: "",
      selectedIdSuperiores: "",

      selectDataInferiores: [],
      selectedValueInferiores: "",
      selectedIdInferiores: "",

      selectDataAccesorios: [],
      selectedValueAccesorios: "",
      selectedIdAccesorios: "",

      selectDataColores: [],
      selectedValueColores: "",
      selectedIdColores: "",

      selectDataTamanos: [],
      selectedValueTamanos: "",
      selectedIdSTamanos: "",

      selectDataTalles: [],
      selectedValueTalles: "",
      selectedIdTalles: "",

      seleccionSuperior: false,
      seleccionInferior: false,
      seleccionAccesorio: false,

      seleccionTam: false,
      seleccionTalle: false,

      seleccionColor: false,
      errores: [],
    };
  }

  componentDidMount() {
    // Realiza una solicitud a la API para obtener los datos de prendas superiores
    fetch(ApiPS)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (select) => select.descripcion !== "NULL"
        );
        this.setState({ selectDataSuperiores: filteredData });
      })
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de prendas inferiores
    fetch(ApiPI)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (select) => select.descripcion !== "NULL"
        );
        this.setState({ selectDataInferiores: filteredData });
      })
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de accesorios
    fetch(ApiAcc)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (select) => select.descripcion !== "NULL"
        );
        this.setState({ selectDataAccesorios: filteredData });
      })
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de colores
    fetch(ApiColores)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (select) => select.descripcion !== "NULL"
        );
        this.setState({ selectDataColores: filteredData });
      })
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de tamaños
    fetch(ApiTam)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (select) => select.descripcion !== "NULL"
        );
        this.setState({ selectDataTamanos: filteredData });
      })
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de talles
    fetch(ApiTal)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (select) => select.descripcion !== "NULL"
        );
        this.setState({ selectDataTalles: filteredData });
      })
      .catch((error) => console.log(error));
  }

  cambioValor = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validación para asegurarse de que descuento esté entre 0 y 100
    if (name === "descuento") {
      const parsedValue = parseInt(value, 10);
      newValue = isNaN(parsedValue)
        ? ""
        : Math.max(0, Math.min(100, parsedValue));
    }

    // Validación para asegurarse de que preciocpa y preciovta no sean negativos
    if (name === "preciocpa" || name === "preciovta" || name === "cantidad") {
      newValue = Math.max(0, parseFloat(value)) || "";
    }

    // Actualizar el estado
    this.setState((prevState) => ({
      ...prevState,
      [name]: newValue,
      errores: [],
    }));
  };

  handleChangeSuperiores = (event) => {
    const { value } = event.target;
    const { selectDataSuperiores } = this.state;
    const selectedItem = selectDataSuperiores.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueSuperiores: value,
        selectedIdSuperiores: selectedItem.id,
        seleccionSuperior: true,
        seleccionInferior: false,
        seleccionAccesorio: false,
      });
    } else {
      this.setState({
        selectedValueSuperiores: "Prenda Superior:",
        selectedIdSuperiores: "",
        seleccionSuperior: false,
      });
    }
  };

  handleChangeInferiores = (event) => {
    const { value } = event.target;
    const { selectDataInferiores } = this.state;
    const selectedItem = selectDataInferiores.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueInferiores: value,
        selectedIdInferiores: selectedItem.id,
        seleccionSuperior: false,
        seleccionInferior: true,
        seleccionAccesorio: false,
      });
    } else {
      this.setState({
        selectedValueInferiores: "Prenda Inferior:",
        selectedIdInferiores: "",
        seleccionInferior: false,
      });
    }
  };

  handleChangeAccesorios = (event) => {
    const { value } = event.target;
    const { selectDataAccesorios } = this.state;
    const selectedItem = selectDataAccesorios.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueAccesorios: value,
        selectedIdAccesorios: selectedItem.id,
        seleccionSuperior: false,
        seleccionInferior: false,
        seleccionAccesorio: true,
      });
    } else {
      this.setState({
        selectedValueAccesorios: "Accesorio:",
        selectedIdAccesorios: "",
        seleccionAccesorio: false,
      });
    }
  };

  handleChangeColores = (event) => {
    const { value } = event.target;
    const { selectDataColores } = this.state;
    const selectedItem = selectDataColores.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueColores: value,
        selectedIdColores: selectedItem.id,
        seleccionColor: true,
      });
    } else {
      this.setState({
        selectedValueColores: "Color:",
        selectedIdColores: "",
        seleccionColor: false,
      });
    }
  };

  handleChangeTamanos = (event) => {
    const { value } = event.target;
    const { selectDataTamanos } = this.state;
    const selectedItem = selectDataTamanos.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueTamanos: value,
        selectedIdTamanos: selectedItem.id,
        seleccionTam: true,
        seleccionTalle: false,
      });
    } else {
      this.setState({
        selectedValueTamanos: "Tamaño:",
        selectedIdTamanos: "",
        seleccionTam: false,
      });
    }

    // Deshabilitar opciones en el menú "Talles"
    const disableTalles = !!selectedItem;
    this.setState({
      disableTalles: disableTalles,
    });
  };

  handleChangeTalles = (event) => {
    const { value } = event.target;
    const { selectDataTalles } = this.state;
    const selectedItem = selectDataTalles.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueTalles: value,
        selectedIdTalles: selectedItem.id,
        seleccionTam: false,
        seleccionTalle: true,
      });
    } else {
      this.setState({
        selectedValueTalles: "Talle:",
        selectedIdTalles: "",
        seleccionTalle: false,
      });
    }

    // Deshabilitar opciones en el menú "Tamaños"
    const disableTamanos = !!selectedItem;
    this.setState({
      disableTamanos: disableTamanos,
    });
  };

  verificarError(elemento) {
    return this.state.errores.indexOf(elemento) !== -1;
  }

  enviarDatos = (e) => {
    e.preventDefault();
    //console.log(e);
    const {
      codigo,
      nombre,
      descripcion,
      preciocpa,
      preciovta,
      cantidad,
      descuento,
      selectedIdSuperiores,
      selectedIdInferiores,
      selectedIdAccesorios,
      selectedIdColores,
      selectedIdTamanos,
      selectedIdTalles,
    } = this.state;

    if (
      !selectedIdSuperiores &&
      !selectedIdInferiores &&
      !selectedIdAccesorios
    ) {
      this.setState({
        errores: ["error_tipo_producto"],
      });

      // Mostrar mensaje emergente con Toast
      toast.error("Debe especificar el tipo del producto.", {
        position: toast.POSITION.TOP_CENTER,
      });

      return false;
    }

    if (!selectedIdTamanos && !selectedIdTalles) {
      this.setState({
        errores: ["error_tamano_talle"],
      });

      // Mostrar mensaje emergente con Toast
      toast.error("Debe especificar el tamaño o talle del producto.", {
        position: toast.POSITION.TOP_CENTER,
      });

      return false;
    }

    if (!this.state.seleccionColor) {
      this.setState({
        errores: ["error_color"],
      });

      // Mostrar mensaje emergente con Toast
      toast.error("Debe seleccionar un color.", {
        position: toast.POSITION.TOP_CENTER,
      });

      return false;
    }

    const selectedIdSuperioresToSend = selectedIdSuperiores || 1;
    const selectedIdInferioresToSend = selectedIdInferiores || 1;
    const selectedIdAccesoriosToSend = selectedIdAccesorios || 1;
    const selectedIdColoresToSend = selectedIdColores || 1;
    const selectedIdTamanosToSend = selectedIdTamanos || 1;
    const selectedIdTallesToSend = selectedIdTalles || 1;

    var errores = [];
    if (!codigo) errores.push("error_codigo");
    if (!nombre) errores.push("error_nombre");
    if (!descripcion) errores.push("error_descripcion");
    if (!preciocpa) errores.push("error_preciocpa");
    if (!preciovta) errores.push("error_preciovta");
    if (!cantidad) errores.push("error_cantidad");
    if (descuento === undefined || descuento === null)
      errores.push("error_descuento");

    this.setState({ errores: errores });
    if (errores.length > 0) return false;

    var datosEnviar = {
      codigo: codigo,
      psuperiorid: selectedIdSuperioresToSend,
      pinferiorid: selectedIdInferioresToSend,
      accesorioid: selectedIdAccesoriosToSend,
      colorid: selectedIdColoresToSend,
      tamanoid: selectedIdTamanosToSend,
      talleid: selectedIdTallesToSend,
      nombre: nombre,
      descripcion: descripcion,
      preciocpa: preciocpa,
      preciovta: preciovta,
      cantidad: cantidad,
      descuento: descuento,
    };

    //console.log(datosEnviar)

    fetch(Api + "?insertar=1", {
      method: "POST",
      body: JSON.stringify(datosEnviar),
    })
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        //console.log(datosRespuesta);

        this.props.history.push("/menu_principal");
      })
      .catch(console.log());
  };

  render() {
    const { user } = this.props;
    //console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }
    const {
      codigo,
      nombre,
      descripcion,
      preciocpa,
      preciovta,
      cantidad,
      descuento,
      selectDataSuperiores,
      selectedValueSuperiores,

      selectedValueInferiores,
      selectDataInferiores,

      selectDataAccesorios,
      selectedValueAccesorios,

      selectedValueColores,
      selectDataColores,

      selectDataTamanos,
      selectedValueTamanos,

      selectedValueTalles,
      selectDataTalles,
    } = this.state;

    return (
      <Container>
        <NavAgregar></NavAgregar>
        <div className="card">
          <div className="card-body">
            <form action="" onSubmit={this.enviarDatos}>
              <div className="form-group elemento-cardCrear">
                <label htmlFor="">Codigo:</label>
                <input
                  type="text"
                  name="codigo"
                  onChange={this.cambioValor}
                  value={codigo}
                  id="codigo"
                  className={
                    (this.verificarError("error_codigo") ? "is-invalid" : "") +
                    " form-control inputClaveCrear"
                  }
                  placeholder="Ingrese un codigo"
                  aria-describedby="helpId"
                />
              </div>

              <div className="contenedorSelectsCrear">
                <div className="crearProductoTipos">
                  <label className="crearProductoTiposLabel">
                    Elija el tipo de producto:
                  </label>
                  <div className="elemento-cardCrear">
                    <Select
                      value={selectedValueSuperiores || "Prenda Superior:"}
                      onChange={this.handleChangeSuperiores}
                    >
                      <MenuItem
                        value="Prenda Superior:"
                        disabled={
                          this.state.seleccionInferior ||
                          this.state.seleccionAccesorio
                        }
                      >
                        Prenda Superior
                      </MenuItem>
                      {selectDataSuperiores.map((select) => (
                        <MenuItem
                          key={select.id}
                          value={select.descripcion}
                          disabled={
                            this.state.seleccionInferior ||
                            this.state.seleccionAccesorio
                          }
                        >
                          {select.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div className="elemento-cardCrear">
                    <Select
                      value={selectedValueInferiores || "Prenda Inferior:"}
                      onChange={this.handleChangeInferiores}
                    >
                      <MenuItem
                        value="Prenda Inferior:"
                        disabled={
                          this.state.seleccionSuperior ||
                          this.state.seleccionAccesorio
                        }
                      >
                        Prenda Inferior
                      </MenuItem>
                      {selectDataInferiores.map((select) => (
                        <MenuItem
                          key={select.id}
                          value={select.descripcion}
                          disabled={
                            this.state.seleccionSuperior ||
                            this.state.seleccionAccesorio
                          }
                        >
                          {select.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div className="elemento-cardCrear">
                    <Select
                      value={selectedValueAccesorios || "Accesorio:"}
                      onChange={this.handleChangeAccesorios}
                    >
                      <MenuItem
                        value="Accesorio:"
                        disabled={
                          this.state.seleccionSuperior ||
                          this.state.seleccionInferior
                        }
                      >
                        Accesorio
                      </MenuItem>
                      {selectDataAccesorios.map((select) => (
                        <MenuItem
                          key={select.id}
                          value={select.descripcion}
                          disabled={
                            this.state.seleccionSuperior ||
                            this.state.seleccionInferior
                          }
                        >
                          {select.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="crearProductoColor">
                  <label className="crearProductoColorLabel">
                    Elija el color:
                  </label>
                  <div className="elemento-cardCrear">
                    <Select
                      value={selectedValueColores || "Color:"}
                      onChange={this.handleChangeColores}
                    >
                      <MenuItem value="Color:">Color</MenuItem>
                      {selectDataColores.map((select) => (
                        <MenuItem key={select.id} value={select.descripcion}>
                          {select.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="crearProductoTamTalle">
                  <label className="crearProductoTamTalleLabel">
                    Elija el tamaño o talle:
                  </label>
                  <div className="elemento-cardCrear">
                    <Select
                      value={selectedValueTamanos || "Tamaño:"}
                      onChange={this.handleChangeTamanos}
                    >
                      <MenuItem
                        value="Tamaño:"
                        disabled={
                          this.state.disableTamanos || this.state.seleccionTalle
                        }
                      >
                        Tamaño
                      </MenuItem>
                      {selectDataTamanos.map((select) => (
                        <MenuItem
                          key={select.id}
                          value={select.descripcion}
                          disabled={
                            this.state.disableTamanos ||
                            this.state.seleccionTalle
                          }
                        >
                          {select.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div className="elemento-cardCrear">
                    <Select
                      value={selectedValueTalles || "Talle:"}
                      onChange={this.handleChangeTalles}
                    >
                      <MenuItem
                        value="Talle:"
                        disabled={
                          this.state.disableTalles || this.state.seleccionTam
                        }
                      >
                        Talle
                      </MenuItem>
                      {selectDataTalles.map((select) => (
                        <MenuItem
                          key={select.id}
                          value={select.descripcion}
                          disabled={
                            this.state.disableTalles || this.state.seleccionTam
                          }
                        >
                          {select.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="contenedorInputsCrear">
                <div className="form-group elemento-cardCrear">
                  <label htmlFor="">Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    onChange={this.cambioValor}
                    value={nombre}
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

                <div className="form-group elemento-cardCrear">
                  <label htmlFor="">Descripcion:</label>
                  <input
                    type="text"
                    name="descripcion"
                    onChange={this.cambioValor}
                    value={descripcion}
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

                <div className="form-group elemento-cardCrear">
                  <label htmlFor="">Precio compra:</label>
                  <input
                    type="text"
                    name="preciocpa"
                    onChange={this.cambioValor}
                    value={preciocpa}
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

                <div className="form-group elemento-cardCrear">
                  <label htmlFor="">Precio venta:</label>
                  <input
                    type="text"
                    name="preciovta"
                    onChange={this.cambioValor}
                    value={preciovta}
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

                <div className="form-group elemento-cardCrear">
                  <label htmlFor="">Cantidad disponible:</label>
                  <input
                    type="text"
                    name="cantidad"
                    onChange={this.cambioValor}
                    value={cantidad}
                    id="cantidad"
                    className={
                      (this.verificarError("error_cantidad")
                        ? "is-invalid"
                        : "") + " form-control"
                    }
                    placeholder="Ingrese la cantidad disponible"
                    aria-describedby="helpId"
                  />
                </div>

                <div className="form-group elemento-cardCrear">
                  <label htmlFor="">Descuento:</label>
                  <input
                    type="number"
                    name="descuento"
                    onChange={this.cambioValor}
                    value={descuento}
                    id="descuento"
                    className={
                      (this.verificarError("error_descuento")
                        ? "is-invalid"
                        : "") + " form-control"
                    }
                    placeholder="Ingrese el descuento"
                    aria-describedby="helpId"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div
                className="btn-group grupoBotonesCrear"
                role="group"
                aria-label=""
              >
                <button type="submit" className="btn boton-guardarCrear">
                  Agregar Producto
                </button>
                <Link
                  to={"/menu_principal"}
                  className="btn boton-cancelarCrear"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </Container>
    );
  }
}

CrearProducto.propTypes = {
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
