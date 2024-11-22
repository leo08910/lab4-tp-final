import express from "express";
import {db} from "../db.js"
import { body, validationResult } from "express-validator";
import { validarSuperUsuario,validarJwt } from "../validaciones/validaciones.js"

const clientes = express.Router()

clientes.get('/clientes', async (req,res)=>{
  const [lista]= await db.execute('select * from clientes')
  res.send({lista})
})

clientes.get('/clientes/:id', async (req,res)=>{
  const {id}= req.params

  const [lista] = await db.execute('select * from clientes where id_cliente=?',[id])
  res.send({lista})
})

//crear una cliente
clientes.post("/clientes",
  validarJwt,
  validarSuperUsuario,
  body("nombre").isAlpha().notEmpty(),
  async (req, res) => {
    const validacion = validationResult(req);
    const { nombre } = req.body;
    try {
    const [result] = await db.query(`insert into clientes( nombre) values(?)`,
    [
    nombre
    ]);
    return res.status(201).send({result: "se creo el cliente correctamente"});
    } catch (error) {
      console.log(error)
      if (error.code === "ER_SIGNAL_EXCEPTION") {
        res.status(400).send("bad request");
      } else {
        res.status(500).send("Error en el servidor");
      }
    }
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

  });

export default clientes;