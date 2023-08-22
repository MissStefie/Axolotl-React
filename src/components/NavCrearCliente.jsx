import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/navCrearCliente.css";
import GSLOGO from "../img/glowing_store_logo.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default class NavCrearCliente extends Component {
  render() {
    return (
      <Container>
        <div className="nav-container-crearCliente">
          <ul className="nav nav-pills nav-bg-crearCliente">
            <div className="logo-container-crearCliente">
              <li>
                <a className="menu-crearCliente" title="Regresa al menu">
                  <img
                    src={GSLOGO}
                    alt="Glowing Store Logo"
                    className="logo-image-crearCliente"
                  ></img>
                  Glowing Store
                </a>
              </li>
            </div>

            <div className="consulta-container-crearCliente">
              <h1 className="titulo-crearClienteNav">Registrar Cliente</h1>
              <FontAwesomeIcon icon={faUserPlus} style={{ color: "#e5beec" }} className="icono-CrearCliente"/>
            </div>
            <div className="salir-container-crearCliente">
              <li>
                <a title="Tambien regresa al menu pero ya estaba en el diseño xdxd">
                  <Link to={"/consultar"}>
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      style={{ color: "#e5beec" }}
                      className="iconoSalir-crearCliente"
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