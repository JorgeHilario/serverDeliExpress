const { Router } = require("express")

const {nuevaOrden, obtenerOrdenes, obtenerOrden, eliminarCollection, actualizarOrden} = require('../controllers/ordenController');
const {validarJWTUsuario} = require('../middlewares/validarJWT');

const router = Router();

router.post('/nuevaOrden',[
    validarJWTUsuario
], nuevaOrden
)

router.get('/traerOrdenes',
    obtenerOrdenes
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

router.post('/pago',[validarJWTUsuario], async(req, res)=>{

    console.log(req.body)

    const {tokenStripe, tiempoEntrega, completado, pedido, direccion, restaurant, subtotal, constoEnvio} = req.body;

        const total = subtotal + constoEnvio;

        const charge = await Stripe.charges.create({
            amount: total * 100,
            currency: "mxn",
            source: tokenStripe,
            description: 'Pay Deli Express',
            
        })

        const {status} = charge;

        if(status === 'succeeded'){
            const newOrden = {
                tiempoEntrega,
                completado,
                restaurant,
                pedido,
                direccion,
                creador: req.usuario._id,
                total
            }
    
            const guardarOrden = new Orden(newOrden);
    
            const order =  await guardarOrden.save()

            console.log(order)

            res.json({
                msg:'Pago correcto',
                status,
            })

        }else{
            res.json({
                msg: 'Pago no aprobado'
            })
        }
        
})

module.exports = router;
