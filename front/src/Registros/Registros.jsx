import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import "./Registros.css";
import getTarifas from "../Tarifas/GetTarifas";

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
    getTarifas(sesion, setTarifas);
  }, []);

  // Función para obtener tipo_tarifa
  const obtenerTipoTarifa = (idTarifa) => {
    const tarifa = tarifas.find((tarifa) => tarifa.id_tarifa === idTarifa);
    return tarifa ? tarifa.tipo_tarifa : "Desconocida";
  };

  return (
    <div className="Registros-container">
      <h1>Registros 📒</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {registros.length > 0 ? (
        <div className="Registros-table-container">
          <table className="Registros-table">
            <thead>
              <tr>
                <th>Lugar</th>
                <th>Matrícula</th>
                <th>Cliente</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Tipo de Tarifa</th>
                <th>Precio Final</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id_registro}>
                  <td>Lugar {registro.id_lugar}</td>
                  <td>{registro.matricula}</td>
                  <td>{registro.cliente}</td>
                  <td>{new Date(registro.inicio).toLocaleString()}</td>
                  <td>
                    {registro.fin
                      ? new Date(registro.fin).toLocaleString()
                      : "Indefinido"}
                  </td>
                  <td>{obtenerTipoTarifa(registro.id_tarifa)}</td>
                  <td>${registro.precio_final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay registros disponibles.</p>
      )}
    </div>
  );
};

export default Registros;
