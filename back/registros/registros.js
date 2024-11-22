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
  body("matricula").notEmpty().isAlphanumeric().isLength({ max: 10 }),
  body("cliente").notEmpty().isAlpha().isLength({ max: 50 }),
  body("inicio").isISO8601(),
  body("duracion").isInt({ min: 1 }).notEmpty(),
  body("id_tarifa").isInt().notEmpty(),

  async (req, res) => {
    const validacion = validationResult(req);

    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const { id_lugar, matricula, cliente, duracion, id_tarifa } = req.body;

    try {

      // Verificación de si el lugar ya está ocupado
      const [lugar] = await db.query(
        "SELECT ocupado FROM lugares WHERE id_lugar = ?",
        [id_lugar]
      );
      if (lugar[0]?.ocupado === 1) {
        return res
          .status(400)
          .send({ mensaje: `El lugar ${id_lugar} ya está ocupado` });
      }

      // Comprobación de la tarifa
      const [tarifa] = await db.query(
        "SELECT * FROM tarifas WHERE id_tarifa = ?",
        [id_tarifa]
      );
      if (tarifa.length === 0) {
        return res.status(404).send({ mensaje: "Tarifa no encontrada" });
      }

      const { tipo_tarifa, precio } = tarifa[0];

      // Cálculo del las fechasy el precio
      const inicioFecha = new Date(inicio);
      let fin;

      if (tipo_tarifa.toLowerCase().includes("hora")) {
        fin = new Date(inicioFecha);
        fin.setHours(fin.getHours() + duracion);
      } else if (tipo_tarifa.toLowerCase().includes("turno")) {
        fin = new Date(inicioFecha);
        fin.setHours(fin.getHours() + duracion * 12);
      } else if (tipo_tarifa.toLowerCase().includes("día")) {
        fin = new Date(inicioFecha);
        fin.setDate(fin.getDate() + duracion);
      } else if (tipo_tarifa.toLowerCase().includes("semana")) {
        fin = new Date(inicioFecha);
        fin.setDate(fin.getDate() + duracion * 7);
      } else if (tipo_tarifa.toLowerCase().includes("mes")) {
        fin = new Date(inicioFecha);
        fin.setMonth(fin.getMonth() + duracion);
      } else {
        return res
          .status(400)
          .send({ mensaje: "Tipo de tarifa no soportado para cálculo" });
      }
      const precioFinal = precio * duracion;

      const [result] = await db.query(
        `INSERT INTO registros(id_lugar, matricula, cliente, inicio, fin, id_tarifa, precio_final) VALUES(?, ?, ?, ?, ?, ?)`,
        [id_lugar, matricula, cliente, inicioFecha, fin, id_tarifa, precioFinal]
      );

      res.status(201).send({ result, precioFinal, inicio, fin });

    } catch (error) {
      console.log(error);
      res.status(500).send("Error en el servidor");
    }
  }
);


export default registros;