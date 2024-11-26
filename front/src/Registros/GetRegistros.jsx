const GetRegistros = async (sesion, setRegistros) => {
    const response = await fetch(`http://localhost:3000/registros`, {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    if (response.ok) {
      const { result } = await response.json();
      setRegistros(result);
    }
  };

export default GetRegistros;