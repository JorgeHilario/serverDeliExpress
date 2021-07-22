const { Router } = require("express");
const stripe = require("stripe")("sk_test_51IbIdUBJtgmukeJVm9Y2GNa2KScTfwjOpZ9bSUtxG4CqQuFmKnvLKygGRxRqv5GEEheWnR7gQXxQI9IDJBAvU5hk00k9D9f6rF");

const {nuevaOrden, obtenerOrdenes, obtenerOrden, eliminarCollection, actualizarOrden, obtenerOrdenesID} = require('../controllers/ordenController');
const {validarJWTUsuario} = require('../middlewares/validarJWT');
const Card = require("../models/Card");

const router = Router();

router.post('/nuevaOrden',[
    validarJWTUsuario
], nuevaOrden
)

router.get('/traerOrdenes',
    obtenerOrdenes
)

router.get('/traerOrdenesID/:id',
    obtenerOrdenesID
)

router.get('/traerOrden/:id',
    obtenerOrden
)

router.delete('/borrarOrdenes/:id',
    eliminarCollection
)

router.put('/actualizarOrden/:id',
    actualizarOrden
)

router.post('/crearCliente',[validarJWTUsuario], async(req, res)=>{


    const {uid} = req.body;

    // const total = subtotal + costoEnvio;

    const customer = await stripe.customers.create();

    const {id} = customer;

    const customerStrapi = {
        clienteStripe: id,
        usuario: uid
    }

    const user = await Card.find({'usuario': uid});

    console.log('Usuario',user);

    if(user){

        user.map(async (customer)=>{

            console.log('CUSTOMER',customer)

            const card = await stripe.customers.createSource(
                customer.clienteStripe,
                {source: 'tok_visa'}
            )

            return (res.json({
                msg:'Tarjeta agregada',
                card
            }))

        })

    } else {
        const almacenarCliente = new Card(customerStrapi);

        const client = await almacenarCliente.save();

        console.log('Cliente que se guardó - ', client)
    }

})


router.get('/getCards', async (req, res) => {

    const {uid} = req.body;

    console.log(uid)

    const user = await Card.find({'usuario': uid});

    user.map(async (customer)=>{

        const cards = await stripe.customers.listSources(
            customer.clienteStripe,
            {object: 'card'}
        )

        return (res.json({
            msg:'Tarjeta agregada',
            cards
        }))

    })

    

})

module.exports = router;
