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
                <Link to={"/menu_principal"} title="También regresa al menú">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{ color: "#e5beec" }}
                    className="iconoSalir-agregar"
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
