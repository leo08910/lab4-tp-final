import { useState, useEffect } from "react";
import { useAuth } from "../Auth";
import "./lugares.css";
import getTarifas from "../Tarifas/GetTarifas";

function Lugares() {
  const { sesion } = useAuth();
  const [lugares, setLugares] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [tarifas, setTarifas] = useState([]);
  const [unidadTiempo, setUnidadTiempo] = useState("");

  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    getLugares();
    getRegistros();
  }, []);

  const getRegistros = async () => {
    try {
      const response = await fetch("http://localhost:3000/registros");
      const data = await response.json();
      setRegistros(data.result);
    } catch (error) {
      console.error("Error al cargar los registros de la API:", error);
    }
  };

  const getLugares = async () => {
    const response = await fetch("http://localhost:3000/lugares");
    try {
      const ApiLugares = await response.json();
      setLugares(ApiLugares);
    } catch (error) {
      console.log("Error al cargar los lugares de la Api", error);
    }
  };

  const formularioLiberar = async (id_lugar, id_registro) => {
    try {
      const response = await fetch(
        `http://localhost:3000/lugares/${id_lugar}/desocupar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return console.error("Error al liberar el lugar:", errorData);
      }

      const data = await response.json();
      console.log("Lugar liberado exitosamente:", data);
      getLugares();
    } catch (error) {
      console.error("Error en la solicitud para liberar el lugar:", error);
    }
    try {
      const response = await fetch(
        `http://localhost:3000/registros/${id_registro}/liberar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return console.error(
          "Error al liberar el lugar en el registro:",
          errorData
        );
      }

      const data = await response.json();
      console.log("Lugar liberado en el registro exitosamente:", data);
      getLugares();
    } catch (error) {
      console.error(
        "Error en la solicitud para liberar el lugar en el registro:",
        error
      );
    }
  };

  const handleClickLugar = (lugar) => {
    setSelectedLugar(lugar);
    setFormData({
      id_lugar: lugar.id_lugar,
      matricula: "",
      cliente: "",
      id_tarifa: "",
      duracion: "",
      inicioFecha: new Date().toISOString().slice(0, 19).replace("T", " "),
    });
    setModalVisible(true);
    getTarifas(sesion, setTarifas);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const tarifaSeleccionada = tarifas.find(
      (tarifa) => tarifa.id_tarifa.toString() === formData.id_tarifa
    );
    if (tarifaSeleccionada) {
      const tipo = tarifaSeleccionada.tipo_tarifa.toLowerCase();
      if (tipo.includes("hora")) {
        setUnidadTiempo("horas");
      } else if (tipo.includes("día")) {
        setUnidadTiempo("días");
      } else if (tipo.includes("semana")) {
        setUnidadTiempo("semanas");
      } else if (tipo.includes("turno")) {
        setUnidadTiempo("turnos");
      } else if (tipo.includes("mes")) {
        setUnidadTiempo("meses");
      } else {
        setUnidadTiempo("");
      }
    } else {
      setUnidadTiempo("");
    }
  }, [formData.id_tarifa, tarifas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const fecha = new Date(formData.inicioFecha);
    fecha.setHours(fecha.getHours() - 6);
    const fechaAjustada = fecha.toISOString().slice(0, 19).replace("T", " ");
    const formDataAjustado = { ...formData, inicioFecha: fechaAjustada };
  
    // Post para lugares
    try {
      const response = await fetch(
        `http://localhost:3000/lugares/${formDataAjustado.id_lugar}/ocupar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataAjustado),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return console.error("Error al ocupar el lugar:", errorData);
      }
      const data = await response.json();
      console.log("Lugar ocupado exitosamente:", data);
      getLugares();
      handleCloseModal();
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  
    // POST para registros
    try {
      const response = await fetch(`http://localhost:3000/registros`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sesion.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataAjustado),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return console.error("Error al cargar el registro:", errorData);
      }
      const data = await response.json();
      console.log("Registro cargado exitosamente:", data);
      handleCloseModal();
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
    getRegistros();
  };
  

  return (
    <>
      <h1>Estacionamiento</h1>
      <div className="estacionamiento">
        {lugares.map((lugar) => {
          const registroAsociado = registros.find(
            (registro) => registro.id_lugar === lugar.id_lugar
          );

          return (
            <button
              key={lugar.id_lugar}
              className={`lugar ${lugar.ocupado ? "ocupado" : "libre"}`}
              onClick={() =>
                lugar.ocupado
                  ? formularioLiberar(
                      lugar.id_lugar,
                      registroAsociado?.id_registro
                    )
                  : handleClickLugar(lugar)
              }
            >
              {lugar.ocupado ? (
                <>
                  <span>
                    Matrícula: {registroAsociado?.matricula || "Sin datos"}
                  </span>
                  <br />
                  <span>Cliente: {registroAsociado?.cliente || "N/A"}</span>
                  <br />
                </>
              ) : (
                "Libre"
              )}
            </button>
          );
        })}
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Ocupar Lugar {selectedLugar?.id_lugar}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Matrícula del vehículo:</label>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Dueño del vehículo:</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Tipo de tarifa:</label>
                <select
                  name="id_tarifa"
                  value={formData.id_tarifa}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una tarifa</option>
                  {tarifas.map((tarifa) => (
                    <option key={tarifa.id_tarifa} value={tarifa.id_tarifa}>
                      {tarifa.tipo_tarifa} (${tarifa.precio})
                    </option>
                  ))}
                </select>
              </div>
              {unidadTiempo && (
                <div>
                  <label>Duración en {unidadTiempo}:</label>
                  <input
                    type="number"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              )}
              <button type="submit">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Lugares;
