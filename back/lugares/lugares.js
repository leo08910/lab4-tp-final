import express, { query } from "express";
import { body, param, validationResult } from "express-validator";
import { db } from '../db.js';

export const LugaresRouter = express.Router();


// Obtener la lista de lugares y su estado de ocupación
LugaresRouter.get('/', async (req, res) => {
    try {
        let sql = 'SELECT l.id_lugar, l.ocupado FROM lugares l';
        const [lugares] = await db.query(sql);
        res.status(200).send(lugares);
    } catch (error) {
        res.status(500).send({ mensaje: 'No llegaron los lugares' });
    }
});

// Registrar un vehículo en un lugar si hay espacio disponible

const validarConsulta = () => [
    param("id_lugar").isInt({ min: 1 }).notEmpty().withMessage("El ID del lugar debe ser un número entero positivo."),
    (req, res, next) => {
        //Pide ponerlo aca para encapsular el manejo de validaciones asegura q se procese antes de llegar a otras capas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errores: errors.array() });
        }
        next();
    }
];

const validacionesLugares = async (req, res, next) => {
    try {
        const { id_lugar } = req.params;

        // Verificar si el lugar pasado x la ruta  estaa ocupado
        const [[LugarVerif]] = await db.query('SELECT ocupado FROM lugares WHERE id_lugar = ?', [id_lugar]);
        if (!LugarVerif || LugarVerif.ocupado === 1) {
            return res.status(400).send({ mensaje: 'El lugar que deseas estacionar ya está ocupado.' });
        }

        next();
    } catch (error) {
        console.error("Error en las validaciones de lugares:", error);
        res.status(500).send({ mensaje: 'Error al validar los lugares.' });
    }
};

LugaresRouter.put('/:id_lugar/ocupar', validarConsulta(), validacionesLugares, async (req, res) => {
    try {
        const { id_lugar } = req.params;

        // Ocupo el lugar especificado previamente 
        await db.query('UPDATE lugares SET ocupado = 1 WHERE id_lugar = ?', [id_lugar]);

        res.status(201).send({ mensaje: 'Lugar ocupado exitosamente.' });
    } catch (error) {
        console.error("Error en la API al querer ocupar un lugar:", error);
        res.status(500).send({ mensaje: 'Error en la API al querer ocupar un lugar.' });
    }
});



// Liberar un lugar cuando el vehículo sale
LugaresRouter.put('/:id_lugar/desocupar',validarConsulta(), async (req, res) => {
    const {id_lugar} = req.params
    try{

        //Desocupo el lugar pasado x la ruta
        await db.query('UPDATE lugares set ocupado = 0 where id_lugar = ?',[id_lugar])

        res.status(201).send({mensaje : 'Se desocupo el lugar exitosamente'})
    }catch(error){
        console.error('Error en la API al querer desocupar uin lugar')
        res.status(500).send({mensaje : 'Error en la API al querer desocupar uin lugar '})
    }

});