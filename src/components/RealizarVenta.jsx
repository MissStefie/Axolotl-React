import React from "react";
import Api from "../services/api";
import NavAgregarAlCarrito from "./NavAgregarAlCarrito";
import { Dropdown, Form } from "react-bootstrap";
import { Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  /*faBoxOpen, icono del boton para cargar producto que se comento ya que esa funcion se encuentra en el menu principal*/
  faCartPlus,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import "../css/productosVenta.css";
import "bootstrap/dist/css/bootstrap.css";
import swal from "sweetalert2";
import { Link } from "react-router-dom";

class RealizarVenta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datosCargados: false,
      productos: [],
      filtro: "",
      isDropdownOpen: false,
      colorFiltro: "",
      categoriaFiltro: "",
      tamanoFiltro: "",
      talleFiltro: "",
      maxValores: {},
      checkboxes: [],
      inputValues: [],
    };
  }

  borrarRegistros = (id) => {
    fetch(Api + "?borrar=" + id)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        console.log(datosRespuesta);
        this.cargarDatos();
      })
      .catch(console.log);
  };

  cargarDatos() {
    fetch(Api)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        const maxValores = {};
        datosRespuesta.forEach((producto) => {
          // Calcula el valor máximo permitido como el mínimo entre la cantidad disponible y un valor máximo (si lo tienes).
          const valorMaximo = Math.min(parseFloat(producto.cantidad), 100); // Cambia 100 por el valor máximo deseado
          maxValores[producto.id] = valorMaximo;
        });

        console.log(datosRespuesta);
        this.setState({
          datosCargados: true,
          productos: datosRespuesta,
          maxValores,
        });
      })
      .catch(console.log);
  }

  componentDidMount() {
    this.cargarDatos();
    this.setState({
      inputValues: new Array(this.state.productos.length).fill(""),
    });
  }

  mostrarAlerta = (id) => {
    swal
      .fire({
        title: "Borrar",
        text: "¿Está seguro que desea borrar el registro?",
        icon: "question",
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        customClass: {
          popup: "popup-class",
          title: "my-swal-title",
          text: "my-swal-text",
          content: "my-swal-content",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
        },
      })
      .then((respuestaAlert) => {
        if (respuestaAlert.isConfirmed) {
          this.borrarRegistros(id);
          swal.fire({
            text: "El registro se ha borrado exitosamente.",
            icon: "success",
            customClass: {
              popup: "popup-class",
              title: "my-swal-title",
              text: "my-swal-text",
              content: "my-swal-content",
              icon: "my-swal-icon",
              confirmButton: "swal-confirm",
              cancelButton: "swal-cancel",
            },
          });
        }
      });
  };

  handleChangeFiltro = (event) => {
    this.setState({ filtro: event.target.value });
  };

  handleChangeColorFiltro = (event) => {
    this.setState({ colorFiltro: event.target.value });
  };

  handleChangeCategoriaFiltro = (event) => {
    this.setState({ categoriaFiltro: event.target.value.toLowerCase() });
  };

  handleChangeTamanoFiltro = (event) => {
    this.setState({ tamanoFiltro: event.target.value });
  };

  handleChangeTalleFiltro = (event) => {
    this.setState({ talleFiltro: event.target.value });
  };

  handleDropdownToggle = (isOpen) => {
    this.setState({ isDropdownOpen: isOpen });
  };

  handleInputChange = (event, maxCantidad, index) => {
    let inputValue = event.target.value;
    const cantidad = parseFloat(inputValue);

    if (cantidad > maxCantidad) {
      // Si se ingresa una cantidad mayor a la disponible, establece la cantidad máxima disponible
      inputValue = maxCantidad.toString(); // Convierte la cantidad máxima a cadena y establece el valor
    }

    const updatedInputValues = [...this.state.inputValues];
    updatedInputValues[index] = inputValue; // Actualiza el valor en el estado
    this.setState({ inputValues: updatedInputValues });
  };

  handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...this.state.checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    this.setState({ checkboxes: updatedCheckboxes });
  };

  render() {
    const {
      datosCargados,
      productos,
      filtro,
      colorFiltro,
      categoriaFiltro,
      tamanoFiltro,
      talleFiltro,
    } = this.state;

    const productosFiltrados = productos.filter((producto) => {
      const codigo = producto.codigo.toLowerCase();
      const colorid = producto.colorid.toLowerCase();

      // Agrega la condición de cantidad disponible > 0 aquí
      const cantidadDisponible = parseFloat(producto.cantidad);

      if (categoriaFiltro === "inferior") {
        return (
          producto.pinferiorid !== "NULL" &&
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro)) &&
          cantidadDisponible > 0 // Condición de cantidad disponible
        );
      } else if (categoriaFiltro === "superior") {
        return (
          producto.psuperiorid !== "NULL" &&
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro)) &&
          cantidadDisponible > 0 // Condición de cantidad disponible
        );
      } else if (categoriaFiltro === "accesorio") {
        return (
          producto.paccesorioid !== "NULL" &&
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro)) &&
          cantidadDisponible > 0 // Condición de cantidad disponible
        );
      } else {
        return (
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro)) &&
          cantidadDisponible > 0 // Condición de cantidad disponible
        );
      }
    });

    if (!datosCargados) {
      return <div>Cargando...</div>;
    } else {
      return (
        <Container>
          <NavAgregarAlCarrito />
          <div className="cardBotonesAgregarFiltrar">
            <div className="botones-container">
              <div className="card-header">
                <Dropdown
                  onToggle={this.handleDropdownToggle}
                  show={this.state.isDropdownOpen}
                  className="filtroListarProductos itemBotonesRegistrar"
                >
                  <Dropdown.Toggle className="toggleListarProducto">
                    Aplicar filtro
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdownMenuListarProducto">
                    <div className="row">
                      <div className="col">
                        <Dropdown.Item className="dditemListarProducto">
                          Filtrar por codigo:
                          <Form.Control
                            type="text"
                            value={filtro}
                            onChange={this.handleChangeFiltro}
                            placeholder="Codigo"
                            onClick={(e) => e.stopPropagation()}
                            className="form_controlListarProducto"
                          />
                        </Dropdown.Item>
                      </div>
                      <div className="col">
                        <Dropdown.Item className="dditemListarProducto">
                          Filtrar por color:
                          <Form.Control
                            as="select"
                            value={colorFiltro}
                            onChange={this.handleChangeColorFiltro}
                            onClick={(e) => e.stopPropagation()}
                            className="form_controlListarProducto"
                          >
                            <option value="">Elegir color</option>
                            <option value="rojo">Rojo</option>
                            <option value="verde">Verde</option>
                            <option value="azul">Azul</option>
                            <option value="amarillo">Amarillo</option>
                          </Form.Control>
                        </Dropdown.Item>
                      </div>
                      <div className="col">
                        <Dropdown.Item className="dditemListarProducto">
                          Filtrar por categoría:
                          <Form.Control
                            as="select"
                            value={categoriaFiltro}
                            onChange={this.handleChangeCategoriaFiltro}
                            onClick={(e) => e.stopPropagation()}
                            className="form_controlListarProducto"
                          >
                            <option value="">Elegir categoría</option>
                            <option value="superior">Superior</option>
                            <option value="inferior">Inferior</option>
                            <option value="accesorio">Accesorio</option>
                          </Form.Control>
                        </Dropdown.Item>
                      </div>
                      <div className="col">
                        <Dropdown.Item className="dditemListarProducto">
                          Filtrar por tamaño:
                          <Form.Control
                            as="select"
                            value={tamanoFiltro}
                            onChange={this.handleChangeTamanoFiltro}
                            onClick={(e) => e.stopPropagation()}
                            className="form_controlListarProducto"
                          >
                            <option value="">Elegir tamaño</option>
                            <option value="P">Pequeño</option>
                            <option value="M">Mediano</option>
                            <option value="G">Grande</option>
                          </Form.Control>
                        </Dropdown.Item>
                      </div>
                      <div className="col">
                        <Dropdown.Item className="dditemListarProducto">
                          Filtrar por talle:
                          <Form.Control
                            type="text"
                            value={talleFiltro}
                            onChange={this.handleChangeTalleFiltro}
                            placeholder="Talle"
                            onClick={(e) => e.stopPropagation()}
                            className="form_controlListarProducto"
                          />
                        </Dropdown.Item>
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="card-body contenidoListarProducto">
            <div className="scrollTablaConsultar">
              <table className="tabla" id="tabla">
                <thead className="tabla-header">
                  <tr>
                    <th className="ocultar_columna">ID</th>
                    <th>Codigo</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th className="ocultar_columna">Prenda Superior</th>
                    <th className="ocultar_columna">Prenda Inferior</th>
                    <th className="ocultar_columna">Accesorio</th>
                    <th>Color</th>
                    <th>Tamaño/Talle</th>
                    <th className="ocultar_columna">Tamaño</th>
                    <th className="ocultar_columna">Talle</th>
                    <th>Nombre</th>
                    <th>Descripcion</th>
                    <th>Precio Venta</th>
                    <th>Cantidad Disponible</th>
                    <th>Descuento</th>
                    <th>
                      Añadir al carrito
                      <FontAwesomeIcon
                        icon={faCartPlus}
                        style={{ color: "#fde2f3" }}
                      />
                    </th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody className="tabla-container">
                  {productosFiltrados.map((producto, index) => (
                    <tr key={producto.id}>
                      <td className="ocultar_columna">{producto.id}</td>
                      <td>{producto.codigo}</td>
                      {producto.psuperiorid !== "NULL" &&
                      producto.pinferiorid === "NULL" &&
                      producto.accesorioid === "NULL" ? (
                        <td>Superior</td>
                      ) : producto.psuperiorid === "NULL" &&
                        producto.pinferiorid !== "NULL" &&
                        producto.accesorioid === "NULL" ? (
                        <td>Inferior</td>
                      ) : producto.psuperiorid === "NULL" &&
                        producto.pinferiorid === "NULL" &&
                        producto.accesorioid !== "NULL" ? (
                        <td>Accesorio</td>
                      ) : (
                        <td></td>
                      )}
                      {producto.psuperiorid !== "NULL" &&
                      producto.pinferiorid === "NULL" &&
                      producto.accesorioid === "NULL" ? (
                        <td>{producto.psuperiorid}</td>
                      ) : producto.psuperiorid === "NULL" &&
                        producto.pinferiorid !== "NULL" &&
                        producto.accesorioid === "NULL" ? (
                        <td>{producto.pinferiorid}</td>
                      ) : producto.psuperiorid === "NULL" &&
                        producto.pinferiorid === "NULL" &&
                        producto.accesorioid !== "NULL" ? (
                        <td>{producto.accesorioid}</td>
                      ) : (
                        <td></td>
                      )}
                      <td className="ocultar_columna">
                        {producto.psuperiorid}
                      </td>
                      <td className="ocultar_columna">
                        {producto.pinferiorid}
                      </td>
                      <td className="ocultar_columna">
                        {producto.accesorioid}
                      </td>
                      <td>{producto.colorid}</td>
                      {producto.tamanoid !== "NULL" &&
                      producto.talleid === "NULL" ? (
                        <td>{producto.tamanoid}</td>
                      ) : producto.tamanoid === "NULL" &&
                        producto.talleid !== "NULL" ? (
                        <td>{producto.talleid}</td>
                      ) : (
                        <td></td>
                      )}
                      <td className="ocultar_columna">{producto.tamanoid}</td>
                      <td className="ocultar_columna">{producto.talleid}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion}</td>
                      <td>{producto.preciovta}</td>
                      <td>{producto.cantidad}</td>
                      <td>{producto.descuento}</td>
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id={`checkbox-${producto.id}`}
                            onChange={() => this.handleCheckboxChange(index)} // Pasa el índice como argumento
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          max={producto.cantidad}
                          value={
                            this.state.checkboxes[index]
                              ? this.state.inputValues[index]
                              : ""
                          }
                          onChange={(e) =>
                            this.handleInputChange(e, producto.cantidad, index)
                          } // Pasar el índice como tercer argumento
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <Link to="/menu_principal" className="btnBotones boton-vender">
              Confirmar venta
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ color: "#ffffff" }}
              />
            </Link>
          </div>
        </Container>
      );
    }
  }
}

export default RealizarVenta;
