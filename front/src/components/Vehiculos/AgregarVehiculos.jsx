import { useEffect, useState } from "react";
import './AgregarVehiculos.css'

export default function ListadoVehiculos() {
    const [lista,setLista]=useState([])

    return (
        <>
        <div className="contenedorVehiculos" >
        <table border="1" style={{width:"100%",textAlign:"left"}}>
            <thead>
                <th>ID Vehiculo</th>
                <th>Matricula</th>
                <th>Tipo de vehiculo</th>
            </thead>
            <tbody>

            </tbody>
        </table>        
        </div>
        </>
    )

} 