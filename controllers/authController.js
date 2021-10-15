const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const stripe = require("stripe")(process.env.SECRET_KEY);

exports.login = async (req, res = response) =>{

    const { email, password} = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ email })

        if(!usuario){
            return res.json({
                msg:'Usuario o contraseña incorrecta'
            })
        }

        //SI el usuario esta activo
        if(!usuario.estado){
            return res.json({
                msg:'Usuario o contraseña incorrecta - estado: false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password)

        if(!validPassword){
            return res.json({
                msg:'Usuario o contraseña incorrecta - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'Login Ok',
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error del servidor'
        })
    }

}


exports.googleSignIn = async ( req, res) => {

    const {idToken} = req.body

    try {

        const {nombre, img, email, apellido} = await googleVerify(idToken);

        let usuario = await Usuario.findOne({email});
        let customer  = await stripe.customers.create({email: req.body.email});

        if(!usuario){
            //Crearlo
            const data = {
                nombre,
                apellido,
                email,
                password: ':P',
                img,
                customerStripe: customer.id,
                google: true,

            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.online){
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

         //Generar el JWT
         const token = await generarJWT(usuario.id);


        res.json({
            ok:true,
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'Token no pudo ser verificado'
        })
    }

   

}


exports.validarTokenUsuario = async (req, res) =>{
    
    //Generar el JWT
    const token = await generarJWT( req.usuario.id);

    res.json({
        usuario: req.usuario,
        token: token
    })
}

