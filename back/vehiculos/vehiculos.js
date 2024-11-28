import express from 'express'
import { db } from '../db.js'
import { ExpressValidator, body, validationResult } from 'express-validator'
export const vehiculosRouter = express.Router()


vehiculosRouter.get('/vehiculos', async (req,res)=>{
    const [vehiculos] = await db.execute('select * from vehiculos')
    res.send(vehiculos)
})

vehiculosRouter.post("/vehiculos", async (req,res)=>{
    const validacion =validationResult(req);
    if (!validacion.isEmpty()){
       return res.status(400).send({errores:validacion.array()})
    }
    const { matricula, id_tipo_vehiculo} = req.body

    const [matriculaRepetida]= await db.execute(
        'select matricula from vehiculos where matricula=?',[matricula]
    )
    if (matriculaRepetida.length>0){
        return res.status(400).send('Esta matricula ya esta registrada')
    }

    const sql = await db.execute(
        "insert into vehiculos (matricula,id_tipo_vehiculo,estacionado) values(?,?,1)",
        [matricula,id_tipo_vehiculo]
    )

    res
    .status(201)
    .send({vehiculo:{id_vehiculo:sql.insertId,matricula,id_tipo_vehiculo}})
})

vehiculosRouter.put('/vehiculos/retirar', async (req,res)=>{
    const {matricula}=req.body

    console.log(matricula)
    const [existe]= await db.execute(
        'select * from vehiculos where matricula=? and estacionado=1',[matricula])
    if (existe.length==0){
        return res.status(404).send('Vehiculo no encontrado')
    }

    await db.execute('update vehiculos set estacionado=0 where matricula=?',[matricula])
    res.status(200).send('Vehiculo retirado')
})

vehiculosRouter.put('/vehiculos/estacionar', async (req,res)=>{
    const {matricula}= req.body

    const [existe]= await db.execute(
        'select * from vehiculos where matricula=? and estacionado=0', [matricula])
    if (existe.length==0){
        return res.status(404).send('Este vehiculo no se encuentra estacionado')
    }

    await db.execute('update vehiculos set estacionado=1 where matricula=?',[matricula])
    res.status(200).send('Vehiculo ingresado')
})