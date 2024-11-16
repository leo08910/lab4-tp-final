import Lugares from "./components/Lugares/Lugares"
import Tarifas from "./components/Tarifas/Tarifas"

function App() {
  return(
    <>
    <div style={{display:"flex",flexDirection:"column"}}>
      <div id="lugaresContenedor">
        <Lugares/>
      </div>
      <div id="tarifasContenedor">
        <Tarifas/>
      </div>      
    </div>

    </>
  )
}

export default App