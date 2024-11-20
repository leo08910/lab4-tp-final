import { useAuth } from "../Auth";
import { useState } from "react";

const RegistroUsuarios = () => {
    const { sesion } = useAuth();
    const [registro, setRegistro] = useState({
        nombre:"",
        apellido:"",
        email:"",
        telefono:"",
        password:"",
        superusuario:0
    });
    const [mensaje, setMensaje] = useState("")
    
     
    const onSubmit = async (e)=>{
        e.preventDefault()
        
        try {
            const response = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sesion.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registro),
            });
    
            if (response.ok) {
                setMensaje("Usuario registrado"); 
                setRegistro({ 
                    nombre: "",
                    apellido: "",
                    email: "",
                    telefono: 0,
                    password: "",
                    superusuario: 0,
                });
            } else {
                const errorData = await response.json();
                setMensaje(`Error: ${errorData.message || "No se pudo registrar el usuario"}`);
            }
        } catch (error) {
            console.error(error);
            setMensaje("Error de red. Intenta nuevamente.");
        }
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
        <input value={registro.password} checked={registro.superusuario === 1} onChange={(e)=> setRegistro({...registro, superusuario: e.target.checked ? parseInt(1) : parseInt(0)})} name="superusuario" type="checkbox" />

        <button type="submit">Registrar usuario</button>
      </form>
      <p>{mensaje}</p>
      
    </>
  );
};

export default RegistroUsuarios