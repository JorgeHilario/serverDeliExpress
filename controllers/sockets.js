const Platillo = require('../models/Platillo');
const Restaurant = require('../models/Restaurant');
const Usuario = require('../models/Usuario');


const restaurantConectado = async (uid) => {

    const restaurant = await Restaurant.findById(uid)
    restaurant.online = true;
    await restaurant.save();
 
    return restaurant;

}

const usuarioConectado = async (uid) =>{

    const usuario = await Usuario.findById(uid)
    usuario.online = true;

    await usuario.save();

    return usuario;
}


const getPlatillosRestaurant = async ( id ) => {

    const query = {'restaurant': id}

    const platillos = await Platillo.find(query)

    return platillos;

}

const getPlatillos = async ( ) => {
    
    const platillos = await Platillo.find()

    return platillos;
}

const actualizarDisponible = async (data) => {

    const {id, existencia} = data;

    try {

        const platillo = Platillo.findOneAndUpdate({_id: id}, {existencia: existencia}, {new: true})
        return platillo;

    } catch (error) {
        console.log(error)
        return false;
    }

    
    
}

const getRestaurantes = async () =>{
    const restaurants = await Restaurant
        .find()
        .sort('-online')

    return restaurants;    
}

module.exports = {
    getPlatillos,
    actualizarDisponible,
    getRestaurantes,
    restaurantConectado,
    getPlatillosRestaurant,
    usuarioConectado
}