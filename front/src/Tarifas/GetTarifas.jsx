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