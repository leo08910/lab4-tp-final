import { useEffect, useState } from "react";

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await fetch("http://localhost:3000/registros");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setRegistros(data.result);
      } catch (err) {
        console.error("Error al obtener los registros:", err);
        setError("No se pudo obtener la lista de registros.");
      }
    };

    fetchRegistros();
  }, []);

  return (
    <div>
      <h2>Registros</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {registros.length > 0 ? (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Lugar</th>
              <th>ID Vehículo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>ID Tarifa</th>
              <th>Precio Final</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id_registro}>
                <td>{registro.id_registro}</td>
                <td>{registro.id_lugar}</td>
                <td>{registro.id_vehiculo}</td>
                <td>{new Date(registro.inicio).toLocaleString()}</td>
                <td>{registro.fin ? new Date(registro.fin).toLocaleString() : "Indefinido"}</td>
                <td>{registro.id_tarifa}</td>
                <td>{registro.precio_final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay registros disponibles.</p>
      )}
    </div>
  );
};

export default Registros;
