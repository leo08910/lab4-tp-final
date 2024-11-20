import { Route, Routes } from "react-router-dom";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { PerfilPage } from "./PerfilPage";
import { LoginPage } from "./LoginPage";
import { SinRuta } from "./SinRuta";
import { UsuariosPage } from "./UsuariosPage";
import { AuthPage } from "./Auth";
import Tarifas from "../src/Tarifas/Tarifas";
import Registros from "../src/Registros/Registros";
import Lugares from "../src/Lugares/Lugares"
import AgregarVehiculos from "./components/Vehiculos/AgregarVehiculos"
import RegistroUsuarios  from "../src/RegistroUsuarios/RegistroUsuarios";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AuthPage>
                <HomePage />
              </AuthPage>
            }
          />
          <Route
            path="/usuarios"
            element={
              <AuthPage>
                <UsuariosPage />
              </AuthPage>
            }
          />
          <Route
            path="/perfil"
            element={
              <AuthPage>
                <PerfilPage />
              </AuthPage>
            }
          />
          <Route
            path="/tarifas"
            element={
              <AuthPage>
                <Tarifas />
              </AuthPage>
            }
          />
          <Route
            path="/registros"
            element={
              <AuthPage>
                <Registros/>
              </AuthPage>
            }
          />
          <Route 
            path="/lugares"
            element={
              <AuthPage>
                <Lugares />
              </AuthPage>
            }
          />
          <Route 
            path="/registro"
            element={
              <AuthPage>
                <RegistroUsuarios />
              </AuthPage>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<SinRuta />} />
        </Route>
        <Route
            path="/agregarVehiculos"
            element={
              <AuthPage>
                <AgregarVehiculos/>
              </AuthPage>
            }
          />
    
      </Routes>
    </>
  );

}

export default App;
