import "./App.css";
import ListarProducto from "./components/ListarProducto";
import EditarProducto from "./components/EditarProducto";
import Login from "./components/Login";
import MenuPrincipal from "./components/MenuPrincipal";
import CrearProducto from './components/CrearProducto';
import RegistrarCliente from './components/RegistrarCliente';
import ModificarCliente from './components/ModificarCliente';
import RealizarVenta from './components/RealizarVenta';
import ConfirmarVenta from './components/ConfirmarVenta';

import { Route, BrowserRouter as Router, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav className="">
        <div className="">
          <Link className="nav-item nav-link active" to={"/"}></Link>
        </div>
      </nav>
      <div className="container">
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/menu_principal" component={MenuPrincipal}></Route>
        <Route exact path="/consultar" component={ListarProducto}></Route>
        <Route path="/crear" component={CrearProducto}></Route>
        <Route path="/editar/:id" component={EditarProducto}></Route>
        <Route path="/registrar_cliente" component={RegistrarCliente}></Route>
        <Route path="/modificar_cliente" component={ModificarCliente}></Route>
        <Route path="/realizar_venta" component={RealizarVenta}></Route>
        <Route path="/confirmar_venta/:filasSeleccionadas" component={ConfirmarVenta}></Route>
      </div>
    </Router>
  );
}

export default App;
