import express from 'express'
import { db } from '../db.js'
import { ExpressValidator, body, validationResult } from 'express-validator'
export const vehiculosRouter = express.Router()

const validarAuto=()=>[
    body("matricula")
    .notEmpty().withMessage('La matricula es obligatoria'),
    body('tipo_vehiculo').isAlpha()
    .notEmpty().withMessage('El tipo de vehiculo es obligatorio')
]

vehiculosRouter.get('/vehiculos', async (req,res)=>{
    const [vehiculos] = await db.execute('select * from vehiculos')
    res.send(vehiculos)
})

vehiculosRouter.post("/vehiculos", validarAuto(),async (req,res)=>{
    const validacion =validationResult(req);
    if (!validacion.isEmpty()){
       return res.status(400).send({errores:validacion.array()})
    }
    const { matricula, tipo_vehiculo } = req.body

    // const [clienteExiste] = await db.execute(
    //     'select id_cliente from clientes where id_cliente=?',[id_cliente]
    // )
    // if (clienteExiste.length==0){
    //     return res.status(404).send("Este cliente no existe")
    // }

    // const [matriculaRepetida]= await db.execute(
    //     'select matricula from vehiculos where matricula=?',[matricula]
    // )
    // if (matriculaRepetida.length>0){
    //     return res.status(400).send('Esta matricula ya esta registrada')
    // }

    // const [vehiculoExiste]= await db.execute(
    //     'select id_tipo_vehiculo from tipos_vehiculo where id_tipo_vehiculo=?',[id_tipo_vehiculo]
    // )
    // if (vehiculoExiste.length==0){
    //     return res.status(400).send("Tipo de vehiculo invalido")
    // }

    const sql = await db.execute(
        "insert into vehiculos (matricula,tipo_vehiculo,estacionado) values(?,?,1)",
        [matricula,tipo_vehiculo]
    )

    res
    .status(201)
    .send({vehiculo:{id_vehiculo:sql.insertId,matricula,tipo_vehiculo}})
})

/*vehiculosRouter.put('/vehiculos/:id_vehiculo/retirar', async (req,res)=>{
    const {id_vehiculo}=req.params

    const [existe]= await db.execute(
        'select * from vehiculos where id_vehiculo=? and estacionado=1',[id_vehiculo])
    if (existe.length==0){
        return res.status(404).send('Vehiculo no encontrado')
    }

    await db.execute('update vehiculos set estacionado=0 where id_vehiculo=?',[id_vehiculo])
    res.status(200).send('Vehiculo retirado')
})*/

/*vehiculosRouter.put('/vehiculos/:id_vehiculo/estacionar', async (req,res)=>{
    const {id_vehiculo}= req.params

    const [existe]= await db.execute(
        'select * from vehiculos where id_vehiculo=? and estacionado=0', [id_vehiculo])
    if (existe.length==0){
        return res.status(404).send('Este vehiculo no se encuentra estacionado')
    }

    await db.execute('update vehiculos set estacionado=1 where id_vehiculo=?',[id_vehiculo])
    res.status(200).send('Vehiculo ingresado')
})*/