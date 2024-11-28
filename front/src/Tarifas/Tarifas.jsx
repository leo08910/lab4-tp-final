import { useState, useEffect } from "react";
import { useAuth, AuthRol } from "../Auth"; //traigo useAuth para acceder a la sesion actual, y AuthRol para verificar si es superusuario
import "./Tarifas.css";
import getTarifas from "./GetTarifas";//Import para obtener tarifas.
import { validacionesTarifa } from "./GetTarifas";//Import para realizar validaciones


function Tarifas() {
  const { sesion } = useAuth();//extraemos la imformacion de la sesion
  const [tarifas, setTarifas] = useState([]);//estado para almacenar estados de tarifas
  const [nuevaTarifa, setNuevaTarifa] = useState({//estado para manejar el agregado o edicion de tarifa
    tipo_tarifa: "",
    precio: "",
  });
  const [editMode, setEditMode] = useState(false);//estado para controlar si estamos editando
  const [tarifaIdToEdit, setTarifaIdToEdit] = useState(null);//estado para guardar el id de la tarifa a editar

  useEffect(() => {
    getTarifas(sesion,setTarifas);//llamamos a la funcion para obtener las tarifas
  }, []);

  //Funcion paara agregar una nueva tarea
  const postTarifa = async () => {
    const confirmacion = window.confirm("¿Seguro que deseas agregar tarifa?");//ventana para confirmar
    if (!confirmacion) return;
    const tarifaExistente = tarifas.find(//verificamos si la tarifa ya existe
      (tarifa) => tarifa.tipo_tarifa === nuevaTarifa.tipo_tarifa
    );
      if (tarifaExistente) {
        alert("El tipo de tarifa ya existe. Por favor, elige otro.");
        return;
      }
    validacionesTarifa(nuevaTarifa,tarifas);//validacion antes de enviar a la api
    const response = await fetch("http://localhost:3000/tarifas", {//realizo solicitud de post a la api
      method: "POST",
      headers: {
        Authorization: `Bearer ${sesion.token}`,//envio el token de autentificacion
        "Content-Type": "application/json",//indico el tipo de content
      },
      body: JSON.stringify(nuevaTarifa),//envio la nuevaTarifa en formato json
    });
    if (response.ok) {
      getTarifas(sesion,setTarifas);//Actualizo las tarifas
      setNuevaTarifa({ tipo_tarifa: "", precio: "" });//reseteo el estado de nuevaTarifa
    } else {
      const error = await response.json();
      console.error("Error al agregar tarifa:", error);
    }
  };
  //Funcion para modificar una tarifa
  const putTarifa = async () => {
    const confirmacion = window.confirm("¿Seguro que deseas guardar los cambios?");
    if (!confirmacion) return;
    validacionesTarifa(nuevaTarifa,tarifas)
    const response = await fetch(`http://localhost:3000/tarifas/${tarifaIdToEdit}`, {//realizo solicitud de put a la api
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
      setEditMode(false);//salgo del modo edicion
      setTarifaIdToEdit(null);//reseteo el estado del id
    } else {
      const error = await response.json();
      console.error("Error al modificar tarifa:", error);
    }
  };

  //Funcion para eliminar una tarifa
  const deleteTarifa = async (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta tarifa?");
    if (!confirmacion) return;

    const response = await fetch(`http://localhost:3000/tarifas/${id}`, {//realizo solicitud de delete a la api
      method: "DELETE",
      headers: {Authorization: `Bearer ${sesion.token}`,},
    });
    if (response.ok) {
      getTarifas(sesion,setTarifas);//actualizo las tarifas
    } else {
      const error = await response.json();
      console.error("Error al eliminar tarifa:", error);
    }
  };
  //function para inicial el modo edicion de una tarifa
  const handleEdit = (tarifa) => {
    setEditMode(true);
    setTarifaIdToEdit(tarifa.id_tarifa);
    setNuevaTarifa({
      tipo_tarifa: tarifa.tipo_tarifa,
      precio: tarifa.precio,
    });
  };
  //funcion para cancelar edicion
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
            {tarifas.map((tarifa) => (//mapeo tarifas para renderizar ca una de las filas en la tabla
            <tbody  key={tarifa.id_tarifa}>{/* key unica basada en id_tarifa para identificr los elementos*/}
              <tr>
                <td className="tarifas_td">{tarifa.tipo_tarifa}</td>
                <td className="tarifas_td">${tarifa.precio}</td>
               <AuthRol superusuario={1}><td className="tarifas_td tarifas_td_edit"> {/*uso AuthRol para ver quien esta en sesion y sus permisos*/}
              <button className="tarifas_button_edit" 
              onClick={() => handleEdit(tarifa)}>
                <img style={{width:"2vw"}} src="/assets/edit.svg" alt="" />
              </button>
              <button className="tarifas_button_delete" 
              onClick={() => deleteTarifa(tarifa.id_tarifa)}>
                <img style={{width:"2vw"}} src="/assets/delete.svg" alt="" />
              </button></td> </AuthRol>
              </tr>
            </tbody>))}
          </table>
      <AuthRol superusuario={1} > 
        {/* formulario para agregar o editar tarifas */}
        <div className="superusuario">{/* este div se mostrara dependiendo del rol */}
          <h2>{editMode ? "Modificar Tarifa" : "Agregar Tarifa"}</h2>{/* perguntamos si esta en modo edicion y si lo esta
          cambiamos el titulo del contenedor */}
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
                <option value="Auto p/día">Auto p/semana</option>
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
          <button className="tarifas_button_ok" onClick={editMode ? putTarifa : postTarifa}>{/*si estamos en modo edicion
           al hacer click se hara un put*/}
            {editMode ? <> <img style={{width:"2vw"}} src="/assets/ok.svg" alt="" /><span>Aceptar Cambios</span></> :
            <><span>Agregar Nueva</span><img style={{width:"2vw"}} src="/assets/add.svg" alt="" /></>}
            {/*si estamos en modo edicion en lugar de agregar nueva sera aceptar cambios*/}
          </button>
          {editMode && <button className="tarifas_button_cancel" onClick={handleCancelEdit}>{<><span>Cancelar</span><img style={{width:"2vw"}} src="/assets/cancel.svg" alt="" /></>}</button>}
        </div>{/*si estamos en modo edicion tambien habra la opcion de cancelar */}
      </AuthRol>
    </div>
  );
}

export default Tarifas;
