const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Restaurant = require('../models/Restaurant');

const validarJWTUsuario = async (req, res, next) =>{

    const token = req.header('x-token')

    if( !token ) {
        return res.status(401).json({
            msg:'No tienes un token'
        })
    }

    try {

        const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY );


        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }

        //Verificar si el uid tiene estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario false'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

        
}

const validarJWTRestaurant = async (req, res, next) =>{

    // const token = req.header('x-token')

    // if( !token ) {
    //     return res.status(401).json({
    //         msg:'No tienes un token'
    //     })
    // }

    // try {

    //     const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY );


    //     //Leer el restaurant que corresponde al uid
    //     const restaurant = await Restaurant.findById(uid);

    //     if(!restaurant){
    //         return res.status(401).json({
    //             msg: 'Token no valido - usuario no existe'
    //         })
    //     }

    //     //Verificar si el uid tiene estado true
    //     if(!restaurant.estado){
    //         return res.status(401).json({
    //             msg: 'Token no valido - usuario false'
    //         })
    //     }

    //     req.restaurant = restaurant;
    //     next();

    // } catch (error) {
    //     console.log(error)
    //     res.status(401).json({
    //         msg: 'Token no válido'
    //     })
    // }

    try {
        
        const token = req.header('x-token');

        if(!token){

            return res.status(401).json({
                ok:false,
                msg: 'No tiene un token'
            });
        }

        const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        req.uid = uid;

        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        })
    }
        
}


module.exports = {
    validarJWTUsuario,
    validarJWTRestaurant
}