import { useState, useEffect } from "react";
import { useAuth, AuthRol } from "../Auth"; //traigo AuthRol para verificar si es superusuario
import "./Tarifas.css";
import getTarifas from "./GetTarifas";


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
  // Verificar si el tipo de tarifa ya existe
  const tarifaExistente = tarifas.find(
    (tarifa) => tarifa.tipo_tarifa === nuevaTarifa.tipo_tarifa
  );
  if (tarifaExistente) {
    alert("El tipo de tarifa ya existe. Por favor, elige otro.");
    return;
  }

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

    const response = await fetch(`http://localhost:3000/tarifas/${id}`, {
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
        <h1 className="titulo">Tarifas</h1>

        
            <table >
            <thead>
              <tr >
                <th>tipo de tarifa</th>
                <th>precio</th>
                <th>acciones</th>
              </tr>
            </thead>
            {tarifas.map((tarifa) => (
            <tbody className="tarifas_table" key={tarifa.id_tarifa}>
              <tr>
                <td>{tarifa.tipo_tarifa}</td>
                <td>${tarifa.precio}</td>
                <td><AuthRol superusuario={1}>
              <button onClick={() => handleEdit(tarifa)}>Modificar</button>
              <button onClick={() => deleteTarifa(tarifa.id_tarifa)}>Eliminar</button>
            </AuthRol></td>
              </tr>
            </tbody>))}
          </table>
         <br />
      <AuthRol superusuario={1} > 
        {/* Formulario para agregar o editar tarifas */}
        <div className="superusuario">
          <h2>{editMode ? "Modificar Tarifa" : "Agregar Tarifa"}</h2><br />
          <select
            className="tarifa_select"
            value={nuevaTarifa.tipo_tarifa}
            onChange={(e) =>
              setNuevaTarifa({ ...nuevaTarifa, tipo_tarifa: e.target.value })
            }
          >
            <option className="tarifa_option" value="">Selecciona el tipo de tarifa</option>
                <option value="Tiempo indefinido">Tiempo indefinido</option>
                <option value="Auto p/turno">Auto p/turno</option>
                <option value="Auto p/hora">Auto p/hora</option>
                <option value="Auto p/día">Auto p/día</option>
                <option value="Auto p/día">Auto p/semana</option>
                <option value="Auto p/mes">Auto p/mes</option>
                <option value="Moto p/turno">Moto p/turno</option>
                <option value="Moto p/hora">Moto p/hora</option>
                <option value="Moto p/día">Moto p/día</option>
                <option value="Moto p/semana">Moto p/semana</option>
                <option value="Moto p/mes">Moto p/mes</option>
                  
          </select>
          <br />
          <br />
          <input 
            className="tarifas_input"
            type="text"
            placeholder="Precio"
            value={nuevaTarifa.precio}
            onChange={(e) =>
              setNuevaTarifa({ ...nuevaTarifa, precio: e.target.value })
            }
          />
          <br />
          <button className="tarifas_button_ok" onClick={editMode ? putTarifa : postTarifa}>
            {editMode ? "Guardar Cambios" : "Agregar Tarifa"}
          </button>
          {editMode && <button className="tarifas_button_cancel" onClick={handleCancelEdit}>Cancelar</button>}
        </div>
      </AuthRol>
    </div>
  );
}

export default Tarifas;
