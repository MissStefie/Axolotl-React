import { Container } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/navModificarCliente.css";
import GSLOGO from "../img/glowing_store_logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default class NavModificarCliente extends Component {
  render() {
    return (
      <Container>
        <div className="nav-container-modificarCliente">
          <ul className="nav nav-pills nav-bg-modificarCliente">
            <div className="logo-container-modificarCliente">
              <li>
                <div className="menu-modificarCliente" title="Regresa al menu">
                  <img
                    src={GSLOGO}
                    alt="Glowing Store Logo"
                    className="logo-image-modificarCliente"
                  ></img>
                  Glowing Store
                </div>
              </li>
            </div>

            <div className="consulta-container-modificarCliente">
              <h1 className="titulo-modificarClienteNav">Modificar Cliente</h1>
              <FontAwesomeIcon
                icon={faUserPen}
                style={{ color: "#e5beec" }}
                className="icono-modificarCliente"
              />
            </div>
            <div className="salir-container-modificarCliente">
              <li>
                <Link
                  to={"/menu_principal"}
                  title="Tambien regresa al menu pero ya estaba en el diseño xdxd"
                >
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "#e5beec" }}
                    className="iconoSalir-modificarCliente"
                  />
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </Container>
    );
  }
}
