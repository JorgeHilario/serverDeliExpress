const Direccion = require('../models/Direccion');

exports.nuevaDireccion = async (req, res) =>{

    const {id} = req.params;

    console.log("REQUEST:",id)

    const {colonia, calle, codigoPostal} = req.body;

    const newDireccion = {
        colonia,
        calle,
        cp: codigoPostal,
        usuario: id
    }

    const direccion = new Direccion(newDireccion);

    await direccion.save();

    res.json({
        ok:true,
        msg: 'Direccion registrada'
    })

}


exports.direccionesUsuario = async (req, res) =>{

    const {id} = req.params;

    const query = {'usuario': id}

    try {
        
        const direcciones = await Direccion.find(query)

        res.json({
            ok: true,
            direcciones
        })

    } catch (error) {   
        console.log(error)
    }

}