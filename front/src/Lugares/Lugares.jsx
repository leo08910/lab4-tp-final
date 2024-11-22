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
      console.log("Los datos de la Api son", ApiLugares);
      setLugares(ApiLugares);
    } catch (error) {
      console.log("Error al cargar los lugares de la Api", error);
    }
  };

  const handleClickLugar = (lugar) => {
    setSelectedLugar(lugar);
    setFormData({
      id_lugar: lugar.id_lugar,
      matricula: "",
      cliente: "",
      inicio: "",
      fin: "",
      id_tarifa: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_vehiculo = 5; // ID de prueba
    const { id_lugar /*, matricula, dueño, tipoTarifa*/ } = formData;
    try {
      const response = await fetch(
        `http://localhost:3000/lugares/${id_lugar}/ocupar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
          //body: JSON.stringify({ matricula, dueño, tipoTarifa }),
          body: JSON.stringify({ id_vehiculo }),
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
          body: JSON.stringify({ id_vehiculo }),
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
                  name="dueño"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Tipo de tarifa:</label>
                <select
                  name="tipoTarifa"
                  value={formData.tipoTarifa}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una tarifa</option>
                  {tarifas.map((tarifa) => (
                    <option key={tarifa.id_tarifa} value={tarifa.id_tarifa}>
                      {tarifa.tipo_tarifa}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Lugares;
