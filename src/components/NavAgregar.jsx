import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/navAgregar.css";
import GSLOGO from "../img/glowing_store_logo.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default class NavAgregar extends Component {
  render() {
    return (
      <Container>
        <div className="nav-container-agregar">
          <ul className="nav nav-pills nav-bg-agregar">
            <div className="logo-container-agregar">
              <li>
                <a className="menu-agregar" title="Regresa al menu">
                  <img
                    src={GSLOGO}
                    alt="Glowing Store Logo"
                    className="logo-image-agregar"
                  ></img>
                  Glowing Store
                </a>
              </li>
            </div>

            <div className="consulta-container-agregar">
              <h1 className="titulo-agregar">Agregar</h1>
              <FontAwesomeIcon
                icon={faBoxOpen}
                style={{ color: "#e5beec" }}
                className="iconoCajitas-agregar"
              />
            </div>
            <div className="salir-container-agregar">
              <li>
                <a title="Tambien regresa al menu pero ya estaba en el diseño xdxd">
                  <Link to={"/consultar"}>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      style={{ color: "#e5beec" }}
                      className="iconoSalir-agregar"
                    />
                  </Link>
                </a>
              </li>
            </div>
          </ul>
        </div>
      </Container>
    );
  }
}
