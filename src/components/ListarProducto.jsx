import React from "react";
import { Api } from "../services/api";
import NavListar from "./NavListar";
import { Link } from "react-router-dom";
import { Dropdown, Form } from "react-bootstrap";
import { Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "../css/tablaProductos.css";
import "bootstrap/dist/css/bootstrap.css";
import swal from "sweetalert2";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default class ListarProducto extends React.Component {
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
    };
  }

  borrarRegistros = (id) => {
    fetch(Api + "?borrar=" + id)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        //console.log(datosRespuesta);
        this.cargarDatos();
      })
      .catch(console.log);
  };

  cargarDatos() {
    fetch(Api)
      .then((respuesta) => respuesta.json())
      .then((datosRespuesta) => {
        //console.log(datosRespuesta);
        this.setState({ datosCargados: true, productos: datosRespuesta });
      })
      .catch(console.log);
  }

  componentDidMount() {
    this.cargarDatos();
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

  render() {
    const { user } = this.props;
    //console.log(user);
    if (!user) {
      return <Redirect to="/" />;
    }
    const {
      datosCargados,
      productos,
      filtro,
      colorFiltro,
      categoriaFiltro,
      tamanoFiltro,
      talleFiltro,
    } = this.state;

    const tieneAcceso = user.rol === "1";

    const productosFiltrados = productos.filter((producto) => {
      const codigo = producto.codigo.toLowerCase();
      const colorid = producto.colorid.toLowerCase();

      if (categoriaFiltro === "inferior") {
        return (
          producto.pinferiorid !== "NULL" &&
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro))
        );
      } else if (categoriaFiltro === "superior") {
        return (
          producto.psuperiorid !== "NULL" &&
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro))
        );
      } else if (categoriaFiltro === "accesorio") {
        return (
          producto.paccesorioid !== "NULL" &&
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro))
        );
      } else {
        return (
          codigo.includes(filtro.toLowerCase()) &&
          (colorFiltro === "" || colorid.includes(colorFiltro.toLowerCase())) &&
          (talleFiltro === "" ||
            producto.talleid.includes(talleFiltro.toLowerCase())) &&
          (tamanoFiltro === "" || producto.tamanoid.includes(tamanoFiltro))
        );
      }
    });

    if (!datosCargados) {
      return <div>Cargando...</div>;
    } else {
      return (
        <Container>
          <NavListar />
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
                    <th>Precio Compra</th>
                    <th>Precio Venta</th>
                    <th>Cantidad Disponible</th>
                    <th>Descuento</th>
                    <th>Precio con Descuento</th>
                    {tieneAcceso && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody className="tabla-container">
                  {productosFiltrados.map((producto) => (
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
                      <td>{producto.preciocpa}</td>
                      <td>{producto.preciovta}</td>
                      <td>{producto.cantidad}</td>
                      <td>{producto.descuento}</td>
                      <td>{producto.preciodct}</td>
                      {tieneAcceso && (
                        <th>
                          <div className="btn-group" role="group" aria-label="">
                            <Link
                              to={"/editar/" + producto.id}
                              className="btn boton-editar"
                            >
                              Editar{" "}
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                style={{ color: "#E5BEEC" }}
                                className="editarListarProducto"
                              />
                            </Link>
                            <button
                              type="button"
                              className="btn boton-borrar"
                              onClick={() => this.mostrarAlerta(producto.id)}
                            >
                              Borrar{" "}
                              <FontAwesomeIcon
                                icon={faEraser}
                                style={{ color: "#E5BEEC" }}
                                className="borrarListarProducto"
                              />
                            </button>
                          </div>
                        </th>
                      )}
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

ListarProducto.propTypes = {
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
