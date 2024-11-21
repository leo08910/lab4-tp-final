import { useState, useEffect } from "react";
import { useAuth, AuthRol } from "../Auth"; // Asegúrate de importar AuthRol
import "./Tarifas.css";

function Tarifas() {
  const { sesion } = useAuth();
  const [tarifas, setTarifas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [nuevaTarifa, setNuevaTarifa] = useState({
    tipo_tarifa: "",
    id_tipo_vehiculo: "",
    precio: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [tarifaIdToEdit, setTarifaIdToEdit] = useState(null);

  useEffect(() => {
    getTarifas();
    getTiposVehiculo();
  }, []);

  const getTarifas = async () => {
    const response = await fetch(`http://localhost:3000/tarifas`, {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (response.ok) {
      const { result } = await response.json();
      setTarifas(result);
    }
  };

  const getTiposVehiculo = async () => {
    const response = await fetch(`http://localhost:3000/tipos_vehiculo`, {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (response.ok) {
      const { tipos_vehiculo } = await response.json();
      setTiposVehiculo(tipos_vehiculo || []);
    }
  };

  const postTarifa = async () => {
    const confirmacion = window.confirm("¿Seguro que deseas agregar tarifa?");
    if (!confirmacion) return;

    const response = await fetch("http://localhost:3000/tarifas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sesion.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTarifa),
    });
    if (response.ok) {
      getTarifas();
      setNuevaTarifa({ tipo_tarifa: "", id_tipo_vehiculo: "", precio: "" });
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
      getTarifas();
      setNuevaTarifa({ tipo_tarifa: "", id_tipo_vehiculo: "", precio: "" });
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
      getTarifas();
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
      id_tipo_vehiculo: tarifa.id_tipo_vehiculo,
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

        {tarifas.map((tarifa) => (
            <table className="tarifas_table" key={tarifa.id_tarifa}>
            <thead>
              <tr >
                <th>tipo de tarifa</th>
                <th>tipo de vehiculo</th>
                <th>precio</th>
                <th>acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tarifa.tipo_tarifa}</td>
                <td>{tarifa.tipo_vehiculo}</td>
                <td>${tarifa.precio}</td>
                <td><AuthRol superusuario={1}>
              <button onClick={() => handleEdit(tarifa)}>Modificar</button>
              <button onClick={() => deleteTarifa(tarifa.id_tarifa)}>Eliminar</button>
            </AuthRol></td>
              </tr>
            </tbody>
          </table>
        ))} <br />
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
            {tarifas
              .filter(
                (tarifa, index, self) =>
                  self.findIndex((t) => t.tipo_tarifa === tarifa.tipo_tarifa) === index
              )
              .map((tarifa) => (
                <option key={tarifa.id_tarifa} value={tarifa.tipo_tarifa}>
                  {tarifa.tipo_tarifa}
                </option>
              ))}
          </select>
          <br />
          <select
            className="tarifa_select"
            value={nuevaTarifa.id_tipo_vehiculo}
            onChange={(e) =>
              setNuevaTarifa({ ...nuevaTarifa, id_tipo_vehiculo: e.target.value })
            }
          >
            <option className="tarifa_option" value="">Selecciona el tipo de vehículo</option>
            {tiposVehiculo.map((tipo) => (
              <option key={tipo.id_tipo_vehiculo} value={tipo.id_tipo_vehiculo}>
                {tipo.tipo_vehiculo}
              </option>
            ))}
          </select>
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
