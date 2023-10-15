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
import React, { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(user); // Aquí user tendrá el valor actualizado
  }, [user]);

  const setLoggedInUser = (userData) => {
    console.log(userData); //devuelven lo mismo
    setUser(userData);
    console.log(user); //devuelven lo mismo
  };

  //const setLoggedOutUser = () => setUser(null);

  return (
    <Router>
      <Route
        exact
        path="/"
        render={(props) => (
          <Login {...props} setLoggedInUser={setLoggedInUser} />
        )}
      ></Route>

      <Route
        exact
        path="/menu_principal"
        render={(props) => <MenuPrincipal {...props} user={user} />}
      ></Route>

      <Route
        exact
        path="/consultar"
        render={(props) => <ListarProducto {...props} user={user} />}
      ></Route>

      <Route
        exact
        path="/crear"
        render={(props) => <CrearProducto {...props} user={user} />}
      ></Route>

      <Route
        exact
        path="/editar/:id"
        render={(props) => <EditarProducto {...props} user={user} />}
      ></Route>

      <Route
        exact
        path="/registrar_cliente"
        render={(props) => (
          <RegistrarCliente
            {...props}
            user={user}
            datosEnviar={props.location.state}
          />
        )}
      ></Route>

      <Route
        exact
        path="/modificar_cliente"
        render={(props) => <ModificarCliente {...props} user={user} />}
      ></Route>

      <Route
        exact
        path="/realizar_venta"
        render={(props) => <RealizarVenta {...props} user={user} />}
      ></Route>

      <Route
        exact
        path="/confirmar_venta/:filasSeleccionadas"
        render={(props) => <ConfirmarVenta {...props} user={user} />}
      ></Route>

    </Router>
  );
}

export default App;
