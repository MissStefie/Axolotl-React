import "./App.css";
import ListarProducto from "./components/ListarProducto";
import CargarStock1 from "./components/CargarStock1";
import CargarStockTam from './components/CargarStockTam'
import EditarProducto from "./components/EditarProducto";
import Login from "./components/Login";
import MenuPrincipal from "./components/MenuPrincipal";

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
        {/*aca antes era solo / pero se cambio temporalmente*/}
        <Route path="/crear" component={CargarStock1}></Route>
        <Route path="/cargar_stock_tam" component={CargarStockTam}></Route>
        <Route path="/editar/:id" component={EditarProducto}></Route>
      </div>
    </Router>
  );
}

export default App;
