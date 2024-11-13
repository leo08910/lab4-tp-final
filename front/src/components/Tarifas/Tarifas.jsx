import { useEffect, useState } from "react";

function Tarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]); // Almacenar los tipos de vehículos
  const [nuevaTarifa, setNuevaTarifa] = useState({
    tipo_tarifa: "",
    id_tipo_vehiculo: "",
    precio: ""
  });

  useEffect(() => {
    getTarifas();
    getTiposVehiculo(); // Cargar los tipos de vehículos al montar el componente
  }, []);

  const getTarifas = async () => {
    const response = await fetch(`http://localhost:3000/tarifas`);
    if (response.ok) {
      const { result } = await response.json();
      setTarifas(result || []);
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
    const response = await fetch("http://localhost:3000/tarifas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaTarifa)
    });
    if (response.ok) {
      getTarifas();
      setNuevaTarifa({ tipo_tarifa: "", id_tipo_vehiculo: "", precio: "" });
    }
  };

  const putTarifa = async (id) => {
    const response = await fetch(`http://localhost:3000/tarifas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaTarifa)
    });
    if (response.ok) {
      getTarifas();
      setNuevaTarifa({ tipo_tarifa: "", id_tipo_vehiculo: "", precio: "" });
    }
  };

  const deleteTarifa = async (id) => {
    const response = await fetch(`http://localhost:3000/tarifas/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      getTarifas();
    }
  };

  return (
    <>
    <div style={{display:'flex', flexDirection:'row'}}>
    <div className="tarifas-container">
        <h1 className="titulo">Tarifas</h1>

        {tarifas.map((tarifa) => (
          <div className="tarifas-tarjeta" key={tarifa.id_tarifa}>
            <h3 className="tarifa-titulo">
              {tarifa.tipo_tarifa} ({tarifa.tipo_vehiculo})
            </h3>
            <p className="tarifa-precio">Precio: ${tarifa.precio}</p>
            <button onClick={() => putTarifa(tarifa.id_tarifa)}>Modificar</button>
            <button onClick={() => deleteTarifa(tarifa.id_tarifa)}>Eliminar</button>
          </div>
        ))}
      </div>
      <div>
                {/* Formulario para crear o editar una tarifa */}
                <h2>Agregar o Modificar Tarifa</h2>
        <input
          type="text"
          placeholder="Tipo de Tarifa"
          value={nuevaTarifa.tipo_tarifa}
          onChange={(e) =>
            setNuevaTarifa({ ...nuevaTarifa, tipo_tarifa: e.target.value })
          }
        /> <br />
        <select
          value={nuevaTarifa.id_tipo_vehiculo}
          onChange={(e) =>
            setNuevaTarifa({ ...nuevaTarifa, id_tipo_vehiculo: e.target.value })
          }
        >
          <option value="">Selecciona el tipo de vehículo</option>
          {tiposVehiculo.map((tipo) => (
            <option key={tipo.id_tipo_vehiculo} value={tipo.id_tipo_vehiculo}>
              {tipo.tipo_vehiculo}
            </option>
          ))}
        </select> <br />
        <input
          type="text"
          placeholder="Precio"
          value={nuevaTarifa.precio}
          onChange={(e) =>
            setNuevaTarifa({ ...nuevaTarifa, precio: e.target.value })
          }
        /> <br />
        <button onClick={postTarifa}>Agregar Tarifa</button>
      </div>
    </div>
      
    </>
  );
}

export default Tarifas;
