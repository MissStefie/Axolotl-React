import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import "../css/navEditar.css";
import GSLOGO from "../img/glowing_store_logo.jpg";

export default class NavEditar extends Component {
  render() {
    return (
      <Container>
        <ul className="nav nav-pills nav_editar_bg">
          <div className="logo-container">
            <li>
              <Link to="#" className="menu" title="Regresa al menú">
                <img
                  src={GSLOGO}
                  alt="Glowing Store Logo"
                  className="logo-image"
                />
                Glowing Store
              </Link>
            </li>
          </div>

          <div className="consulta-container">
            <h1 className="titulo">Editar Producto</h1>
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{ color: "#e5beec" }}
              className="iconoCajitas"
            />
          </div>
          <div className="salir-container">
            <li>
              <Link to={"/consultar"} title="También regresa al menú">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{ color: "#e5beec" }}
                  className="iconoSalir"
                />
              </Link>
            </li>
          </div>
        </ul>
      </Container>
    );
  }
}
