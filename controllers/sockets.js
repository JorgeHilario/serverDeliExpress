const Platillo = require('../models/Platillo');
const Restaurant = require('../models/Restaurant');
const Usuario = require('../models/Usuario');


const usuarioConectado = async (uid, tipo) =>{

    if(tipo === 'Restaurante') {

        const restaurant = await Restaurant.findById(uid)

        console.log("este es el restaurant",restaurant)

        restaurant.online = true;

        await restaurant.save();

        return restaurant;
    }

    if (tipo === 'Cliente'){

        const cliente = await Usuario.findById(uid)

        console.log('Este es el cliente', cliente)

        cliente.online = true;

        await cliente.save();

        return cliente;
    }
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
    getPlatillosRestaurant,
    usuarioConectado
}