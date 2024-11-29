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
      const data = await response.json();
      setLugares(data);
    } catch (error) {
      console.log("Error al cargar los lugares de la Api", error);
    }
  };

  const formularioLiberar = async (id_lugar, id_registro) => {
    const confirmar = window.confirm(`¿Está seguro de liberar el lugar ${id_lugar}`);

    const vehiculo = registros.find((registro)=>registro.id_registro==id_registro)

    if (!confirmar) return;
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
      await getLugares();
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
      await getRegistros();
    } catch (error) {
      console.error(
        "Error en la solicitud para liberar el lugar en el registro:",
        error
      );
    }

    try{
      const response = await fetch('http://localhost:3000/vehiculos/retirar',{
        method:'PUT',
        headers:{
          Authorization:`Bearer ${sesion.token}`,
          "Content-Type":"Application/json"
        },
        body:JSON.stringify({matricula:vehiculo.matricula})
      })
      if (!response.ok){
        const errorData = await response.json()
        return console.log("Error al crear el vehiculo",errorData)
      }
    }
    catch (error){
      console.error("Error al modificar el estado del vehiculo:",error)
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
      if (tipo.includes("minuto")) {
        setUnidadTiempo("minutos");
      }else if (tipo.includes("hora")) {
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
    const { matricula } = formData;


    // Validación de la matrícula    
    const letras = matricula.slice(0, 3);
    const espacio = matricula.slice(3,4)
    const numeros = matricula.slice(4);
     
    if(!espacio.split("").some(char => " ".includes(char))){
      return alert("la matricula debe contener un espacio entre las letras y los numeros")}
    if (matricula.length !== 7) {
      return alert("La matrícula debe tener exactamente 7 caracteres");
    }
  
    if (!letras.split("").every(char => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".includes(char))) {
      return alert("Los primeros 3 caracteres deben ser letras");
    }
  
    if (!numeros.split("").every(char => "0123456789".includes(char))) {
      return alert("Los últimos 3 caracteres deben ser números");
    }
  
    const tarifaSeleccionada = tarifas.find((tarifa) => tarifa.id_tarifa == formData.id_tarifa);
    const tipoVehiculo = tarifaSeleccionada.tipo_tarifa.includes('Auto') ? 1 : 2;
  
    const vehiculoData = {
      matricula: matricula,
      id_tipo_vehiculo: tipoVehiculo,
    };
  
    const vehiculoExiste = registros.find((registro) => registro.matricula === vehiculoData.matricula);
    console.log(vehiculoExiste)

    if (vehiculoExiste) {
      try {
        const response = await fetch('http://localhost:3000/vehiculos/estacionar', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ matricula: vehiculoExiste.matricula }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          return console.error("Error al modificar el estado del vehículo:", errorData);
        }
      } catch (error) {
        console.error("Error al modificar el estado del vehículo:", error);
      }
    } 
    else{
// POST para crear vehículo
      try {
        const response = await fetch('http://localhost:3000/vehiculos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sesion.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehiculoData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          return console.error("Error al crear el vehículo:", errorData);
        }
      } catch (error) {
        console.error("Error al crear el vehículo:", error);
      }
    }
      
    
  
    // Verificar registros existentes
    const regExistentedef = registros.find((registro) =>
      registro.matricula === formDataAjustado.matricula && new Date() < new Date(registro.fin)
    );
    if (regExistentedef) {
      return alert(`El vehículo con la matrícula ${formDataAjustado.matricula} ya está estacionado`);
    }
  
    const regExistenteind = registros.find((registro) =>
      registro.matricula === formDataAjustado.matricula && registro.fin === null
    );
    if (regExistenteind) {
      return alert("El registro ya existe");
    }
  
    // PUT para ocupar lugar
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
  
    // POST para crear registro
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
      <h1>Estacionamiento 🚘</h1>
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
              X
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
                  placeholder="Ej: ABC 234"
                  required
                  maxLength={7}
                />
              </div>
              <div>
                <label>Nombre del cliente:</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Ej: Sergio Pérez"
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
              <button type="submit" className="modal-confirm">Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Lugares;
