import express from "express";
import {db} from "./db.js"
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import { validarSuperUsuario } from "./auth.js";



const usuarios = express.Router()

usuarios.get("/usuarios",
  passport.authenticate("jwt", { session: false }),
  validarSuperUsuario,
   async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM usuarios");
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios");
  }
});

usuarios.post("/usuarios",
  body("nombre").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("password").isStrongPassword({
    minLength: 8, // Minino de 8 caracteres (letras y numeros)
    minLowercase: 1, // Al menos una letra minuscula
    minUppercase: 1, // Al menos una letra mayusculas
    minNumbers: 1, // Al menos un numero
    minSymbols: 0, // Sin simbolos
  }),
  async (req, res) => {
    
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }
    const { nombre, apellido, email, telefono, password } = req.body;

    const passwordHashed = await bcrypt.hash(password, 10);
    try {
    const [result] = await db.query(`insert into usuarios(nombre, apellido, email, telefono, password) values(?, ?, ?, ?, ?)`, [
    nombre,
    apellido,
    email,
    telefono,
    passwordHashed,
    ]);

    res.status(201).send({result});

    } catch (error) {
      console.log(error)
      if (error.code === "ER_SIGNAL_EXCEPTION") {
        res.status(400).send("El email ya fue registrado");
      } else {
        res.status(500).send("Error en el servidor");
      }
    }
  });

usuarios.put("/usuarios", async (req, res) => {
  const {email, superusuario} = req.body;

  try {
    const result = await db.query(`UPDATE usuarios SET superusuario = ? WHERE email = ?`, [superusuario, email]);
    res.status(200).send(result);

  } catch (error) {
      res.status(500).send("Error en el servidor");
  }
})

export default usuarios;