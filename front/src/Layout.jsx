import { Link, Outlet } from "react-router-dom";
// import { AuthStatus } from "./Auth";
import "./Layout.css";

export const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/perfil" className="nav-button">
            <img src="./assets/perfil.svg" alt="Perfil" />
            </Link>
          </li>
          <li>
            <Link to="/lugares" className="nav-button">
            <img src="./assets/estacionamiento.svg" alt="Estacionamiento" />
            </Link>
          </li>
          <li>
            <Link to="/tarifas" className="nav-button">
            <img src="./assets/tarifas.svg" alt="Tarifas" />
            </Link>
          </li>
          <li>
            <Link to="/registros" className="nav-button">
            <img src="./assets/registro.svg" alt="Registro" />
            </Link>
          </li>
          <li>
            <Link to="/registro" className="nav-button">
            <p>Registrar usuario</p>
        <li>
          <Link to='/AgregarVehiculos' className="nav-button">
            <img src="./assets/auto.svg" alt="AgregarVehiculos" />
          </Link>
        </li>
          <li>
            <Link to="/usuarios" className="nav-button">
            <img src="./assets/usuarios.svg" alt="Usuarios" />
            </Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        {/* <AuthStatus /> */}
        <Outlet />
      </div>
    </>
  );
};
