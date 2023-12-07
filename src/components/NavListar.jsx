import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/navListar.css";
import GSLOGO from "../img/glowing_store_logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default class NavListar extends Component {
  render() {
    return (
      <Container className="nav_container">
        <ul className="nav nav-pills nav_consultar_bg">
          <div className="logo-container">
            <li>
              <Link to="#" className="menu" title="Regresa al menu">
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
            <h1 className="titulo">Consultar</h1>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ color: "#e5beec" }}
              className="iconoCajitas"
            />
          </div>
          <div className="salir-container">
            <li>
              <Link
                to={"/menu_principal"}
                title="Por el momento lleva de vuelta al inicio de sesion..."
              >
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
