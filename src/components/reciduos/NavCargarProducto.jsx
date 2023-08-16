import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faBoxesStacked
} from "@fortawesome/free-solid-svg-icons";
import "../css/navCargarProducto.css";
import GSLOGO from "../img/glowing_store_logo.jpg";

export default class NavCargarProducto extends Component {
  render() {
    return (
      <Container>
        <ul className="nav nav-pills nav_editar_bg">
          <div className="logo-container">
            <li>
              <a className="menu" title="Regresa al menu">
                <img
                  src={GSLOGO}
                  alt="Glowing Store Logo"
                  className="logo-image"
                ></img>
                Glowing Store
              </a>
            </li>
          </div>

          <div className="consulta-container">
            <h1 className="titulo">Cargar Producto</h1>
            <FontAwesomeIcon
              icon={faBoxesStacked}
              style={{ color: "#e5beec" }}
              className="iconoCajitas"
            />
          </div>
          <div className="salir-container">
            <li>
              <a title="Tambien regresa al menu pero ya estaba en el diseño xdxd">
                <Link to={"/menu_principal"}>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "#e5beec" }}
                    className="iconoSalirCP"
                  />
                </Link>
              </a>
            </li>
          </div>
        </ul>
      </Container>
    );
  }
}
