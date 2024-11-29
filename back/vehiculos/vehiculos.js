import express from 'express'
import { db } from '../db.js'
export const vehiculosRouter = express.Router()


vehiculosRouter.get('/vehiculos', async (req,res)=>{
    const [vehiculos] = await db.execute('select * from vehiculos')
    res.send(vehiculos)
})

vehiculosRouter.post("/vehiculos", async (req,res)=>{
    const { matricula, id_tipo_vehiculo} = req.body

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

    await db.execute('update vehiculos set estacionado=0 where matricula=?',[matricula])
    res.status(200).send('Vehiculo retirado')
})

vehiculosRouter.put('/vehiculos/estacionar', async (req,res)=>{
    const {matricula}= req.body

    await db.execute('update vehiculos set estacionado=1 where matricula=?',[matricula])
    res.status(200).send('Vehiculo ingresado')
})