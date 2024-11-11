import express from "express";
import { db } from "./db.js";
import { body, param, validationResult } from "express-validator";
import reloj from "./reloj.js";

const registros = express.Router();

registros.get("/registros", async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM registros`);
    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

registros.post(
  "/registros",
  body("id_lugar").isInt().notEmpty(),
  body("id_vehiculo").isInt().notEmpty(),
  body("inicio").isISO8601(),
  body("fin").optional().isISO8601(),
  body("id_tarifa").isInt().notEmpty(),
  body("precio_final").isDecimal(),

  async (req, res) => {
    const validacion = validationResult(req);

    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const { id_lugar, id_vehiculo, inicio, fin, id_tarifa, precio_final } =
      req.body;

    try {
      const [result] = await db.query(
        `INSERT INTO registros(id_lugar, id_vehiculo, inicio, fin, id_tarifa, precio_final) VALUES(?, ?, ?, ?, ?, ?)`,
        [id_lugar, id_vehiculo, inicio, fin, id_tarifa, precio_final, id_lugar]
      );
      db.query("UPDATE lugares SET ocupado = 1 WHERE id_lugar = ?", id_lugar);

      res.status(201).send({ result });

      if (fin) {
        const tiempoRestante = new Date(fin).getTime() - new Date().getTime();

        if (tiempoRestante > 0) {
          setTimeout(async () => {
            try {
              await db.query(
                `UPDATE lugares SET ocupado = 0 WHERE id_lugar = ?`,
                [id_lugar]
              );
              console.log(`Lugar ${id_lugar} liberado`);
            } catch (error) {
              console.log(`Error al liberar el lugar ${id_lugar}:`, error);
            }
          }, tiempoRestante);
        }
      } else {
        console.log(`Lugar ${id_lugar} reservado por tiempo indefinido.`);
      }
      
    } catch (error) {
      console.log(error);
      if (error.code === "ER_SIGNAL_EXCEPTION") {
        res.status(400).send("Error del cliente");
      } else {
        res.status(500).send("Error en el servidor");
      }
    }
  }
);

export default registros;
