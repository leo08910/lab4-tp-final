import express from "express"
import cors from "cors"
import { conectarDB,db } from "./db.js"

const app = express()
const port = 3000
conectarDB()
app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
  const [usuarios] = await db.execute("select nombre from usuarios");
  res.send({ usuarios });
  });
  
    
app.listen(port, () => {
    console.log(`La aplicacion esta funcionando en: ${port}`);
  });