import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../css/navMenuPrincipal.css";
import GSLOGO from "../img/glowing_store_logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFileLines,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

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
    const { user } = this.props;

    //console.log(user);

    if (!user) {
      return <Redirect to="/" />;
    }

    return (
      <div className="nav-container">
        <ul className="nav nav-pills nav_menu_bg nav-tabs">
          <li className="logo-container">
            <Link to="#" className="menu" title="Regresa al menu">
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
              Administrar clientes{" "}
              <FontAwesomeIcon
                icon={faUsers}
                style={{ color: "#e5beec" }}
                className="iconoAdmUsuario"
              />
            </Dropdown.Toggle>
            {mostrarDropdown && (
              <Dropdown.Menu className="dropdown_items_fondo">
                <Dropdown.Item
                  as={Link}
                  to={{ pathname: "/registrar_cliente", state: { user } }}
                >
                  Registrar cliente
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to={{ pathname: "/modificar_cliente", state: { user } }}
                >
                  Modificar cliente
                </Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
          <Link className="btn ver_informes_boton" to={"/informes"}>
            Ver informes{" "}
            <FontAwesomeIcon
              icon={faFileLines}
              style={{ color: "#e5beec" }}
              className="iconoVerInforme"
            />
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

NavMenuPrincipal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    correo: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired,
    telefono: PropTypes.string.isRequired,
    usuario: PropTypes.string.isRequired,
  }),
};
