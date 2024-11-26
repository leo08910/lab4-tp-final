const getTarifas = async (sesion, setTarifas) => {
    const response = await fetch(`http://localhost:3000/tarifas`, {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (response.ok) {
      const { result } = await response.json();
      setTarifas(result);
    }
  };

export default getTarifas;

export const validacionesTarifa = (nuevaTarifa) => {
  if (nuevaTarifa.tipo_tarifa===""){
    alert("seleccione un tipo de tarifa");
    return;
  }
  if (nuevaTarifa.precio===""){
    alert("precio no puede ser vacio");
    return;
  }    
  if (nuevaTarifa.precio < 0){
    alert("precio no puede ser menor a cero");
    return;
  }
}