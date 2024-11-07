import express from "express"
import cors from "cors"
import { conectarDB,db } from "./db.js"
import { vehiculosRouter } from "./vehiculos.js"

const app = express()
const port = 3000
conectarDB()
app.use(express.json())
app.use(cors())

app.use('/vehiculos',vehiculosRouter)

app.get("/usuarios", async (req, res) => {
  const [usuarios] = await db.execute("select * from usuarios");
  res.send({ usuarios });
  });

/*app.get("/vehiculos", async (req, res) => {
    const [vehiculos] = await db.execute("select * from vehiculos");
    res.send({ vehiculos });
    });*/
  
app.listen(port, () => {
    console.log(`La aplicacion esta funcionando en: ${port}`);
  });