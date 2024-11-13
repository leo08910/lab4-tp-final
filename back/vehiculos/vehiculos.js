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

    const [usuarioExiste] = await db.execute(
        'select id_usuario from usuarios where id_usuario=?',[id_usuario]
    )
    if (usuarioExiste.length==0){
        return res.status(404).send("Este usuario no existe")
    }

    const [vehiculoExiste]= await db.execute(
        'select id_tipo_vehiculo from tipos_vehiculo where id_tipo_vehiculo=?',[id_tipo_vehiculo]
    )
    if (vehiculoExiste.length==0){
        return res.status(400).send("Tipo de vehiculo invalido")
    }

    const sql = await db.execute(
        "insert into vehiculos (matricula,id_usuario,id_tipo_vehiculo) values(?,?,?)",
        [matricula,id_usuario,id_tipo_vehiculo]
    )

    res
    .status(201)
    .send({vehiculo:{id_vehiculo:sql.insertId,matricula,id_usuario,id_tipo_vehiculo}})
})

vehiculosRouter.put('/:id_vehiculo/inhabilitar', async (req,res)=>{
    const {id_vehiculo}=req.params

    const [existe]= await db.execute(
        'select * from vehiculos where id_vehiculo=? and estacionado=1',[id_vehiculo])
    if (existe.length==0){
        return res.status(404).send('Vehiculo no encontrado')
    }

    await db.execute('update vehiculos set estacionado=0 where id_vehiculo=?',[id_vehiculo])
    res.status(200).send('Vehiculo retirado')
})

vehiculosRouter.put('/:id_vehiculo/habilitar', async (req,res)=>{
    const {id_vehiculo}= req.params

    const [existe]= await db.execute(
        'select * from vehiculos where id_vehiculo=? and estacionado=0', [id_vehiculo])
    if (existe.length==0){
        return res.status(404).send('Este vehiculo no se encuentra estacionado')
    }

    await db.execute('update vehiculos set estacionado=1 where id_vehiculo=?',[id_vehiculo])
    res.status(200).send('Vehiculo ingresado')
})