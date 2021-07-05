const cloudinary = require('cloudinary');
const Restaurant = require('../models/Restaurant');
const bcryptjs = require('bcryptjs');
const fs = require('fs-extra');
const { generarJWT } = require("../helpers/generarJWT");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

exports.nuevoRestaurant = async (req, res, next) => {
        
    const { nombre, direccion, email, password, categoria, descripcion, telefono} = new Restaurant(req.body);

    const result = await cloudinary.v2.uploader.upload(req.file.path)

    const newRestaurant = {
        nombre,
        direccion,
        email,
        password,
        descripcion,
        categoria, 
        imagen: result.url,
        telefono,
        public_id: result.public_id
    }

    const restaurant = new Restaurant(newRestaurant);

    //verificar que no exista el correo
    const emailExist = await Restaurant.findOne({email});
    if(emailExist){
        return res.status(400).json({
            msg: 'Este correo ya se registró'
        })
    }

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    restaurant.password = bcryptjs.hashSync(password, salt)

    //Guardar en la base de datos
    try {
        await restaurant.save();
        res.json({restaurant, message: 'Restaurant resgistrado'})
        await fs.remove(req.file.path);
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}

exports.obtenerRestaurants = async (req, res, next) => {

    const query = {estado: true}

    const [totalRestaurants, restaurants] = await Promise.all([
        Restaurant.countDocuments(),
        Restaurant.find()
    ])


    res.json({
        totalRestaurants,
        restaurants
    })

}



exports.actualizarMenu = async (req, res) => {

    const {id} = req.params;

    console.log(req.params.id)
    try {
        await Restaurant.findByIdAndUpdate(id, req.boby)
       
        res.json({msg: 'El menú se actualizó'})
    } catch (error) {
        console.log(error)
    }
    
}

exports.deleteRestaurant = async (req, res) => {
    await Restaurant.findByIdAndDelete(req.params.id)
    res.json({mensaje: 'Se elimino el platillo'})
}

exports.loginRestaurant = async(req, res) => {
    const {email, password} = req.body;

    try {

        //Verificar si el correo existe
        const restaurant = await Restaurant.findOne({email});

        if(!restaurant){
            return res.json({
                msg: 'Correo o contraseña incorrecta'
            })
        }

        //Verificar contraseña
        const validarPassword = bcryptjs.compareSync(password, restaurant.password);

        if(!validarPassword){
            return res.json({
                msg: 'Correo o contraseña incorrecta - PASSWORD'
            })
        }

        //Generar el JWT
        const token = await generarJWT(restaurant.id, restaurant.tipo); 

        res.json({
            msg: 'Login OK',
            restaurant,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error del servidor'
        })
    }
}

exports.renewToken = async (req, res) =>{

    const uid = req.uid;

    const usuario = await Restaurant.findById(uid);

    console.log('RENEWTOKEN', usuario);

    const {tipo, nombre} = usuario;

    console.log(nombre)
    console.log(tipo)

    //Generar el JWT
    const token = await generarJWT(uid, tipo);

    const restaurant = await Restaurant.findById(uid)

    res.json({
        ok: true,
        restaurant,
        token
    })
}