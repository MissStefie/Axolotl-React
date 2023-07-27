import React, { Component } from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBoxesStacked,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import NavMenuPrincipal from "./NavMenuPrincipal";
import BottomNavMenuPrincipal from './BottomNavMenuPrincipal'
import "../css/menuPrincipal.css";

export default class MenuPrincipal extends Component {
  render() {
    return (
      <Container>
        <NavMenuPrincipal></NavMenuPrincipal>
        <Container className="menu_principal_contenido">
          <Link to="/1" className="btn link_menu_principal">
            Realizar Venta{" "}
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "#e5beec" }}
              className="iconoMenuPrincipal"
            />
          </Link>
          <Link to="/crear" className="btn link_menu_principal">
            Cargar Stock{" "}
            <FontAwesomeIcon
              icon={faBoxesStacked}
              style={{ color: "#e5beec" }}
              className="iconoMenuPrincipal"
            />
          </Link>
          <Link to="/consultar" className="btn link_menu_principal">
            Consultar{" "}
            <FontAwesomeIcon
              icon={faBoxOpen}
              style={{ color: "#e5beec" }}
              className="iconoMenuPrincipal"
            />
          </Link>
        </Container>
        <BottomNavMenuPrincipal></BottomNavMenuPrincipal>
      </Container>
    );
  }
}
