import { useEffect, useState } from "react";
import { useAuth } from "../Auth";

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [error, setError] = useState(null);
  const { sesion } = useAuth();

  // Obtener registros
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

  // Obtener tarifas
  useEffect(() => {
      const getTarifas = async () => {
    const response = await fetch(`http://localhost:3000/tarifas`, {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (response.ok) {
      const { result } = await response.json();
      setTarifas(result);
    }
  };
  getTarifas(sesion,setTarifas);
  }, []);

  // Función para obtener tipo_tarifa
  const obtenerTipoTarifa = (idTarifa) => {
    const tarifa = tarifas.find((tarifa) => tarifa.id_tarifa === idTarifa);
    return tarifa ? tarifa.tipo_tarifa : "Desconocida";
  };

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
              <th>Matrícula</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Tipo de Tarifa</th>
              <th>Precio Final</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id_registro}>
                <td>{registro.id_registro}</td>
                <td>{registro.id_lugar}</td>
                <td>{registro.matricula}</td>
                <td>{new Date(registro.inicio).toLocaleString()}</td>
                <td>{registro.fin ? new Date(registro.fin).toLocaleString() : "Indefinido"}</td>
                <td>{obtenerTipoTarifa(registro.id_tarifa)}</td>
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
