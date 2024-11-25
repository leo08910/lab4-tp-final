import express from "express";
import { db } from "../db.js";
import { body, validationResult } from "express-validator";
import { validarJwt } from "../validaciones/validaciones.js";

const registros = express.Router();

// GET /registros
registros.get("/registros", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM registros ORDER BY id_registro DESC`
    );
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
  body("matricula").matches(/^[A-Za-z0-9\s]+$/),
  body("cliente")
    .notEmpty()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/)
    .isLength({ max: 50 }),
  body("inicioFecha").isISO8601(),
  body("duracion").optional(),
  body("id_tarifa").isInt().notEmpty(),

  async (req, res) => {
    const validacion = validationResult(req);

    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const { id_lugar, matricula, cliente, inicioFecha, id_tarifa, duracion } =
      req.body;

    try {
      // Comprobación de la tarifa
      const [tarifa] = await db.query(
        "SELECT * FROM tarifas WHERE id_tarifa = ?",
        [id_tarifa]
      );
      if (tarifa.length === 0) {
        return res.status(404).send({ mensaje: "Tarifa no encontrada" });
      }

      const { tipo_tarifa, precio } = tarifa[0];

      let fin;
      let precioFinal;

      if (tipo_tarifa.toLowerCase().includes("indefinido")) {
        // Para los registros con tarifa indefinida
        fin = null;
        precioFinal = 0;
      } else {
        // Cálculo del las fechasy el precio para las tarifas con fecha fin
        console.log(tipo_tarifa);
        if (tipo_tarifa.toLowerCase().includes("hora")) {
          fin = new Date(inicioFecha);
          fin.setHours(fin.getHours() + parseInt(duracion));
        } else if (tipo_tarifa.toLowerCase().includes("turno")) {
          fin = new Date(inicioFecha);
          fin.setHours(fin.getHours() + parseInt(duracion) * 12);
        } else if (tipo_tarifa.toLowerCase().includes("día")) {
          fin = new Date(inicioFecha);
          console.log(fin.getDate());
          fin.setDate(fin.getDate() + parseInt(duracion));
        } else if (tipo_tarifa.toLowerCase().includes("semana")) {
          fin = new Date(inicioFecha);
          fin.setDate(fin.getDate() + parseInt(duracion) * 7);
        } else if (tipo_tarifa.toLowerCase().includes("mes")) {
          fin = new Date(inicioFecha);
          fin.setMonth(fin.getMonth() + parseInt(duracion));
        } else {
          return res
            .status(400)
            .send({ mensaje: "Tipo de tarifa no soportado para cálculo" });
        }
        precioFinal = parseInt(precio) * parseInt(duracion);
      }

      const [result] = await db.query(
        `INSERT INTO registros(id_lugar, matricula, cliente, inicio, fin, id_tarifa, precio_final) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [id_lugar, matricula, cliente, inicioFecha, fin, id_tarifa, precioFinal]
      );

      res.status(201).send({ result, precioFinal, inicioFecha, fin });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en el servidor");
    }
  }
);

// PUT /registros/:id_registro/liberar
registros.put(
  "/registros/:id_registro/liberar",
  validarJwt,
  async (req, res) => {
    const { id_registro } = req.params;

    try {
      const [registro] = await db.query(
        "SELECT * FROM registros WHERE id_registro = ?",
        [id_registro]
      );

      if (registro.length === 0) {
        return res.status(404).send({ mensaje: "Registro no encontrado" });
      }

      const { inicio, fin, id_tarifa } = registro[0];

      let fechaActual;
      let precioFinal;
      let horasTranscurridas;

      const [tarifa] = await db.query(
        "SELECT * FROM tarifas WHERE id_tarifa = ?",
        [id_tarifa]
      );

      const { precio } = tarifa[0];

      if (fin === null) { // Para las tarifas con tiempo indefinido

        // Validación de tarifa indefinida
        if (!tarifa[0].tipo_tarifa.toLowerCase().includes("indefinido")) {
          return res.status(400).send({
            mensaje: "Solo se pueden liberar registros con tarifa indefinida",
          });
        }

        // Cálculo de las horas pasadas desde la fecha inicio
        fechaActual = new Date();
        fechaActual.setHours(fechaActual.getHours());

        let inicioFecha = new Date(inicio);
        horasTranscurridas = Math.ceil(
          (fechaActual - inicioFecha) / (1000 * 60 * 60)
        );

        precioFinal = horasTranscurridas * precio;
        
      } else { // Para las tarifas con tiempo definido
        console.log(tarifa[0].tipo_tarifa)
      }

      // Actualización del registro
      await db.query(
        `UPDATE registros SET fin = ?, precio_final = ? WHERE id_registro = ?`,
        [fechaActual, precioFinal, id_registro]
      );

      res.status(200).send({
        mensaje: "Lugar liberado",
        precioFinal,
        horasTranscurridas,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en el servidor");
    }
  }
);

export default registros;
