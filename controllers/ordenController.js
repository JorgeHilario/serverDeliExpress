const Orden = require('../models/Orden');

exports.nuevaOrden = async (req, res, next) => {
    Orden.init()
    console.log(req.body)

    const { tiempoEntrega, completado, total, orden, creado } = new Orden(req.body)

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