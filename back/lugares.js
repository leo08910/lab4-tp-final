import express from "express";
import { body, validationResult } from "express-validator";
import { db } from './db.js';

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
LugaresRouter.post('/ocupar', 
    body("id_vehiculo").isInt().notEmpty(),
    body("id_lugar").isInt().notEmpty(),
    async (req, res) => {
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
          res.status(400).send({ errores: validacion.array() });
          return;
        }
    try{
        const { id_vehiculo, id_lugar } = req.body;
        // Cuento los lugares disp con el query y verifico para q no pase de los lugares q quiero tener
        const [[{ ocupados }]] = await db.query('SELECT COUNT(*) AS ocupados FROM lugares WHERE ocupado = 1');
        if (ocupados >= 5) {
            return res.status(400).send({ mensaje: 'No hay lugares disponibles. Máximo alcanzado de 5 lugares ocupados.' });
        }

        // Verificar que el lugar esté libre
        const [[lugar]] = await db.query('SELECT ocupado FROM lugares WHERE id_lugar = ?', [id_lugar]);
        if (!lugar || lugar.ocupado === 1) {
            return res.status(400).send({ mensaje: 'El lugar ya está ocupado'}) 
        }

       // Ocupo el lugar asignado al id que se paso x el body 
        await db.query('UPDATE lugares SET ocupado = 1 WHERE id_lugar = ?', [id_lugar]);


        // Inserción en la tabla de registros usando id_tarifa
        await db.query(
            'INSERT INTO registros (id_lugar, id_vehiculo, inicio, id_tarifa) VALUES (?, ?, NOW(), ?)',
            [id_lugar, id_vehiculo]
        );
        

        res.status(201).send({ mensaje: 'Lugar ocupado exitosamente.' });
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).send({ mensaje: 'Error al ocupar el lugar.' });
    }
});

// Liberar un lugar cuando el vehículo sale
LugaresRouter.post('/liberar', async (req, res) => {
    try {
        const { id_lugar } = req.body;

        // Verificar que el lugar esté ocupado
        const [[lugar]] = await db.query('SELECT ocupado FROM lugares WHERE id_lugar = ?', [id_lugar]);
        if (!lugar || lugar.ocupado === 0) {
            return res.status(400).send({ mensaje: 'El lugar ya está libre ' });
        }

        // Liberar el lugar
        await db.query('UPDATE lugares SET ocupado = 0 WHERE id_lugar = ?', [id_lugar]);
        await db.query(
            'UPDATE registros SET fin = NOW() WHERE id_lugar = ? AND fin IS NULL',
            [id_lugar]
        );

        res.status(200).send({ mensaje: 'Lugar liberado exitosamente.' });
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).send({ mensaje: 'Error al liberar el lugar.' });
    }
});