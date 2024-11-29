import { useState, useEffect } from "react";
import { useAuth, AuthRol } from "../Auth"; //traigo AuthRol para verificar si es superusuario
import "./Tarifas.css";
import getTarifas from "./GetTarifas";
import { validacionesTarifa } from "./GetTarifas";


function Tarifas() {
  const { sesion } = useAuth();
  const [tarifas, setTarifas] = useState([]);
  const [nuevaTarifa, setNuevaTarifa] = useState({
    tipo_tarifa: "",
    precio: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [tarifaIdToEdit, setTarifaIdToEdit] = useState(null);

  useEffect(() => {
    getTarifas(sesion,setTarifas);
  }, []);


  const postTarifa = async () => {
    const confirmacion = window.confirm("¿Seguro que deseas agregar tarifa?");
    if (!confirmacion) return;
    const tarifaExistente = tarifas.find(
      (tarifa) => tarifa.tipo_tarifa === nuevaTarifa.tipo_tarifa
    );
      if (tarifaExistente) {
        alert("El tipo de tarifa ya existe. Por favor, elige otro.");
        return;
      }
    validacionesTarifa(nuevaTarifa,tarifas)
    const response = await fetch("http://localhost:3000/tarifas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sesion.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTarifa),
    });
    if (response.ok) {
      getTarifas(sesion,setTarifas);
      setNuevaTarifa({ tipo_tarifa: "", precio: "" });
    } else {
      const error = await response.json();
      console.error("Error al agregar tarifa:", error);
    }
  };

  const putTarifa = async () => {
    const confirmacion = window.confirm("¿Seguro que deseas guardar los cambios?");
    if (!confirmacion) return;
    validacionesTarifa(nuevaTarifa,tarifas)
    const response = await fetch(`http://localhost:3000/tarifas/${tarifaIdToEdit}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sesion.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTarifa),
    });
    if (response.ok) {
      getTarifas(sesion,setTarifas);
      setNuevaTarifa({ tipo_tarifa: "", precio: "" });
      setEditMode(false);
      setTarifaIdToEdit(null);
    } else {
      const error = await response.json();
      console.error("Error al modificar tarifa:", error);
    }
  };

  const deleteTarifa = async (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta tarifa?");
    if (!confirmacion) return;

    const response = await fetch(`http://localhost:3000/tarifas/${Number(id)}`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${sesion.token}`,},
    });
    if (response.ok) {
      getTarifas(sesion,setTarifas);
    } else {
      const error = await response.json();
      console.error("Error al eliminar tarifa:", error);
    }
  };

  const handleEdit = (tarifa) => {
    setEditMode(true);
    setTarifaIdToEdit(tarifa.id_tarifa);
    setNuevaTarifa({
      tipo_tarifa: tarifa.tipo_tarifa,
      precio: tarifa.precio,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTarifaIdToEdit(null);
    setNuevaTarifa({ tipo_tarifa: "", id_tipo_vehiculo: "", precio: "" });
  };

  return (
      <div className="tarifas-container">
        <h2 className="tarifas_titulo">Tarifas</h2>

        
            <table  className="tarifas_table">
            <thead>
              <tr >
                <th className="tarifas_th">Tipo de tarifa</th>
                <th className="tarifas_th">Precio</th>
               <AuthRol superusuario={1}><th className="tarifas_th">Acciones</th></AuthRol>
              </tr>
            </thead>
            {tarifas.map((tarifa) => (
  <tbody key={tarifa.id_tarifa}>
    <tr>
      <td className="tarifas_td">{tarifa.tipo_tarifa}</td>
      <td className="tarifas_td">${tarifa.precio}</td>
      <AuthRol superusuario={1}>
        <td className="tarifas_td tarifas_td_edit">
          <button
            className="tarifas_button_edit"
            onClick={() => handleEdit(tarifa)}
          >
            <img style={{ width: "2vw" }} src="/assets/edit.svg" alt="" />
          </button>
          <button
            className="tarifas_button_delete"
            onClick={() => deleteTarifa(tarifa.id_tarifa)}
          >
            <img style={{ width: "2vw" }} src="/assets/delete.svg" alt="" />
          </button>
        </td>
      </AuthRol>
    </tr>
  </tbody>
))}

          </table>
      <AuthRol superusuario={1} > 
        {/* Formulario para agregar o editar tarifas */}
        <div className="superusuario">
          <h2>{editMode ? "Modificar Tarifa" : "Agregar Tarifa"}</h2>
          <select
            className="tarifa_select"
            value={nuevaTarifa.tipo_tarifa}
            onChange={(e) =>
              setNuevaTarifa({ ...nuevaTarifa, tipo_tarifa: e.target.value })
            }
          >
            <option className="tarifa_option" value="">Selecciona el tipo de tarifa</option>
                <option value="Tiempo indefinido">Tiempo indefinido</option>
                <option value="Auto p/minuto">Auto p/minuto</option>
                <option value="Auto p/turno">Auto p/turno</option>
                <option value="Auto p/hora">Auto p/hora</option>
                <option value="Auto p/día">Auto p/día</option>
                <option value="Auto p/semana">Auto p/semana</option>
                <option value="Auto p/mes">Auto p/mes</option>
                <option value="Moto p/turno">Moto p/turno</option>
                <option value="Moto p/hora">Moto p/hora</option>
                <option value="Moto p/día">Moto p/día</option>
                <option value="Moto p/semana">Moto p/semana</option>
                <option value="Moto p/mes">Moto p/mes</option>
                  
          </select>
          <input 
            className="tarifas_input"
            type="number"
            placeholder="Precio"
            value={nuevaTarifa.precio}
            onChange={(e) =>
              setNuevaTarifa({ ...nuevaTarifa, precio: e.target.value })
            }
          />
          <button className="tarifas_button_ok" onClick={editMode ? putTarifa : postTarifa}>

            {editMode ? <> <img style={{width:"2vw"}} src="/assets/ok.svg" alt="" /><span>Aceptar Cambios</span></> :
            <><span>Agregar Nueva</span><img style={{width:"2vw"}} src="/assets/add.svg" alt="" /></> }

          </button>
          {editMode && <button className="tarifas_button_cancel" onClick={handleCancelEdit}>{<><span>Cancelar</span><img style={{width:"2vw"}} src="/assets/cancel.svg" alt="" /></>}</button>}
        </div>
      </AuthRol>
    </div>
  );
}

export default Tarifas;
