const Orden = require('../models/Orden');
const Platillo = require('../models/Platillo');
const Restaurant = require('../models/Restaurant');
const Usuario = require('../models/Usuario');


const usuarioConectado = async (uid, tipo) =>{

    if(tipo === 'Restaurante') {

        const restaurant = await Restaurant.findById(uid)

        restaurant.online = true;

        await restaurant.save();

        return restaurant;
    }

    if (tipo === 'Cliente'){

        const cliente = await Usuario.findById(uid)

        cliente.online = true;

        await cliente.save();

        return cliente;
    }
}

const usuarioDesconectado = async (uid, tipo) => {
    
    if(tipo === 'Restaurante'){
        
        const restaurant = await Restaurant.findById(uid)
        restaurant.online = false;

        await restaurant.save();

        return restaurant;
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

    const {id, existencia, restaurant} = data;

    const query = {'restaurant': restaurant}

    try {

        const platillo = await Platillo.findOneAndUpdate({_id: id}, {existencia: existencia}, {new: true})
        
        const platillosActualizados = await Platillo.find(query);

        return platillosActualizados;


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

const guardarPedido = async (payload) =>{
    
    try {
        const pedido = new Orden(payload);
        await pedido.save();

        return pedido;
    } catch (error) {
        console.log(error);

        return false;
    }
}

module.exports = {
    getPlatillos,
    actualizarDisponible,
    getRestaurantes,
    getPlatillosRestaurant,
    usuarioConectado,
    usuarioDesconectado,
    guardarPedido
}