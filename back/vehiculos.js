import express from 'express'
import { db } from './db.js'
export const vehiculosRouter = express.Router()

vehiculosRouter.get('/', async (req,res)=>{
    const filtros = [];
    const parametros = [];

    const id_tipo_vehiculo = req.query.id_tipo_vehiculo;
    if (id_tipo_vehiculo !== undefined) {
        filtros.push("id_tipo_vehiculo = ?");
        parametros.push(id_tipo_vehiculo);
    }

    let sql = "SELECT * FROM vehiculos";
    
    if (filtros.length > 0) {
        sql += ` WHERE ${filtros.join(" AND ")}`;
    }

    console.log(sql)
    const [vehiculos] = await db.execute(sql,parametros)
    res.send({vehiculos})
})