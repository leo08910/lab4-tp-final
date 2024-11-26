import { useState } from "react";
import './AgregarVehiculos.css'

export default function AgregarVehiculos() {
    const [matricula,setMatricula]=useState("")
    const [id_cliente,setId_cliente]=useState("")
    const [id_tipo_vehiculo,setId_tipo_vehiculo]=useState(1)
    const [clienteExiste,setClienteExiste]=useState(true)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log({ matricula, id_cliente, id_tipo_vehiculo });

        const clienteResponse = await fetch(`http://localhost:3000/clientes/${id_cliente}`)
        if (!clienteResponse.ok){
            setClienteExiste(false)
            console.log('en cliente no existe')
            return 
        }
        
        setClienteExiste(true)
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

                <div className="divVehiculos">
                <label className="Textos">Matricula del vehiculo</label>
                <input type="text" onChange={(e)=>setMatricula(e.target.value)} />
                </div>
                
               
                <div className="divVehiculos">
                <label className="Textos">Id del cliente</label>
                <input type="number" onChange={(e)=>setId_cliente(parseInt(e.target.value))}/>
                </div>
                
                
                <div className="divVehiculos">
                <label className="Textos">Tipo de vehiculo</label>
                <select onChange={(e)=>setId_tipo_vehiculo(Number(e.target.value))} value={id_tipo_vehiculo}>
                    <option value="1">Auto</option>
                    <option value="2">Moto</option>
                    <option value="3">Camioneta</option>
                </select>
                </div>
                

                <div className="divVehiculos">
                <button type="submit" disabled={id_cliente<0 || matricula==''}>Registrar auto</button>
                {!clienteExiste && <p>Este cliente no existe</p>}
                </div>
                
                
            </div>

        </form>
        </>
    )

} 