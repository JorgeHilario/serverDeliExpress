const {check} = require('express-validator');
const { Router } = require("express")

const {guardarTarjeta, traerTarjetas} = require('../controllers/cardController');
const { validarJWTUsuario } = require('../middlewares/validarJWT');

const router = Router();

router.post('/new',[
    validarJWTUsuario
], guardarTarjeta)

router.get('/show/:id',
    traerTarjetas
)


module.exports = router;