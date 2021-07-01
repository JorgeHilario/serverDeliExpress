const Card = require('../models/Card');
const bcryptjs = require('bcryptjs');

exports.guardarTarjeta = async (req, res) =>{

    const {nombre, tarjeta, mes, year, cvc} = req.body;

    const newCard = {
        nombre,
        tarjeta,
        mes,
        year,
        cvc,
        usuario: req.usuario._id
    }

    const card = new Card(newCard);

    // //Encriptar cvc
    // const salt = bcryptjs.genSaltSync();
    // card.cvc = bcryptjs.hashSync(cvc, salt);

    try {
        const resp = await card.save()

        res.json({
            mdg: 'Tarjeta agregada',
            resp
        })
    } catch (error) {
        console.log(error)
        res.json(
            error
        )
    }
    
}

exports.traerTarjetas = async (req, res) =>{

    const {id} = req.params;

    const query = {'usuario': id}

    const [tarjetas] = await Promise.all([
        Card.find(query)
            .populate('usuario', 'nombre')
    ])

    res.json({
        tarjetas
    })
}