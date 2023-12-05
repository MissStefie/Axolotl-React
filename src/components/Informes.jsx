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
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
      clienteDireccionMap: {},
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
        const clienteDireccionMap = {};

        datosRespuesta.forEach((cliente) => {
          clienteNombreMap[cliente.id] = cliente.nombre;
          clienteApellidoMap[cliente.id] = cliente.apellido;
          clienteRucMap[cliente.id] = cliente.ruc;
          clienteDireccionMap[cliente.id] = cliente.direccion;
        });

        this.setState({
          clientesCargados: true,
          clientes: datosRespuesta,
          clienteNombreMap,
          clienteApellidoMap,
          clienteRucMap,
          clienteDireccionMap,
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
    const input = event.target.value.toLowerCase();
    this.setState({ filtroCodventa: input });
  };

  handleChangeFiltroCodProducto = (event) => {
    const input = event.target.value.toLowerCase();
    this.setState({ filtroCodproducto: input });
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
      clienteDireccionMap,
      productosMap,
    } = this.state;

    const pdf = new jsPDF();
    const fecha = registrosParaImprimir[0].fecha;
    const codventa = registrosParaImprimir[0].codventa;
    const clienteId = registrosParaImprimir[0].clienteid;
    const nombreCliente =
      clienteNombreMap[clienteId] + " " + clienteApellidoMap[clienteId];
    const rucCliente = clienteRucMap[clienteId];
    const dirCliente = clienteDireccionMap[clienteId];
    const total = registrosParaImprimir[0].totalventa;
    const totalINT = parseFloat(total);
    const ivaPorcentaje = 10;
    const iva = (total * ivaPorcentaje) / 100;
    const totalIVA = totalINT + iva;

    if (rucCliente === "0000000-0") {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`RECIBO DE COMPRA`, 20, 20);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Fecha: ${fecha}`, 20, 30);

      const headers = ["PRODUCTO", "PRECIO", "CANTIDAD", "PRECIO EN LINEA"];

      const data = registrosParaImprimir.map((venta) => [
        productosMap[venta.productoid],
        venta.preciounit,
        venta.cantidad,
        venta.precioxcant,
      ]);

      pdf.autoTable({
        startY: 80,
        head: [headers],
        body: data,
        margin: { top: 10 },
        theme: "striped",
        styles: {
          halign: "center",
          fillColor: [239, 236, 243],
          textColor: [0, 0, 0],
        },
      });

      const datosPrecioFinal = [[`PRECIO FINAL`, `${totalIVA}`]];

      const primeraTablaPosicionFinal = pdf.autoTable.previous.finalY;

      pdf.autoTable({
        startY: primeraTablaPosicionFinal,
        body: datosPrecioFinal,
        theme: "grid",
        margin: { top: 10 },
        styles: {
          halign: "center",
          textColor: [0, 0, 0],
          columnWidth: 91,
        },
      });

      const imageUrl = "/glowing_store_logo_circular.png";

      const imageWidth = 30;
      const imageHeight = 30;
      const imageX = pdf.internal.pageSize.getWidth() - imageWidth - 45;
      const imageY = 10;

      pdf.addImage(imageUrl, "JPEG", imageX, imageY, imageWidth, imageHeight);

      const empresaX = pdf.internal.pageSize.getWidth() - imageWidth - 50; // Posición X alineada con la imagen
      const empresaY = imageY + imageHeight + 10; // Ajustar la posición Y según tu preferencia

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`GLOWING STORE`, empresaX, empresaY);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`RUC: $$$$$$-$`, empresaX, empresaY + 10);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`CDE, PARAGUAY`, empresaX, empresaY + 20);

      pdf.save(`RECIBO_${codventa}.pdf`);
    } else {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Fecha: ${fecha}`, 20, 30);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Factura N° .........`, 20, 20);

      const dataClienteEmpresa = [
        [`Cliente: ${nombreCliente}`, `GLOWING STORE`],
        [`RUC: ${rucCliente}`, `RUC: $$$$$$-$`],
        [`Direccion: ${dirCliente}`, `CDE, PARAGUAY`],
      ];

      pdf.autoTable({
        startY: 40,
        body: dataClienteEmpresa,
        theme: "plain",
        margin: { top: 10 },
        styles: {
          halign: "center",
          textColor: [0, 0, 0],
          fontSize: 14,
          fontStyle: "bold",
        },
      });

      const headers = ["PRODUCTO", "PRECIO", "CANTIDAD", "PRECIO EN LINEA"];

      const data = registrosParaImprimir.map((venta) => [
        productosMap[venta.productoid],
        venta.preciounit,
        venta.cantidad,
        venta.precioxcant,
      ]);

      const primeraTablaPosicionFinal = pdf.autoTable.previous.finalY;

      pdf.autoTable({
        startY: primeraTablaPosicionFinal,
        head: [headers],
        body: data,
        margin: { top: 10 },
        theme: "striped",
        styles: {
          halign: "center",
          fillColor: [239, 236, 243],
          textColor: [0, 0, 0],
        },
      });

      const datosPrecioFinal = [
        [`TOTAL`, `${totalINT}`],
        [`IVA (10%)`, `${iva}`],
        [`PRECIO FINAL`, `${totalIVA}`],
      ];

      const segundaTablaPosicionFinal = pdf.autoTable.previous.finalY;

      pdf.autoTable({
        startY: segundaTablaPosicionFinal,
        body: datosPrecioFinal,
        theme: "grid",
        margin: { top: 10 },
        styles: {
          halign: "center",
          textColor: [0, 0, 0],
          columnWidth: 91,
        },
      });

      const imageUrl = "/glowing_store_logo_circular.png";

      const imageWidth = 30;
      const imageHeight = 30;
      const imageX = pdf.internal.pageSize.getWidth() - imageWidth - 45;
      const imageY = 10;

      pdf.addImage(imageUrl, "JPEG", imageX, imageY, imageWidth, imageHeight);

      pdf.save(`FACTURA_${codventa}.pdf`);
    }
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
