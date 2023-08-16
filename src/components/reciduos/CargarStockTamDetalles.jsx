import React, { Component } from "react";
import { Container, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import NavCargarProducto from "./NavCargarProducto";
import "../css/cargarStockTamDetalles.css";
import ApiPS from "../services/prendasSuperior";
import ApiIn from "../services/prendasInferiores";
import ApiAcc from "../services/accesorios";

export default class CargarStockTamDetalles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoria: "Categoria",
      tipos: [],
    };
  }

  handleCategoriaChange = (event) => {
    const categoria = event.target.value;
    this.setState({ categoria });

    // Realiza la solicitud a la API correspondiente según la categoría seleccionada
    switch (categoria) {
      case "1": // Superior
        fetch(ApiPS)
          .then((response) => response.json())
          .then((data) => this.setState({ tipos: data }))
          .catch((error) => console.log(error));
        break;
      case "2": // Inferior
        fetch(ApiIn)
          .then((response) => response.json())
          .then((data) => this.setState({ tipos: data }))
          .catch((error) => console.log(error));
        break;
      case "3": // Accesorio
        fetch(ApiAcc)
          .then((response) => response.json())
          .then((data) => this.setState({ tipos: data }))
          .catch((error) => console.log(error));
        break;
      default:
        // Si no se selecciona una categoría, restablecer el estado a un arreglo vacío
        this.setState({ tipos: [] });
        break;
    }
  };

  render() {
    return (
      <Container>
        <Container>
          <div>
            <label>Nombre:</label>
            <input></input>
          </div>
          <div>
            <label>Codigo:</label>
            <input></input>
          </div>
          <div>
            <label>Descripcion:</label>
            <input></input>
          </div>
          <div>
            <label>Precio:</label>
            <input></input>
          </div>
          <div>
            <label>Categoria:</label>
            <Select
              value={this.state.categoria}
              onChange={this.handleCategoriaChange}
            >
              <MenuItem value="Categoria" disabled>
                Categoria
              </MenuItem>
              <MenuItem value="1">Superior</MenuItem>
              <MenuItem value="2">Inferior</MenuItem>
              <MenuItem value="3">Accesorio</MenuItem>
            </Select>
          </div>
          <div>
            <label>Tipo:</label>
            <Select>
              {/* Mapear los tipos de prendas según la categoría seleccionada */}
              {this.state.tipos.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Container>
        <div className="cargarStockTamBotones">
          <div className="cargarStockTamAtrasDiv">
            <Link to="/crear" className="cargarStockTamAtras">
              Atras
            </Link>
          </div>
          <div className="cargarStockTamConCan">
            <Link to="/menu_principal" className="cargarStockTamCon">
              Continuar
            </Link>
            <Link to="/menu_principal" className="cargarStockTamCan">
              Cancelar
            </Link>
          </div>
        </div>
      </Container>
    );
  }
}
