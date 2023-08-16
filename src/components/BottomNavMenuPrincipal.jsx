import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import "../css/bottomNavMenuPrincipal.css";
import axolotl_icono from '../img/axolotl_icono.png'

export default class BottomNavMenuPrincipal extends Component {
  render() {
    return (
      <div className="contenidoBottomNav">
        <div className="bottomContenido">
          Axolotl Software Development
          <img src={axolotl_icono} className="axolotl_icono"></img>
        </div>
      </div>
    );
  }
}
