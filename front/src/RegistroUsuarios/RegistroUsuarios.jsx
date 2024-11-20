import { useAuth } from "../Auth";
import { useState } from "react";

export const RegistroUsuarios = () => {
    const { sesion } = useAuth();
    const [registro, setRegistro] = useState({
        nombre:"",
        apellido:"",
        email:"",
        telefono:0,
        password:"",
        superusuario:0
    });
    console.log(registro)
     
    const onSubmit = (e)=>{
        e.preventDefault()
    }
  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input value={registro.nombre} onChange={(e)=>setRegistro({...registro, nombre: e.target.value})} name="nombre" type="text" required/>

        <label htmlFor="apellido">Apellido:</label>
        <input value={registro.apellido} onChange={(e)=>setRegistro({...registro, apellido: e.target.value})} name="apellido" type="text" required/>

        <label htmlFor="email">Email:</label>
        <input value={registro.email} onChange={(e)=>setRegistro({...registro, email: e.target.value})} name="email" type="text" required/>

        <label htmlFor="telefono">Telefono:</label>
        <input value={registro.telefono} onChange={(e)=>setRegistro({...registro, telefono: e.target.value})} name="telefono" type="number" min={0} required/>

        <label htmlFor="password">Contraseña:</label>
        <input value={registro.password} onChange={(e)=>setRegistro({...registro, password: e.target.value})} name="password" type="password" required/>

        <label htmlFor="superusuario">Superusuario:</label>
        <input value={registro.password} onChange={(e)=> setRegistro({...registro, superusuario: e.target.checked ? 1 : 0})} name="superusuario" type="checkbox" required/>

        <button type="submit">Registrar usuario</button>
      </form>
      
    </>
  );
};
