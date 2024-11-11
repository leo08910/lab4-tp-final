import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import reloj from "./reloj.js";
import usuarios from "./usuarios.js";
import router from "./auth.js";
import { vehiculosRouter } from "./vehiculos.js";
import { EstacionamientoRouter } from "./Estacionamiento.js";
import tarifas from "./tarifas.js";
import registros from "./registros.js";

const app = express();
const port = 3000;

conectarDB();

app.use(express.json());
app.use(cors());

app.use("/", usuarios);
app.use("/", router);
app.use("/vehiculos", vehiculosRouter);
app.use("/", tarifas);
app.use("/estacionamiento", EstacionamientoRouter);

app.use(reloj)
app.use("/", registros);

app.get("/usuarios", async (req, res) => {
  const [usuarios] = await db.execute("select * from usuarios");
  res.send({ usuarios });
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
