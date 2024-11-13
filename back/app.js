
import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import usuarios from "./usuarios.js";
import router from "./auth.js"
import { vehiculosRouter } from "./vehiculos.js";
import { LugaresRouter } from "./lugares.js"


const app = express();
const port = 3000;

conectarDB();

app.use(express.json());
app.use(cors());

app.use("/", usuarios);
app.use("/", router);
app.use('/vehiculos',vehiculosRouter)

app.use("/lugares",LugaresRouter)

app.get("/usuarios", async (req, res) => {
  const [usuarios] = await db.execute("select * from usuarios");
  res.send({ usuarios });
  });


app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});