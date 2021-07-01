const { Router } = require("express")

const {nuevoPlatillo, obtenerPlatillos, obetenerPlatillosPorRestaurant, actualizarDisponible, deletePlatillo}= require('../controllers/platilloController');
const upload = require('../libs/multer');

const router = Router();

router.post('/nuevo', upload.single('imagen'), 
    nuevoPlatillo
)


router.get('/obtenerTodos',
    obtenerPlatillos
)

router.get('/obtenerporRestaurant/:id',
    obetenerPlatillosPorRestaurant
)

router.put('/actualizarDisponible/:id',
    actualizarDisponible
)

router.delete('/borrarPlato/:id',
    deletePlatillo
)

module.exports = router;