import { useEffect, useState } from "react";
import "./Tarifas.css";

function Tarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]); // Almacenar los tipos de vehículos
  const [nuevaTarifa, setNuevaTarifa] = useState({
    tipo_tarifa: "",
    id_tipo_vehiculo: "",
    precio: "",
  });
  const [editMode, setEditMode] = useState(false); // Modo edición
  const [tarifaIdToEdit, setTarifaIdToEdit] = useState(null); // ID de la tarifa en edición

  useEffect(() => {
    
    getTarifas();
    getTiposVehiculo(); // Cargar los tipos de vehículos al montar el componente
  }, []);

  const getTarifas = async () => {
    const response = await fetch(`http://localhost:3000/tarifas`);
    if (response.ok) {
      const { result } = await response.json();
      setTarifas(result);
    }
  };

  const getTiposVehiculo = async () => {
    const response = await fetch(`http://localhost:3000/tipos_vehiculo`);
    if (response.ok) {
      const { tipos_vehiculo } = await response.json();
      setTiposVehiculo(tipos_vehiculo || []);
    }
  };

  const postTarifa = async () => {
        const confirmacion = window.confirm("¿Seguro que deseas guardar los cambios?");
    if (!confirmacion) {
      return; // Salir de la función si el usuario cancela
    }
    const response = await fetch("http://localhost:3000/tarifas", {
      method: "POST",
      headers: {
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
    if (!confirmacion) {
      return; // Salir de la función si el usuario cancela
    }
  
    try {
      const response = await fetch(`http://localhost:3000/tarifas/${tarifaIdToEdit}`, {
        method: "PUT",
        headers: {
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
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  
  
  const deleteTarifa = async (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta tarifa?");
    if (!confirmacion) {
      return; // Salir de la función si el usuario cancela
    }
    const response = await fetch(`http://localhost:3000/tarifas/${id}`, {
      method: "DELETE",
      headers: {
      },
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
    <div className="container">
      <div className="tarifas-container">
        <h1 className="titulo">Tarifas</h1>

        {tarifas.map((tarifa) => (
          <div className="tarifas-tarjeta" key={tarifa.id_tarifa}>
            <h3 className="tarifa-titulo">
              {tarifa.tipo_tarifa} ({tarifa.tipo_vehiculo})
            </h3>
            <p className="tarifa-precio">Precio: ${tarifa.precio}</p>
            <button onClick={() => handleEdit(tarifa)}>Modificar</button>
            <button onClick={() => deleteTarifa(tarifa.id_tarifa)}>Eliminar</button>
          </div>
        ))}
      </div>
      <div>
        {/* Formulario para crear o editar una tarifa */}
        <h2>{editMode ? "Modificar Tarifa" : "Agregar Tarifa"}</h2>
        <select
          value={nuevaTarifa.tipo_tarifa}
          onChange={(e) =>
            setNuevaTarifa({ ...nuevaTarifa, tipo_tarifa: e.target.value })
          }
        >
          <option value="">Selecciona el tipo de tarifa</option>
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
          value={nuevaTarifa.id_tipo_vehiculo}
          onChange={(e) =>
            setNuevaTarifa({
              ...nuevaTarifa,
              id_tipo_vehiculo: e.target.value,
            })
          }
        >
          <option value="">Selecciona el tipo de vehículo</option>
          {tiposVehiculo.map((tipo) => (
            <option key={tipo.id_tipo_vehiculo} value={tipo.id_tipo_vehiculo}>
              {tipo.tipo_vehiculo}
            </option>
          ))}
        </select>
        <br />
        <input
          type="text"
          placeholder="Precio"
          value={nuevaTarifa.precio}
          onChange={(e) =>
            setNuevaTarifa({ ...nuevaTarifa, precio: e.target.value })
          }
        />
        <br />
        <button onClick={editMode ? putTarifa : postTarifa}>
          {editMode ? "Guardar Cambios" : "Agregar Tarifa"}
        </button>
        {editMode && <button onClick={handleCancelEdit}>Cancelar</button>}
      </div>
    </div>
  );
}

export default Tarifas;
