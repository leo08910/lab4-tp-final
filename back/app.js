import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import usuarios from "./usuarios.js";
import router from "./auth.js"

const app = express();
const port = 3000;

conectarDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.use("/", usuarios);
app.use("/auth", router);


app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});