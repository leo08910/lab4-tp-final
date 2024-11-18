import express from "express";
import {db} from "../db.js"
import { body,param, validationResult } from "express-validator";
import passport from "passport";
import { validarId,validarSuperUsuario,validarJwt } from "../valdiaciones/validaciones.js";

const tarifas = express.Router()

tarifas.post("")

// traer todas las tarifas.
tarifas.get(
  "/tarifas",
  validarJwt,
  async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT t.id_tarifa, t.tipo_tarifa, t.id_tipo_vehiculo, t.precio, tv.tipo_vehiculo
      FROM tarifas t
      JOIN tipos_vehiculo tv ON t.id_tipo_vehiculo = tv.id_tipo_vehiculo
    `);
    res.status(200).send({result});
  } catch (error) {
    res.status(500).send("Error al obtener los tarifas");
  }
});
tarifas.get(
  "/tarifas/:id",
  validarId, 
  validarJwt,
  async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql = "select * from tarifas where id_tarifa=?";
  const [tarifas] = await db.execute(sql, [id]);

  // Si no hay tareas enviar un 204 (sin contenido)
  if (tarifas.length === 0) {
    res.status(204).send();
  } else {
    res.send({ tarifa: tarifas[0] });
  }
});
//traer tipo_vehiculo de por tarifa
// tarifas.get("/tarifas/:id/tipo_vehiculo", async (req, res) => {
//    const id = Number(req.params.id);
//   try {
//     const sql =
//     "select tv.id_tipo_vehiculo, tv.tipo_vehiculo \
//      from tipos_vehiculo tv \
//      join tarifas t on tv.id_tipo_vehiculo = t.id_tipo_vehiculo \
//      where t.id_tipo_vehiculo=?";
//   const [tipos_vehiculo] = await db.execute(sql, [id]);

//   res.send({ tipo_vehiculo: tipos_vehiculo[0] });
//   } catch (error) {
//     res.status(500).send("Error al obtener los tarifas");
//   }
// }) 

// Obtener todos los tipos de vehículos
tarifas.get(
  "/tipos_vehiculo",
  validarJwt,
  validarSuperUsuario,
  async (req, res) => {
  try {
    const [result] = await db.query("SELECT id_tipo_vehiculo, tipo_vehiculo FROM tipos_vehiculo");
    res.status(200).send({ tipos_vehiculo: result });
  } catch (error) {
    res.status(500).send("Error al obtener los tipos de vehículos");
  }
});

//crear una tarifa
tarifas.post("/tarifas",
  validarJwt,
  validarSuperUsuario,
  body("tipo_tarifa").isAlpha().notEmpty().isLength({ max: 25 }),
  body("id_tipo_vehiculo").isInt().notEmpty(),
  body("precio").isDecimal().notEmpty(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (req.user.superusuario != 1) {
      res.status(401).send({mensaje: "No tiene permisos para crear una nueva tarifa"})
    }else{
          const { tipo_tarifa, id_tipo_vehiculo, precio } = req.body;
    try {
    const [result] = await db.query(`insert into tarifas(tipo_tarifa, id_tipo_vehiculo, precio) values(?, ?, ?)`,
    [
    tipo_tarifa,
    id_tipo_vehiculo,
    precio
    ]);
    return res.status(201).send({result: "se creo la tarifa correctamente"});
    } catch (error) {
      console.log(error)
      if (error.code === "ER_SIGNAL_EXCEPTION") {
        res.status(400).send("asi no es");
      } else {
        res.status(500).send("Error en el servidor");
      }
    }
    }
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

  });
  //modificar una tarifa
  tarifas.put("/tarifas/:id",
    validarId,
    validarJwt,
    validarSuperUsuario,
    body("tipo_tarifa").isAlpha().notEmpty().isLength({ max: 25 }),
    body("id_tipo_vehiculo").isInt().notEmpty(),
    body("precio").isDecimal().notEmpty(),
    
    async (req, res) => {
      const validacion = validationResult(req);
      if (req.user.superusuario != 1) {
        res.status(401).send({mensaje: "No tiene permisos para ver los usuarios"})
      }else{
      if (!validacion.isEmpty()) {
        return res.status(400).send({ errores: validacion.array() });
      }
      const id = Number(req.params.id);
      const { tipo_tarifa, id_tipo_vehiculo, precio } = req.body;
  
      await db.execute(
        "update tarifas set tipo_tarifa=?, id_tipo_vehiculo=?, precio=? where id_tarifa=? order by id_tarifa",
        [tipo_tarifa, id_tipo_vehiculo, precio, id]
      );
      res.status(200).send(`tarifa modificada`);
      }

    }
  );
  //eliminar tarifa
  tarifas.delete(
    "/tarifas/:id",
    validarId,
    validarJwt,
    validarSuperUsuario,
  async (req, res) => {
    const id = Number(req.params.id);
    await db.execute(
      "delete from tarifas where id_tarifa=?",
      [id]
    );
    res.send("tarifa eliminada");
  })

export default tarifas;