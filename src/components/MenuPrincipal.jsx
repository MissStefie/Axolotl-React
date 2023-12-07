import React, { Component } from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBoxesStacked,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import NavMenuPrincipal from "./NavMenuPrincipal";
import BottomNavMenuPrincipal from "./BottomNavMenuPrincipal";
import "../css/menuPrincipal.css";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class MenuPrincipal extends Component {
  render() {
    const { user } = this.props;
    //console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }

    const tieneAcceso = user.rol === "1";

    return (
      <Container>
        <NavMenuPrincipal user={user}></NavMenuPrincipal>
        <Container className="menu_principal_contenido">
          <Link to="/realizar_venta" className="btn link_menu_principal">
            Realizar Venta{" "}
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "#e5beec" }}
              className="iconoMenuPrincipal"
            />
          </Link>

          {tieneAcceso && (
            <Link to="/crear" className="btn link_menu_principal">
              Cargar Stock{" "}
              <FontAwesomeIcon
                icon={faBoxesStacked}
                style={{ color: "#e5beec" }}
                className="iconoMenuPrincipal"
              />
            </Link>
          )}
          <Link to="/consultar" className="btn link_menu_principal">
            Consultar{" "}
            <FontAwesomeIcon
              icon={faBoxOpen}
              style={{ color: "#e5beec" }}
              className="iconoMenuPrincipal"
            />
          </Link>
        </Container>
        <BottomNavMenuPrincipal></BottomNavMenuPrincipal>
      </Container>
    );
  }
}

MenuPrincipal.propTypes = {
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
