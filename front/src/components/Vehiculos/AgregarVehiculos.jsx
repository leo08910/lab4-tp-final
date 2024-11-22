import { useState } from "react";
import './AgregarVehiculos.css'

export default function AgregarVehiculos() {
    const [matricula,setMatricula]=useState("")
    const [id_cliente,setId_cliente]=useState("")
    const [id_tipo_vehiculo,setId_tipo_vehiculo]=useState("")

    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log({ matricula, id_cliente, id_tipo_vehiculo });
        const response = await fetch('http://localhost:3000/vehiculos',{
            method:'POST',
            body: JSON.stringify({matricula,id_cliente,id_tipo_vehiculo}),
            headers: {'Content-Type':'application/json'}})
        if (response.ok){
            console.log(response.json())
        }
    }
    return (
        <>

        <form onSubmit={handleSubmit}>
            <div className="contenedorVehiculos" >

                <label className="Textos">Matricula del vehiculo</label>
                <input type="text" onChange={(e)=>setMatricula(e.target.value)} />
               
                <label className="Textos">Id del cliente</label>
                <input type="number" onChange={(e)=>setId_cliente(parseInt(e.target.value))}/>
                
                <label className="Textos">Tipo de vehiculo</label>
                <select onChange={(e)=>setId_tipo_vehiculo(Number(e.target.value))} value={id_tipo_vehiculo}>
                    <option value="1">Auto</option>
                    <option value="2">Moto</option>
                    <option value="3">Camioneta</option>
                </select>

                <button type="submit">Registrar auto</button>

                
            </div>

        </form>
        </>
    )

} 