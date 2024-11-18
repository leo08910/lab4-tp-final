import { AuthRol } from "./Auth";
import { ListadoUsuarios } from "./Usuarios";

export const UsuariosPage = () => {
  return (
    <>
      <h2>Usuarios</h2>
      <AuthRol superusuario={0}>
        <p>No tiene permitido ver este listado</p>
      </AuthRol>
      <AuthRol superusuario={1}>
        <ListadoUsuarios />
      </AuthRol>
    </>
  );
};
