const { Router } = require("express")
const {check} = require('express-validator');

const {nuevoRestaurant, loginRestaurant, renewToken, obtenerRestaurants, actualizarMenu, deleteRestaurant} = require('../controllers/restaurantController');
const {validarJWTRestaurant} = require('../middlewares/validarJWT');
const {validarCampos} = require('../middlewares/validations');
const upload = require('../libs/multer');

const router = Router();


router.post('/nuevo', upload.single('imagen'),
    nuevoRestaurant
)

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es necesaria').not().isEmpty(),
    validarCampos
], loginRestaurant)

router.get('/renew', validarJWTRestaurant, renewToken)

router.get('/traerRestaurants', 
    obtenerRestaurants
)

router.put('/actualizarMenu/:id', 
    actualizarMenu
)

router.delete('/quitarRestaurante/:id',
    deleteRestaurant
)

module.exports = router;