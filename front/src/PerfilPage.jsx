import { AuthRol, useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const PerfilPage = () => {
  const { sesion, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => navigate("/")); // Al cerrar sesión, redirige a la página principal
  };
  return (
    <>
    <div>
      <h1>Perfil de Usuario</h1>
      <p>Nombre: {sesion?.nombre}</p>
      <button onClick={handleLogout}>Salir</button>
      <AuthRol superusuario={1}>
        <p>Soy admin!</p>
      </AuthRol>
      <AuthRol superusuario={0} >
        <p>Soy usuario!</p>
      </AuthRol>
    </div>
    </>
  );
};
