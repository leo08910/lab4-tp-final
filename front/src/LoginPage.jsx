import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import { useState } from "react";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    const nombre = formData.get("nombre");
    const password = formData.get("password");

    login(
      nombre,
      password,
      () => navigate(from, { replace: true }), // OK
      () => setError(true) // Error
    );

    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="nombre">Usuario:</label>
        <input name="nombre" type="text" required/>
        <label htmlFor="password">Contraseña:</label>
        <input name="password" type="password" required/>
        <button type="submit">Ingresar</button>
      </form>
      {error && <p>Usuario o contraseña inválido</p>}
    </>
  );
};
