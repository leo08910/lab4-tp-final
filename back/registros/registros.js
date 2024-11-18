import express from "express";
import { db } from "../db.js";
import { body, validationResult } from "express-validator";
import { validarJwt } from "../validaciones/validaciones.js";

const registros = express.Router();

// GET /registros
registros.get("/registros", async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM registros`);
    res.status(200).send({ result });
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

// POST /registros
registros.post(
  "/registros",
  validarJwt,
  body("id_lugar").isInt().notEmpty(),
  body("id_vehiculo").isInt().notEmpty(),
  body("inicio").isISO8601(),
  body("fin").optional().isISO8601(),
  body("id_tarifa").isInt().notEmpty(),
  body("precio_final").isDecimal(),

  async (req, res) => {
    const validacion = validationResult(req);

    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const { id_lugar, id_vehiculo, inicio, fin, id_tarifa, precio_final } =
      req.body;

    try {
      //Para verificar si un lugar ya está ocupado
      const [lugar] = await db.query(
        "SELECT ocupado FROM lugares WHERE id_lugar = ?",
        [id_lugar]
      );
      if (lugar[0]?.ocupado === 1) {
        return res.status(400).send({ mensaje: `El lugar ${id_lugar} ya está ocupado` });
      }

      //Para verificar si un vehículo se encuentra ya estacionado
      const [vehiculoEnUso] = await db.query(
        "SELECT * FROM registros WHERE id_vehiculo = ? AND (fin IS NULL OR fin > NOW())",
        [id_vehiculo]
      );
      if (vehiculoEnUso.length > 0) {
        return res.status(400).send({mensaje: `El vehículo ${id_vehiculo} ya está estacionado en otro lugar`});
      }

      //Inserción de los datos al registro
      const [result] = await db.query(
        `INSERT INTO registros(id_lugar, id_vehiculo, inicio, fin, id_tarifa, precio_final) VALUES(?, ?, ?, ?, ?, ?)`,
        [id_lugar, id_vehiculo, inicio, fin, id_tarifa, precio_final]
      );

      //Actualización 
      await db.query("UPDATE lugares SET ocupado = 1 WHERE id_lugar = ?", [
        id_lugar,
      ]);
      res.status(201).send({ result });

      if (fin) {
        const tiempoRestante = new Date(fin).getTime() - new Date().getTime();

        if (tiempoRestante > 0) {

          setTimeout(async () => {
            try {
              await db.query(
                "UPDATE lugares SET ocupado = 0 WHERE id_lugar = ?",
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
      res.status(error.code === "ER_SIGNAL_EXCEPTION" ? 400 : 500).send("Error en el servidor");
    }
  }
);

export default registros;