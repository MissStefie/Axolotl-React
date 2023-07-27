import React, { Component } from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import NavCargarProducto from "./NavCargarProducto";
import "../css/cargarProducto.css";

export default class CargarStock1 extends Component {
  render() {
    return (
      <Container className="container-cargar-stock-1">
        <NavCargarProducto></NavCargarProducto>
        <Container className="container-elegir-tam-talle">
          <Link to="/cargar_stock_tam" className="btn link-elegir-tam">
            Usa tamaño
          </Link>
          <Link to="/cargar_stock_talle" className="btn link-elegir-talle">
            Usa talle
          </Link>
        </Container>
      </Container>
    );
  }
}
