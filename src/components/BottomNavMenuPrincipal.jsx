import React, { Component } from "react";
import "../css/bottomNavMenuPrincipal.css";
import axolotl_icono from "../img/axolotl_icono.png";

export default class BottomNavMenuPrincipal extends Component {
  render() {
    return (
      <div className="contenidoBottomNav">
        <div className="bottomContenido">
          Axolotl Software Development
          <img
            src={axolotl_icono}
            alt="Axolotl Icono"
            className="axolotl_icono"
          />
        </div>
      </div>
    );
  }
}
