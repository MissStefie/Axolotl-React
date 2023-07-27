import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import "../css/bottomNavMenuPrincipal.css";

export default class BottomNavMenuPrincipal extends Component {
  render() {
    return (
      <div className="contenidoBottomNav">
        <div className="bottomContenido">
          Axolotl Software Development
          <FontAwesomeIcon
            icon={faCopyright}
            style={{ color: "#917fb3" }}
            className="iconoCR"
          />
        </div>
      </div>
    );
  }
}
