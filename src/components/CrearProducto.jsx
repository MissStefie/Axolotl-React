import React from "react";
import NavAgregar from "./NavAgregar";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { Select, MenuItem,  } from "@mui/material";
import Api from "../services/api";
import "../css/agregarProducto.css";

import ApiPS from "../services/prendasSuperior";
import ApiIn from "../services/prendasInferiores";
import ApiAcc from "../services/accesorios";
import ApiCol from "../services/colores";
import ApiTam from "../services/tamanos";
import ApiTal from "../services/talles";

class CrearProducto extends React.Component {
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
      errores: [],
    };
  }

  componentDidMount() {
    // Realiza una solicitud a la API para obtener los datos
    fetch(ApiPS)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataSuperiores: data }))
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de prendas inferiores
    fetch(ApiIn)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataInferiores: data }))
      .catch((error) => console.log(error));

    fetch(ApiAcc)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataAccesorios: data }))
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de prendas inferiores
    fetch(ApiCol)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataColores: data }))
      .catch((error) => console.log(error));

    fetch(ApiTam)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataTamanos: data }))
      .catch((error) => console.log(error));

    // Realiza una solicitud a la API para obtener los datos de prendas inferiores
    fetch(ApiTal)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataTalles: data }))
      .catch((error) => console.log(error));
  }

  cambioValor = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState({ state, errores: [] });
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
      });
    }
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
      });
    }
  };

  verificarError(elemento) {
    return this.state.errores.indexOf(elemento) !== -1;
  }

  enviarDatos = (e) => {
    e.preventDefault();
    console.log(e);
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

    var errores = [];
    if (!codigo) errores.push("error_codigo");
    if (!nombre) errores.push("error_nombre");
    if (!descripcion) errores.push("error_descripcion");
    if (!preciocpa) errores.push("error_preciocpa");
    if (!preciovta) errores.push("error_preciovta");
    if (!cantidad) errores.push("error_cantidad");
    if (!descuento) errores.push("error_descuento");

    this.setState({ errores: errores });
    if (errores.length > 0) return false;

    var datosEnviar = {
      codigo: codigo,
      psuperiorid: selectedIdSuperiores,
      pinferiorid: selectedIdInferiores,
      accesorioid: selectedIdAccesorios,
      colorid: selectedIdColores,
      tamanoid: selectedIdTamanos,
      talleid: selectedIdTalles,
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
        console.log(datosRespuesta);

        this.props.history.push("/consultar");
      })
      .catch(console.log());
  };

  render() {
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
                <div className="elemento-cardCrear">
                  <Select
                    value={selectedValueSuperiores || "Prenda Superior:"}
                    onChange={this.handleChangeSuperiores}
                  >
                    <MenuItem value="Prenda Superior:" disabled>
                      Prenda Superior
                    </MenuItem>
                    {selectDataSuperiores.map((select) => (
                      <MenuItem key={select.id} value={select.descripcion}>
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
                    <MenuItem value="Prenda Inferior:" disabled>
                      Prenda Inferior
                    </MenuItem>
                    {selectDataInferiores.map((select) => (
                      <MenuItem key={select.id} value={select.descripcion}>
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
                    <MenuItem value="Accesorio:" disabled>
                      Accesorio
                    </MenuItem>
                    {selectDataAccesorios.map((select) => (
                      <MenuItem key={select.id} value={select.descripcion}>
                        {select.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className="elemento-cardCrear">
                  <Select
                    value={selectedValueColores || "Color:"}
                    onChange={this.handleChangeColores}
                  >
                    <MenuItem value="Color:" disabled>
                      Color
                    </MenuItem>
                    {selectDataColores.map((select) => (
                      <MenuItem key={select.id} value={select.descripcion}>
                        {select.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className="elemento-cardCrear">
                  <Select
                    value={selectedValueTamanos || "Tamaño:"}
                    onChange={this.handleChangeTamanos}
                  >
                    <MenuItem value="Tamaño:" disabled>
                      Tamaño
                    </MenuItem>
                    {selectDataTamanos.map((select) => (
                      <MenuItem key={select.id} value={select.descripcion}>
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
                    <MenuItem value="Talle:" disabled>
                      Talle
                    </MenuItem>
                    {selectDataTalles.map((select) => (
                      <MenuItem key={select.id} value={select.descripcion}>
                        {select.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
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
                    type="text"
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
                  />
                </div>
              </div>

              <div
                className="btn-group grupoBotones"
                role="group"
                aria-label=""
              >
                <button type="submit" className="btn boton-guardarCrear">
                  Agregar Producto
                </button>
                <Link to={"/menu_principal"} className="btn boton-cancelarCrear">
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

export default CrearProducto;
