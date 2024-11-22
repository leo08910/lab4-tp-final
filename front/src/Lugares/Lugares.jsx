import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../Auth"; 
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

    const formularioOcupar = async (id_lugar) => {
        const id_vehiculo = 5; // ID de prueba
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
                return console.error("Error al ocupar el lugar:", errorData);
            }
            
            getLugares()
    
            const data = await response.json();
            console.log("Lugar ocupado exitosamente:", data);
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
        return (
            <>
                <h3>Ingreso de vehiculo</h3>
            </>
        );
    };

    const formularioLiberar = async (id_lugar) => {
        const id_vehiculo = 5; // ID de prueba
        try{
            const response = await fetch(`http://localhost:3000/lugares/${id_lugar}/desocupar`,{
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sesion.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_vehiculo }),
            })
            
            if(!response.ok){
                const errorData = await response.json()
                return console.error('Error al ocupar el lugar:', errorData )
            }

            getLugares()

            const data = await response.json()
            console.log("lugar liberado existosamente:",data)
        }catch (error){
            console.error("Error en la solicitud", error)
        }
    }

    return (
        <>
            <h1>Estacionamiento</h1>
            <div className="estacionamiento">
                {lugares.map((lugar) => (
                    <button
                        key={lugar.id_lugar}
                        className={`lugar ${lugar.ocupado ? "ocupado" : "libre"}`}
                        onClick={() => lugar.ocupado ? formularioLiberar(lugar.id_lugar) : formularioOcupar(lugar.id_lugar)}
                    >
                        {lugar.ocupado ? "ocupado" : "libre"}
                    </button>
                ))}
            </div>
        </>
    );
}

export default Lugares;
