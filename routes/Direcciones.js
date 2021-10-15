const {Router} = require('express');

const {nuevaDireccion, direccionesUsuario} = require('../controllers/direccionController')

const router = Router();


router.post('/nueva/:id', nuevaDireccion);

router.get('/:id', direccionesUsuario);

module.exports = router;