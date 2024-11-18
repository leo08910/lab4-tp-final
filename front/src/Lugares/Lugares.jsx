import { useState } from "react";
import { useEffect } from "react";
import "./lugares.css";

function Lugares() {
    const [lugares, setLugares] = useState([]);

    useEffect(() =>{
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
    getLugares()
    },[lugares])

    return (
        <>  
            <h1 className="titulo_estacionamiento">Estacionamiento</h1>
            <div className="estacionamiento">
                {lugares.map((lugar) => (
                    <button
                        disabled = {lugar.ocupado}
                        key={lugar.id_lugar}
                        className={`lugar ${lugar.ocupado ? "ocupado" : "libre"}`}
                        
                    >
                        {lugar.ocupado ? "ocupado" : "libre"}
                    </button>
                ))}
            </div>
        </>
    );
}

export default Lugares;
