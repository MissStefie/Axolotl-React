import React from "react";
import Api from "../services/api";
import NavAgregarAlCarrito from "./NavAgregarAlCarrito";
import { Dropdown, Form } from "react-bootstrap";
import { Container } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "../css/productosVenta.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Agrega ToastContainer aquí
import "react-toastify/dist/ReactToastify.css";

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
      inputValues: {},
      filasSeleccionadas: [],
      mostrarAlerta: false,
      mostrarAlertaCantidad: false,
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

    // Crear y almacenar las referencias a los inputs
    const refs = {};
    const inputValues = {}; // Cambia esto a un objeto vacío

    this.state.productos.forEach((producto) => {
      refs[producto.id] = React.createRef();
      inputValues[producto.id] = ""; // Establece el valor inicial en blanco
    });

    this.setState({ refs, inputValues }); // Establece los valores iniciales en el estado
  }

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

  handleInputChange = (event, maxCantidad, productId) => {
    // Agrega productId como argumento
    let inputValue = event.target.value;
    const cantidad = parseFloat(inputValue);

    if (cantidad > maxCantidad) {
      inputValue = maxCantidad.toString();
    }

    this.setState((prevState) => {
      const updatedInputValues = { ...prevState.inputValues }; // Copia el objeto inputValues
      updatedInputValues[productId] = inputValue; // Asigna el valor al ID del producto

      const updatedFilasSeleccionadas = [...prevState.filasSeleccionadas];
      const producto = updatedFilasSeleccionadas.find(
        (seleccionado) => seleccionado.id === productId
      );

      if (producto) {
        producto.cantidad = parseFloat(inputValue);
      }

      return {
        inputValues: updatedInputValues,
        filasSeleccionadas: updatedFilasSeleccionadas,
      };
    });
  };

  handleCantidadInputChange = (event, index) => {
    const inputValue = event.target.value;
    const { maxValores } = this.state;

    if (inputValue <= maxValores[index]) {
      const updatedInputValues = [...this.state.inputValues];
      updatedInputValues[index] = inputValue;

      this.setState({ inputValues: updatedInputValues });
    }
  };

  clearInputValue = (index) => {
    this.setState((prevState) => {
      const updatedInputValues = [...prevState.inputValues];
      updatedInputValues[index] = ""; // Establece el valor del input en blanco
      return { inputValues: updatedInputValues };
    });
  };

  handleCheckboxChange = (producto) => {
    const productId = producto.id;

    this.setState((prevState) => {
      const updatedCheckboxes = { ...prevState.checkboxes };
      updatedCheckboxes[productId] = !updatedCheckboxes[productId];

      const updatedFilasSeleccionadas = [...prevState.filasSeleccionadas];

      if (updatedCheckboxes[productId]) {
        // Si la casilla se ha marcado, agrega el producto a filasSeleccionadas si no existe
        const existingIndex = updatedFilasSeleccionadas.findIndex(
          (item) => item.id === productId
        );

        if (existingIndex === -1) {
          updatedFilasSeleccionadas.push({
            ...producto,
            cantidad: parseFloat(prevState.inputValues[productId] || 0),
          });
        }
      } else {
        // Si la casilla se ha desmarcado, quita el producto de filasSeleccionadas si existe
        const existingIndex = updatedFilasSeleccionadas.findIndex(
          (item) => item.id === productId
        );

        if (existingIndex !== -1) {
          updatedFilasSeleccionadas.splice(existingIndex, 1);
        }
      }

      return {
        checkboxes: updatedCheckboxes,
        filasSeleccionadas: updatedFilasSeleccionadas,
      };
    });
  };

  handleConfirmarVenta = () => {
    const { filasSeleccionadas } = this.state;
    const filasSeleccionadasStr = filasSeleccionadas.join(",");

    const cantidadVacia = filasSeleccionadas.some(
      (producto) => !producto.cantidad 
    );

    if (filasSeleccionadas.length === 0) {
      // Mostrar una alerta emergente utilizando react-toastify
      toast.error("Seleccione los productos a vender", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    } else if (cantidadVacia) {
      // Mostrar la alerta de cantidad vacía
      toast.error(
        "Ingrese la cantidad para los productos seleccionados",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        }
      );
    } else {
      // Redirigir a la página de confirmación de venta
      this.props.history.push({
        pathname: `/confirmar_venta/${filasSeleccionadasStr}`,
        state: { filasSeleccionadas: this.state.filasSeleccionadas },
      });
    }
  };

  mostrarAlertaCantidad = () => {
    this.setState({ mostrarAlertaCantidad: true });

    setTimeout(() => {
      this.setState({ mostrarAlertaCantidad: false });
    }, 2000); // Oculta la alerta después de 2 segundos
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

    const { mostrarAlerta, mostrarAlertaCantidad } = this.state; // Mover la declaración aquí

    if (mostrarAlerta) {
      // Mostrar la alerta emergente de selección de productos
      return (
        <div className="alert alert-danger">
          Seleccione los productos a vender.
        </div>
      );
    }

    if (mostrarAlertaCantidad) {
      // Mostrar la alerta emergente de cantidad inválida
      return (
        <div className="alert alert-danger">
          Ingrese una cantidad válida para los productos seleccionados.
        </div>
      );
    }

    console.log("filasSeleccionadas:", this.state.filasSeleccionadas);

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

    const { filasSeleccionadas } = this.state;
    const filasSeleccionadasStr = filasSeleccionadas.join(",");

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
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id={`checkbox-${producto.id}`}
                          onChange={() => {
                            this.handleCheckboxChange(producto); // Llama a handleCheckboxChange cuando se cambia el checkbox
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          max={producto.cantidad}
                          value={this.state.inputValues[producto.id] || ""} // Usar el ID del producto
                          onChange={
                            (e) =>
                              this.handleInputChange(
                                e,
                                producto.cantidad,
                                producto.id
                              ) // Pasa el ID del producto
                          }
                          disabled={!this.state.checkboxes[producto.id]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <button
              className="btnBotones boton-vender"
              onClick={this.handleConfirmarVenta}
            >
              Confirmar venta
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ color: "#ffffff" }}
              />
            </button>
          </div>

          {/* Agrega el contenedor para las alertas emergentes */}
          <div className="toast-container">
            <ToastContainer />
          </div>
        </Container>
      );
    }
  }
}

export default RealizarVenta;
