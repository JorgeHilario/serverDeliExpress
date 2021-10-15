const { Router } = require("express");
const stripe = require("stripe")("sk_test_51IbIdUBJtgmukeJVm9Y2GNa2KScTfwjOpZ9bSUtxG4CqQuFmKnvLKygGRxRqv5GEEheWnR7gQXxQI9IDJBAvU5hk00k9D9f6rF");

const {nuevaOrden, obtenerOrdenes, obtenerOrden, eliminarCollection, actualizarOrden, obtenerOrdenesID, realizarPago} = require('../controllers/ordenController');
const {validarJWTUsuario} = require('../middlewares/validarJWT');


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



router.post('/pagar/:id', realizarPago);

module.exports = router;
