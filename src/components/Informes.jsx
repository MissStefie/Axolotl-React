import { Container } from "@mui/material";
import React, { Component } from "react";
import { Dropdown, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "../css/informes.css";
import NavInformes from "./NavInformes";
import ApiPV from "../services/procesoVenta";
import ApiC from "../services/clientes";
import ApiV from "../services/vendedores";
import Api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

export default class Informes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datosCargados: false,
      productosCargados: false,
      clientesCargados: false,
      vendedoresCargados: false,
      productosMap: {},
      clienteNombreMap: {},
      clienteApellidoMap: {},
      clienteRucMap: {},
      vendedorNombreMap: {},
      vendedorApellidoMap: {},
      ventas: [],
      productos: [],
      clientes: [],
      vendedores: [],
      filtroCodventa: "",
      filtroCodproducto: "",
      filtroVendedor: "",
      filtroCliente: "",
      isDropdownOpen: false,
      filtroFechaMax: "",
      filtroFechaMin: "",
    };
  }

  cargarDatos() {
    fetch(ApiPV)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        this.setState({ datosCargados: true, ventas: datosRespuesta });
      })
      .catch(console.log);
  }

  cargarDatosProductos() {
    fetch(Api)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        const productosMap = {};

        datosRespuesta.forEach((producto) => {
          productosMap[producto.id] = producto.codigo;
        });

        this.setState({
          productosCargados: true,
          productos: datosRespuesta,
          productosMap,
        });
      })
      .catch(console.log);
  }

  cargarDatosClientes() {
    fetch(ApiC)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        const clienteNombreMap = {};
        const clienteApellidoMap = {};
        const clienteRucMap = {};

        datosRespuesta.forEach((cliente) => {
          clienteNombreMap[cliente.id] = cliente.nombre;
          clienteApellidoMap[cliente.id] = cliente.apellido;
          clienteRucMap[cliente.id] = cliente.ruc;
        });

        this.setState({
          clientesCargados: true,
          clientes: datosRespuesta,
          clienteNombreMap,
          clienteApellidoMap,
          clienteRucMap,
        });
      })
      .catch(console.log);
  }

  cargarDatosVendedores() {
    fetch(ApiV)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        const vendedorNombreMap = {};
        const vendedorApellidoMap = {};

        datosRespuesta.forEach((vendedor) => {
          vendedorNombreMap[vendedor.id] = vendedor.nombre;
          vendedorApellidoMap[vendedor.id] = vendedor.apellido;
        });

        this.setState({
          vendedoresCargados: true,
          vendedores: datosRespuesta,
          vendedorNombreMap,
          vendedorApellidoMap,
        });
      })
      .catch(console.log);
  }

  componentDidMount() {
    this.cargarDatos();
    this.cargarDatosProductos();
    this.cargarDatosClientes();
    this.cargarDatosVendedores();
  }

  handleChangeFiltroCodVenta = (event) => {
    this.setState({ filtroCodventa: event.target.value });
  };

  handleChangeFiltroCodProducto = (event) => {
    this.setState({ filtroCodproducto: event.target.value });
  };

  handleChangeFiltroCliente = (event) => {
    const input = event.target.value.toLowerCase();
    this.setState({ filtroCliente: input });
  };

  handleChangeFiltroVendedor = (event) => {
    this.setState({ filtroVendedor: event.target.value });
  };

  handleDropdownToggle = (isOpen) => {
    this.setState({ isDropdownOpen: isOpen });
  };

  handleChangeFiltroFechaMin = (date) => {
    this.setState({ filtroFechaMin: date ? date : "" });
  };
  handleChangeFiltroFechaMax = (date) => {
    this.setState({ filtroFechaMax: date ? date : "" });
  };

  handleImprimirRegistros = (registro) => {
    if (!registro) {
      console.error("Registro no válido");
      return;
    }

    const { ventas } = this.state;
    const registrosParaImprimir = ventas.filter(
      (venta) => venta.codventa === registro.codventa
    );

    const {
      clienteNombreMap,
      clienteApellidoMap,
      clienteRucMap,
      productosMap,
    } = this.state;

    const fecha = registrosParaImprimir[0].fecha;
    const clienteId = registrosParaImprimir[0].clienteid;
    const nombreCliente =
      clienteNombreMap[clienteId] + " " + clienteApellidoMap[clienteId];
    const rucCliente = clienteRucMap[clienteId];
    const total = registrosParaImprimir[0].totalventa;
    const totalINT = parseFloat(total);
    const ivaPorcentaje = 10;
    const iva = (total * ivaPorcentaje) / 100;
    const totalIVA = (totalINT + iva);

    let contenidoHTML;
    if (rucCliente === "0000000-0") {
      contenidoHTML = `
        <html>
        <head>
            <link rel="icon" href="http://localhost:3000/static/media/glowing_store_logo.98249adc124717087a5f.jpg" />
          <title>Recibo</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap");

            .bodyEstiloFactura {
              font-family: "Nunito", sans-serif !important;
              padding: 20px;
              box-sizing: border-box; 
              max-width: 100%; 
              margin: 0 auto; 
            }

            .cabeceraFactura{
              display: flex;
              justify-content: space-between; 
            }
      
            .datosFactura {
              display: flex;
              justify-content: space-between; /* Distribuir el espacio entre datosCliente y datosEmpresa */
              flex-wrap: wrap; /* Permite que los elementos se envuelvan si no hay suficiente espacio */
            }
      
            .datosCliente,
            .datosEmpresa {
              border: 1px solid black;
              margin-bottom: 10px;
              padding: 10px;
              flex: 1; /* Hace que ambos elementos ocupen la misma cantidad de espacio inicialmente */
            }
      
            .datosCliente h2,
            .datosEmpresa h2 {
              margin: 0;
              margin-bottom: 8px;
              border-bottom: 1px solid black;
              padding-bottom: 4px;
              width: 100%;
            }
      
            .datosCliente h2:last-child,
            .datosEmpresa h2:last-child {
              border-bottom: none;
              margin-bottom: -10px;
            }
      
            .datosEmpresa h2 {
              border-bottom: none; /* Elimina el subrayado */
              display: flex;
              align-items: center;
              justify-content: center;
            }
      
            h2 {
              margin: 0;
            }
      
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
      
            th,
            td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }

            .imagenLogo{
              max-width: 100px; 
              height: 100px;
              border-radius: 50%;
            }

            .contenidoHTML{
              padding: 20px;
              border: 1px solid black;
            }

      </style>
        </head>
        <div class = "contenidoHTML">
          <body class = "bodyEstiloFactura">    
            <div class = "cabeceraFactura">
              <img class="imagenLogo" src="http://localhost:3000/static/media/glowing_store_logo.98249adc124717087a5f.jpg">
            <h1>Recibo</h1>
            </div>
            <h2 class>Fecha: ${fecha}</h2>
            <div class = "datosFactura">
              <div class="datosEmpresa">
                <h2 class>GLOWING STORE</h2>
              </div>
            </div>
              <table>
                <thead>
                  <tr>
                    <th>Código de producto</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Precio en línea</th>
                  </tr>
                </thead>
                <tbody>
                  ${registrosParaImprimir
                    .map(
                      (registro) => `
                    <tr>
                      <td>${productosMap[registro.productoid]}</td>
                      <td>${registro.preciounit}</td>
                      <td>${registro.cantidad}</td>
                      <td>${registro.precioxcant}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3">Total:</td>
                    <td>${total}</td>
                  </tr>
                </tfoot>
              </table>
          </body>
        </div>  
      </html>
      `;
    } else {
      contenidoHTML = `
      <html>
        <head>
          <link rel="icon" href="http://localhost:3000/static/media/glowing_store_logo.98249adc124717087a5f.jpg" />
          <title>Factura</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap");

            .bodyEstiloFactura {
              font-family: "Nunito", sans-serif !important;
              padding: 20px;
              box-sizing: border-box; 
              max-width: 100%; 
              margin: 0 auto; 
            }

            .cabeceraFactura{
              display: flex;
              justify-content: space-between; 
            }
      
            .datosFactura {
              display: flex;
              justify-content: space-between; /* Distribuir el espacio entre datosCliente y datosEmpresa */
              flex-wrap: wrap; /* Permite que los elementos se envuelvan si no hay suficiente espacio */
            }
      
            .datosCliente,
            .datosEmpresa {
              border: 1px solid black;
              margin-bottom: 10px;
              padding: 10px;
              flex: 1; /* Hace que ambos elementos ocupen la misma cantidad de espacio inicialmente */
            }
      
            .datosCliente h2,
            .datosEmpresa h2 {
              margin: 0;
              margin-bottom: 8px;
              border-bottom: 1px solid black;
              padding-bottom: 4px;
              width: 100%;
            }
      
            .datosCliente h2:last-child,
            .datosEmpresa h2:last-child {
              border-bottom: none;
              margin-bottom: -10px;
            }
      
            .datosEmpresa h2 {
              border-bottom: none; /* Elimina el subrayado */
              display: flex;
              align-items: center;
              justify-content: center;
            }
      
            h2 {
              margin: 0;
            }
      
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
      
            th,
            td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }

            .imagenLogo{
              max-width: 100px; 
              height: 100px;
              border-radius: 50%;
            }

            .contenidoHTML{
              padding: 20px;
              border: 1px solid black;
            }

      </style>
        </head>
        <div class = "contenidoHTML">
          <body class = "bodyEstiloFactura">    
            <div class = "cabeceraFactura">
              <img class="imagenLogo" src="http://localhost:3000/static/media/glowing_store_logo.98249adc124717087a5f.jpg">
              <h1>Factura № .........</h1>
            </div>
            <h2 class>Fecha: ${fecha}</h2>
            <div class = "datosFactura">
              <div class="datosCliente">
                <h2>Cliente: ${nombreCliente}</h2>
                <h2>RUC: ${rucCliente}</h2>
                <h2>Dirección: CDE</h2>
              </div>
              <div class="datosEmpresa">
                
                <h2 class>GLOWING STORE</h2>
                <h2>RUC: $$$$$$-$</h2>
                <h2>CDE, PARAGUAY</h2>
              </div>
            </div>
              <table>
                <thead>
                  <tr>
                    <th>Código de producto</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Precio en línea</th>
                  </tr>
                </thead>
                <tbody>
                  ${registrosParaImprimir
                    .map(
                      (registro) => `
                    <tr>
                      <td>${productosMap[registro.productoid]}</td>
                      <td>${registro.preciounit}</td>
                      <td>${registro.cantidad}</td>
                      <td>${registro.precioxcant}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3">Total:</td>
                    <td>${total}</td>
                  </tr>
                  <tr>
                    <td colSpan="3">IVA:</td>
                    <td>${iva}</td>
                  </tr>
                  <tr>
                    <td colSpan="3">Total con IVA incluido:</td>
                    <td>${totalIVA}</td>
                  </tr>
                </tfoot>
              </table>
          </body>
        </div>  
      </html>
    `;
    }

    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.open();
    ventanaImpresion.document.write(contenidoHTML);
    ventanaImpresion.document.close();

    ventanaImpresion.print();
  };

  render() {
    const { user } = this.props;
    console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }

    const {
      datosCargados,
      ventas,
      filtroCodventa,
      filtroCodproducto,
      filtroCliente,
      filtroVendedor,
      filtroFechaMax,
      filtroFechaMin,
      vendedorNombreMap,
      vendedorApellidoMap,
      productosMap,
      clienteNombreMap,
      clienteApellidoMap,
    } = this.state;

    const ventasFiltradas = ventas.filter((venta) => {
      const nombreCliente = (
        clienteNombreMap[venta.clienteid] +
        " " +
        clienteApellidoMap[venta.clienteid]
      ).toLowerCase();

      const ventaTime = new Date(venta.fecha).getTime();
      const filtroFechaMinTime = filtroFechaMin
        ? new Date(filtroFechaMin).setUTCHours(0, 0, 0, 0)
        : null;
      const filtroFechaMaxTime = filtroFechaMax
        ? new Date(filtroFechaMax).setUTCHours(23, 59, 59, 999)
        : null;

      return (
        nombreCliente.includes(filtroCliente) &&
        venta.codventa.toLowerCase().includes(filtroCodventa) &&
        productosMap[venta.productoid]
          ?.toLowerCase()
          .includes(filtroCodproducto) &&
        (filtroVendedor === "" || venta.vendedorid === filtroVendedor) &&
        (!filtroFechaMinTime || ventaTime >= filtroFechaMinTime) &&
        (!filtroFechaMaxTime || ventaTime <= filtroFechaMaxTime)
      );
    });

    if (!datosCargados) {
      return <div>Cargando...</div>;
    } else {
      return (
        <Container className="containerInformes">
          <NavInformes></NavInformes>
          <div className="filtrosInformes">
            <div className="cardBotonesAgregarFiltrar">
              <div className="botones-container">
                <div className="card-header">
                  <Dropdown
                    onToggle={this.handleDropdownToggle}
                    show={this.state.isDropdownOpen}
                    className="filtroVenta"
                  >
                    <Dropdown.Toggle className="toggleInformes">
                      Aplicar filtro
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdownMenuInformes">
                      <div className="row">
                        <div className="col">
                          <Dropdown.Item className="dditemInformes">
                            Código de venta:
                            <Form.Control
                              type="text"
                              value={filtroCodventa}
                              onChange={this.handleChangeFiltroCodVenta}
                              placeholder="N° de venta"
                              onClick={(e) => e.stopPropagation()}
                              className="form_controlInformes"
                            />
                          </Dropdown.Item>
                          <Dropdown.Item className="dditemInformes">
                            Filtrar por código de producto:
                            <Form.Control
                              type="text"
                              value={filtroCodproducto}
                              onChange={this.handleChangeFiltroCodProducto}
                              placeholder="Código del producto"
                              onClick={(e) => e.stopPropagation()}
                              className="form_controlInformes"
                            />
                          </Dropdown.Item>
                          <Dropdown.Item className="dditemInformes">
                            Filtrar por nombre de cliente:
                            <Form.Control
                              type="text"
                              value={filtroCliente}
                              onChange={this.handleChangeFiltroCliente}
                              placeholder="Nombre del cliente"
                              onClick={(e) => e.stopPropagation()}
                              className="form_controlInformes"
                            />
                          </Dropdown.Item>
                          <Dropdown.Item className="dditemInformes">
                            Filtrar por vendedor:
                            <Form.Control
                              as="select"
                              value={filtroVendedor}
                              onChange={this.handleChangeFiltroVendedor}
                              onClick={(e) => e.stopPropagation()}
                              className="form_controlInformes"
                            >
                              <option value="">Elegir vendedor</option>
                              {this.state.vendedores.map((vendedor) => (
                                <option key={vendedor.id} value={vendedor.id}>
                                  {vendedor.nombre} {vendedor.apellido}
                                </option>
                              ))}
                            </Form.Control>
                          </Dropdown.Item>
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>

            <div className="filtrosFecha">
              <div className="inputFechaMin">
                <DatePicker
                  selected={filtroFechaMin ? new Date(filtroFechaMin) : null}
                  onChange={(date) => this.handleChangeFiltroFechaMin(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Fecha inicial"
                  isClearable
                  todayButton="Hoy"
                  className="custom-datepicker"
                />
              </div>

              <div className="inputFechaMax">
                <DatePicker
                  selected={filtroFechaMax ? new Date(filtroFechaMax) : null}
                  onChange={(date) => this.handleChangeFiltroFechaMax(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Fecha final"
                  isClearable
                  todayButton="Hoy"
                  className="custom-datepicker"
                />
              </div>
            </div>
          </div>

          <div className="card-header contenidoTablaInformes">
            <div className="scrollTablaInformes">
              <table className="tablaInformes" id="tablaInformes">
                <thead className="tablaInformes-header">
                  <tr>
                    <th>Código de Venta</th>
                    <th>Fecha</th>
                    <th>Vendedor</th>
                    <th>Cliente</th>
                    <th>Código del producto</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Precio en línea</th>
                    <th>Total de la venta</th>
                    <th>Imprimir</th>
                  </tr>
                </thead>
                <tbody className="tablaInformes-container">
                  {ventasFiltradas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.codventa}</td>
                      <td>{venta.fecha}</td>
                      <td>
                        {vendedorNombreMap[venta.vendedorid] +
                          " " +
                          vendedorApellidoMap[venta.vendedorid]}
                      </td>
                      <td>
                        {clienteNombreMap[venta.clienteid] +
                          " " +
                          clienteApellidoMap[venta.clienteid]}
                      </td>
                      <td>{productosMap[venta.productoid]}</td>
                      <td>{venta.preciounit}</td>
                      <td>{venta.cantidad}</td>
                      <td>{venta.precioxcant}</td>
                      <td>{venta.totalventa}</td>
                      <td>
                        <Link
                          to="#"
                          className="btn boton-imprimir"
                          onClick={() => this.handleImprimirRegistros(venta)}
                        >
                          <FontAwesomeIcon
                            icon={faFilePdf}
                            style={{ color: "#E5BEEC" }}
                            className="imprimirRegistro"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      );
    }
  }
}

Informes.propTypes = {
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
