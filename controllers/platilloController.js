const cloudinary = require('cloudinary').v2;
const Platillo = require('../models/Platillo'); 
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


exports.nuevoPlatillo = async (req, res, next) => {


    console.log(req.body);
    
    const img = req.file.path;


    const {nombre, precio, categoria, existencia, restaurant, descripcion} = new Platillo(req.body);

    
    const result = await cloudinary.uploader.upload(img)
    console.log(result)    

    const newPlatillo = new Platillo({
        nombre,  
        precio,
        categoria,
        existencia,
        restaurant,
        imagen: result.url,
        descripcion,
        public_id: result.public_id
    })

    console.log(newPlatillo)
    
    try {
        await newPlatillo.save();
        res.json({mensaje: 'El platillo se agregó correctamente'})    
        await fs.remove(img);
        console.log("Imagen se eliminó")
    } catch (error) {
        console.log(error)
    }
    
    
}


exports.obtenerPlatillos = async (req, res, next) => {
    
    const algo = await Promise.all([
        Platillo.find({})
        .populate('restaurant', 'nombre')
    ])

    console.log(algo)
   

    //     try {
    //         const platillos = await Platillo.find({})

    //         res.json(platillos)
    //     } catch (error) {
    //         console.log(error);
    //         next();
    //     }
}

//Obtener un solo platillo
exports.obetenerPlatillosPorRestaurant = async (req, res) => {

    const {id} = req.params;

    try {
        const platillo = await Platillo.find({'restaurant':id})
       
        res.status(200).json({
            ok:true,
            platillo
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Error del servidor'
        })
    }
}

exports.actualizarDisponible = async (req, res) => {
    
    const id = req.params.id
    const actualizar =  req.body;

    P

    console.log('ID que vamos a actualizar: ', id)

    console.log('Esto se va actualizar', actualizar)

    // try {
    //     const productUpdate = await Platillo.findOneAndUpdate(id, actualizar)
    //     res.status(200).json({mensaje: 'Se Actualizó', productUpdate})
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({
    //         msg:'Error al actualizar'
    //     })
    // }
   

}

exports.deletePlatillo = async (req, res) => {
    await Platillo.findByIdAndDelete(req.params.id)
    res.json({mensaje: 'Se elimino el platillo'})
}