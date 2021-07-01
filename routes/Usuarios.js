const {check} = require('express-validator');
const { Router } = require("express")

const {nuevoUsuario, login, validarTokenUsuario} = require('../controllers/usuarioController');
const { validarJWTUsuario } = require('../middlewares/validarJWT');
const {validarCampos} = require('../middlewares/validations');

const router = Router();

router.post('/nuevo',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'Apellido oblgatorio').not().isEmpty(),
    check('password', 'Contraseña obligatoria').not().isEmpty(), 
    check('email', 'El correo no es válido').isEmail(),
    validarCampos
], nuevoUsuario  
)

router.post('/', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es necesaria').not().isEmpty(),
    validarCampos
],login)


//Revalidar token
router.get('/revalidar',[
    validarJWTUsuario
], validarTokenUsuario);


module.exports = router;