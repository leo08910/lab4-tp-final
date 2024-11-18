import { useState } from "react";
import { useEffect } from "react";
import { useAuth, AuthRol } from "../Auth"; 
import "./lugares.css";

function Lugares() {
    const { sesion } = useAuth();
    const [lugares, setLugares] = useState([]);

    useEffect(() =>{
        getLugares()
    },[]) ;

    const getLugares = async () =>{
        const response = await fetch ("http://localhost:3000/lugares")
       try{
            const ApiLugares = await response.json()
            console.log('Los datos de la Api son' , ApiLugares)
            setLugares(ApiLugares)

       }catch(error){
            console.log('Error al cargar los lugares de la Api' ,error)
       }
    }

    const formulario = async (id_lugar) => {
        const id_vehiculo = 6; // ID de prueba
        try {
            const response = await fetch(`http://localhost:3000/lugares/${id_lugar}/ocupar`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sesion.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_vehiculo }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al ocupar el lugar:", errorData);
                return;
            }else{
                getLugares()
            }
    
            const data = await response.json();
            console.log("Lugar ocupado exitosamente:", data);
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <>  
            <h1 className="titulo_estacionamiento">Estacionamiento</h1>
            <div className="estacionamiento">
                {lugares.map((lugar) => (
                    <button
                        disabled = {lugar.ocupado}
                        key={lugar.id_lugar}
                        className={`lugar ${lugar.ocupado ? "ocupado" : "libre"}`}
                        onClick={() => formulario(lugar.id_lugar)}
                    >
                        {lugar.ocupado ? "ocupado" : "libre"}
                    </button>
                ))}
            </div>
        </>
    );
}

export default Lugares;
