import express from "express";
import {db} from "../db.js"
import { body, validationResult } from "express-validator";
import { validarId,validarSuperUsuario,validarJwt } from "../validaciones/validaciones.js"

const tarifas = express.Router()
//middleware para validar datos
const validarTarifa=()=>[
  body("tipo_tarifa").notEmpty(),
  body("precio").isFloat().notEmpty(),
]


// traer todas las tarifas.
tarifas.get(
  "/tarifas",
  validarJwt,
  async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT * FROM tarifas
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
  validarTarifa(),
  async (req, res) => {
    const validacion = validationResult(req);
    
    if (req.user.superusuario != 1) {
      return res.status(401).send({mensaje: "No tiene permisos para crear una nueva tarifa"})
    }

    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }
    
    const { tipo_tarifa, precio } = req.body;
    
    try {
    const [result] = await db.query(`insert into tarifas(tipo_tarifa, precio) values(?, ?)`,
    [
    tipo_tarifa,
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
    

  });
  //modificar una tarifa
  tarifas.put("/tarifas/:id",
    validarId,
    validarJwt,
    validarSuperUsuario,
    validarTarifa(),
    async (req, res) => {
      const validacion = validationResult(req);
      
      if (req.user.superusuario != 1) {
        return res.status(401).send({mensaje: "No tiene permisos para ver los usuarios"})
      }

      if (!validacion.isEmpty()) {
        return res.status(400).send({ errores: validacion.array() });
      }

      const id = Number(req.params.id);
      const { tipo_tarifa, precio } = req.body;
  
      await db.execute(
        "UPDATE tarifas SET tipo_tarifa=?, precio=? WHERE id_tarifa=? ORDER BY id_tarifa",
        [tipo_tarifa, precio, id]
      );
      res.status(200).send(`tarifa modificada`);

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