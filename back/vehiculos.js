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

    const [vehiculos] = await db.execute(sql,parametros)
    res.send({vehiculos})
})

vehiculosRouter.post("/", async (req,res)=>{
    const { matricula, id_usuario, id_tipo_vehiculo } = req.body

    if ( !matricula || !id_usuario || !id_tipo_vehiculo){
        return res.status(400).send("Todos los campos deben de llenarse")
    } 

    const sql = await db.execute(
        "insert into vehiculos (matricula,id_usuario,id_tipo_vehiculo) values(?,?,?)",
        [matricula,id_usuario,id_tipo_vehiculo]
    )

    res
    .status(201)
    .send({vehiculo:{id_vehiculo:sql.insertId,matricula,id_usuario,id_tipo_vehiculo}})
})