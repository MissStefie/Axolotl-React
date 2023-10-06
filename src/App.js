import "./App.css";
import ListarProducto from "./components/ListarProducto";
import EditarProducto from "./components/EditarProducto";
import Login from "./components/Login";
import MenuPrincipal from "./components/MenuPrincipal";
import CrearProducto from "./components/CrearProducto";
import RegistrarCliente from "./components/RegistrarCliente";
import ModificarCliente from "./components/ModificarCliente";
import RealizarVenta from "./components/RealizarVenta";
import ConfirmarVenta from "./components/ConfirmarVenta";
import { Route, BrowserRouter as Router } from "react-router-dom";
import React, { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  const setLoggedInUser = (userData) => {
    console.log(userData); //devuelven lo mismo
    setUser(userData);
    console.log(user); //devuelven lo mismo
  };

  const setLoggedOutUser = () => setUser(null);

  return (
    <Router>
      {user ? (
        <Route exact path="/menu_principal" component={MenuPrincipal}></Route>
      ) : (
        <Route
          exact
          path="/"
          render={(props) => (
            <Login {...props} setLoggedInUser={setLoggedInUser} />
          )}
        ></Route>
      )}
      <Route exact path="/consultar" component={ListarProducto}></Route>
      <Route path="/crear" component={CrearProducto}></Route>
      <Route path="/editar/:id" component={EditarProducto}></Route>
      <Route path="/registrar_cliente" component={RegistrarCliente}></Route>
      <Route path="/modificar_cliente" component={ModificarCliente}></Route>
      <Route path="/realizar_venta" component={RealizarVenta}></Route>
      <Route
        path="/confirmar_venta/:filasSeleccionadas"
        component={ConfirmarVenta}
      ></Route>
    </Router>
  );
}

export default App;
