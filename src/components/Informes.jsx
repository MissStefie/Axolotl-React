import { Container } from "@mui/material";
import React, { Component } from "react";
import { Dropdown, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import "../css/informes.css";
import NavInformes from "./NavInformes";
import ApiPV from "../services/procesoVenta";
import ApiC from "../services/clientes";
import ApiV from "../services/vendedores";
import Api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

        datosRespuesta.forEach((cliente) => {
          clienteNombreMap[cliente.id] = cliente.nombre;
          clienteApellidoMap[cliente.id] = cliente.apellido;
        });

        this.setState({
          clientesCargados: true,
          clientes: datosRespuesta,
          clienteNombreMap,
          clienteApellidoMap,
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
                              value={filtroCliente} // Asegúrate de usar el valor correcto del estado
                              onChange={this.handleChangeFiltroCliente} // Llama a la función adecuada
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
                      <td>Boton imprimir</td>
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
