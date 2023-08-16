import React, { Component } from "react";
import { Container, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import NavCargarProducto from "./NavCargarProducto";
import ApiCol from "../services/colores";
import ApiTam from "../services/tamanos";
import ApiPP from "../services/provisorioProductos";
import "../css/cargarStockTam.css";

export default class CargarStockTam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorid: "",
      tamanoid: "",
      selectDataColores: [],
      selectDataTamanos: [],
      coloresAgregados: [],
      selectedValueColores: "", // Agregamos selectedValueColores al estado principal
      cantidad: 0,
    };
  }

  componentDidMount() {
    fetch(ApiCol)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataColores: data }))
      .catch((error) => console.log(error));

    fetch(ApiTam)
      .then((response) => response.json())
      .then((data) => this.setState({ selectDataTamanos: data }))
      .catch((error) => console.log(error));
  }

  handleChangeColores = (event) => {
    const { value } = event.target;
    const { selectDataColores } = this.state;
    const selectedItem = selectDataColores.find(
      (select) => select.descripcion === value
    );
    if (selectedItem) {
      this.setState({
        selectedValueColores: value, // Actualizamos selectedValueColores en el estado principal
      });
    }
  };

  handleChangeTamanos = (event, colorId) => {
    const { value } = event.target;
    const coloresAgregados = this.state.coloresAgregados.map((color) => {
      if (color.id === colorId) {
        return {
          ...color,
          selectedValueTamanos: value,
        };
      }
      return color;
    });
    this.setState({
      coloresAgregados,
    });
  };

  handleChangeCantidad = (event) => {
    const { value } = event.target;
    this.setState({
      cantidad: parseInt(value, 10),
    });
  };

  agregarColor = () => {
    const { selectedValueColores, cantidad } = this.state;
    if (selectedValueColores && cantidad > 0) {
      const nuevoColor = {
        id: this.state.coloresAgregados.length + 1,
        selectedIdColores: this.state.selectDataColores.find(
          (select) => select.descripcion === selectedValueColores
        ).id,
        selectedValueColores,
        selectedValueTamanos: "",
      };
      const filasAgregadas = Array.from({ length: cantidad }, (_, index) => ({
        ...nuevoColor,
        id: nuevoColor.id + index,
      }));
      this.setState((prevState) => ({
        coloresAgregados: [...prevState.coloresAgregados, ...filasAgregadas],
        selectedValueColores: "", // Limpiamos selectedValueColores después de agregar un color
        cantidad: 0, // Reiniciamos el valor de cantidad a 0
      }));
    }
  };

  handleContinuarClick = () => {
    // Obtener los datos de la tabla CargarStockTam que quieres guardar en BD
    const datosTablaCargarStockTam = this.state.coloresAgregados;

    // Realizar una solicitud HTTP para enviar los datos al servidor
    fetch(ApiPP + "?insertar=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosTablaCargarStockTam),
    })
      .then((response) => response.json())
      .then((data) => {
        // Aquí puedes manejar la respuesta del servidor si es necesario
        console.log("Datos guardados en la BD:", data);
      })
      .catch((error) => {
        console.error("Error al enviar los datos al servidor:", error);
        // Mostrar el contenido completo de la respuesta
        error.response.text().then((text) => console.log(text));
      });

    // Navegar a la siguiente pestaña
    this.props.history.push("/cargar_stock_tam_detalles");
  };

  render() {
    const {
      selectedValueColores,
      selectDataColores,
      selectDataTamanos,
      coloresAgregados,
    } = this.state;
    console.log(coloresAgregados);

    return (
      <Container>
        <header>
          <NavCargarProducto></NavCargarProducto>
        </header>
        <Container className="contenidoCargarStockTam">
          <button onClick={this.agregarColor} className="agregarColorTam">
            Añadir color +
          </button>
          <div className="divAgregarColores">
            <div>
              <Select
                className="cargarStockTamElegirColorSelect1"
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
            <div>
              <label className="cargarStockTamLabel">Cantidad: </label>
              <input
                className="cargarStockTamInput"
                type="number"
                value={this.state.cantidad}
                onChange={this.handleChangeCantidad}
              />
            </div>
          </div>
          <div className="tablaCargarStockTamContainer">
            <table className="tablaCargarStockTam">
              <thead className="theadCargarStockTam">
                <tr>
                  <th>Colores añadidos</th>
                  <th>Tamaño</th>
                </tr>
              </thead>
              <tbody className="tbodyCargarStockTam">
                {coloresAgregados.map((color) => (
                  <tr key={color.id}>
                    <td>{color.selectedValueColores}</td>
                    <td>
                      <Select
                        value={color.selectedValueTamanos || "Tamaño:"}
                        onChange={(event) =>
                          this.handleChangeTamanos(event, color.id)
                        }
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cargarStockTamBotones">
            <div className="cargarStockTamAtrasDiv">
              <Link to="/crear" className="cargarStockTamAtras">
                Atras
              </Link>
            </div>
            <div className="cargarStockTamConCan">
              <Link
                to="/cargar_stock_tam_detalles"
                className="cargarStockTamCon"
                onClick={this.handleContinuarClick}
              >
                Continuar
              </Link>
              <Link to="/menu_principal" className="cargarStockTamCan">
                Cancelar
              </Link>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}
