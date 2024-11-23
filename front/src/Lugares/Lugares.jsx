import { useState, useEffect } from "react";
import { useAuth } from "../Auth";
import "./lugares.css";

function Lugares() {
  const { sesion } = useAuth();
  const [lugares, setLugares] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [tarifas, setTarifas] = useState([]);
  const [unidadTiempo, setUnidadTiempo] = useState("");

  useEffect(() => {
    getLugares();
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

  const getLugares = async () => {
    const response = await fetch("http://localhost:3000/lugares");
    try {
      const ApiLugares = await response.json();
      setLugares(ApiLugares);
    } catch (error) {
      console.log("Error al cargar los lugares de la Api", error);
    }
  };
  
  const formularioLiberar = async (id_lugar) => {
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
    getTarifas();
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
    // Post para lugares
    try {
      const response = await fetch(
        `http://localhost:3000/lugares/${formData.id_lugar}/ocupar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
      const response = await fetch(
        `http://localhost:3000/registros`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
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


  };

  return (
    <>
      <h1>Estacionamiento</h1>
      <div className="estacionamiento">
        {lugares.map((lugar) => (
          <button
            key={lugar.id_lugar}
            className={`lugar ${lugar.ocupado ? "ocupado" : "libre"}`}
            onClick={() =>
              lugar.ocupado
                ? formularioLiberar(lugar.id_lugar)
                : handleClickLugar(lugar)
            }
          >
            {lugar.ocupado ? "Ocupado" : "Libre"}
          </button>
        ))}
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
