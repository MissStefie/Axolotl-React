import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../css/navMenuPrincipal.css";
import GSLOGO from "../img/glowing_store_logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFileLines, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default class NavMenuPrincipal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarDropdown: false,
    };
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({
      mostrarDropdown: !prevState.mostrarDropdown,
    }));
  };

  cerrarDropdown = () => {
    this.setState({
      mostrarDropdown: false,
    });
  };

  render() {
    const { mostrarDropdown } = this.state;
    return (
      <div className="nav-container">
        <ul className="nav nav-pills nav_menu_bg nav-tabs">
          <li className="logo-container">
            <Link className="menu" title="Regresa al menu">
              <img
                src={GSLOGO}
                alt="Glowing Store Logo"
                className="logo-image"
              />
              Glowing Store
            </Link>
          </li>
          <Dropdown
            className="dropdown_menu"
            onMouseEnter={this.toggleDropdown}
            onMouseLeave={this.cerrarDropdown}
          >
            <Dropdown.Toggle className="dropdown_button">
              Administrar clientes <FontAwesomeIcon icon={faUsers} style={{color: "#e5beec",}} className="iconoAdmUsuario" />
            </Dropdown.Toggle>
            {mostrarDropdown && (
              <Dropdown.Menu className="dropdown_items_fondo">
                <Dropdown.Item href="#action1">Registrar cliente</Dropdown.Item>
                <Dropdown.Item href="#action2">Modificar cliente</Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
          <Link className="btn ver_informes_boton" to={"#action3"}>
            Ver informes <FontAwesomeIcon icon={faFileLines} style={{color: "#e5beec",}} className="iconoVerInforme"/>
          </Link>
          <li className="salir-container">
            <Link to={"/"} title="Salir de sesión.">
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ color: "#e5beec" }}
                className="iconoSalir"
              />
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
