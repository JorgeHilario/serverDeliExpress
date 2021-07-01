const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require("../helpers/generarJWT");

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

exports.validarTokenUsuario = async (req, res) =>{
    
    //Generar el JWT
    const token = await generarJWT( req.usuario.id);

    res.json({
        usuario: req.usuario,
        token: token
    })
}

