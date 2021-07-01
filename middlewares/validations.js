const {validationResult} = require('express-validator');
const Usuario = require('../models/Usuario');

const validarCampos = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();
}

const existeUsuarioPorId = async(id)=>{
    const existeUsuario = Usuario.findById(id)
    if(!existeUsuario){
        throw new Error('No existe usuario con este ID')
    }
}

module.exports = {
    validarCampos,
    existeUsuarioPorId
}