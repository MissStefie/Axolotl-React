import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/navInformes.css";
import GSLOGO from "../img/glowing_store_logo.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faFile
} from "@fortawesome/free-solid-svg-icons";

export default class NavInformes extends Component {
  render() {
    return (
      <Container className="nav_container">
        <ul className="nav nav-pills nav_informes_bg">
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

          <div className="informes-container">
            <h1 className="titulo">Informes</h1>
            <FontAwesomeIcon
              icon={faFile}
              style={{ color: "#e5beec" }}
              className="iconoCarrito"
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
