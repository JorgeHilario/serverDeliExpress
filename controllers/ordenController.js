const Orden = require('../models/Orden');
const stripe = require("stripe")(process.env.SECRET_KEY);

exports.nuevaOrden = async (req, res, next) => {
    Orden.init()
    console.log(req.body)

    const { tiempoEntrega,  orden} = new Orden(req.body)

    const newOrden = {
        tiempoEntrega,
        completado,
        total,
        orden,
        creado
    }

    const guardarOrden = new Orden(newOrden);

    try {
        await guardarOrden.save((err, ordenStored) => {
            if( err ) res.status(500).send({mssage: `Error al almacenar ${err}`})

            res.status(200).send({orden: ordenStored})
        });
    } catch (error) {
        console.log(error)
        next()
    }

} 

exports.obtenerOrdenes = async (req, res, next) =>{
    try {
        const ordenes = await Orden.find({})
        res.json(ordenes)
    } catch (error) {
        console.log(error)
        next()
    }

}


exports.obtenerOrdenesID = async (req, res, next) =>{


    const {id}  = req.params;

    const query = {'para': id};
    
    try {
        const ordenes = await Orden.find(query)
        console.log(ordenes)
        res.json(ordenes)
    } catch (error) {
        console.log(error)
        next()
    }

}


exports.actualizarOrden = async (req, res, next) => {
    try {
        await Orden.findOneAndUpdate({_id: req.params.id}, req.body)
        res.json({mensaje: 'Se Actualizó'})
    } catch (error) {
        console.log(error)
        next();
    }
}

exports.eliminarCollection = async ( req, res, next ) => {
    await Orden.findByIdAndDelete(req.params.id)
    res.json({mensaje: 'Se elimino el platillo'})
}

exports.obtenerOrden = async (req,res,next) => {
    try {
        const orden = await Orden.findById(req.params.id)
        res.json({orden})
    } catch (error) {
        console.log(error)
    }
}

exports.realizarPago = async (req, res) => {

    const pago = req.body;


    let amount = 0;

    {pago.forEach((item)=>{
        amount += item.precio * item.cantidad;
    })}



    const {id} = req.params;

    //Crear una llave para el usuario 
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: id},
        {apiVersion: '2020-08-27'}
    )
    

    //Crear el intento de pago con el monto de pago, tipo de moneda, y usuario
   
    const paymentIntent = await stripe.paymentIntents.create({
        amount: (amount+25) * 100,
        currency: 'mxn',
        customer: id
    });


    res.json({
        paymentIntent: paymentIntent.client_secret,
        customer: id,
        ephemeralKey: ephemeralKey.secret
    });
}