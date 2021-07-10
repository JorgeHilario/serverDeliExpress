const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');


exports.nuevoUsuario = async(req, res) => {

    try {

        const { nombre, apellido, email, password, telefono } = req.body;

        const newUsuario = {
            nombre,
            apellido,
            email,
            password,
            telefono
        }

    
        //verificar que no exista el correo
        const emailExist = await Usuario.findOne({email});

        if(emailExist){
            return res.status(400).json({
                msg: 'El correo ya existe'
            })
        }

        const usuario = new Usuario(newUsuario);
        
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
    
        //Guardar en la base de datos
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({usuario, token, message: 'Usuario agregado'})

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }   

    
} 

exports.obtenerUsuarios = async (req, res) =>{

    const query = {estado: true};

    // const usuarios = await Usuario.find(query)
    // const totalUsuarios = await Usuario.countDocuments(query)

    const [ totalUsuarios, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ])

    res.json({
        
        totalUsuarios,
        usuarios,
    })
}

exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { _id, password, ...resto} = req.body;

    //Validar contra db
    if(password){
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        msg: 'Se actualizo',
        usuario
    })
}

exports.elimiarUsuario = async (req, res) => {
    
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false});

    res.json(usuario);
}

exports.validarTokenUsuario = async (req, res) =>{
    
    const uid = req.uid;
 
    //Obtener usuario por uid
    const user = await Usuario.findById( uid )

    const {tipo, nombre} = user;

    console.log(nombre)
    console.log(tipo)

    const token = await generarJWT(uid, tipo);

    const usuario = await Usuario.findById(uid)

    res.json({
        ok: true,
        usuario,
        token
    })
}

exports.login = async (req, res = response) =>{

    const { email, password } = req.body;

    console.log(req.body)

    try {

        //Verificar si el correo existe
        const usuarioDB = await Usuario.findOne({ email })

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg:'Usuario no existe'
            })
        }


        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuarioDB.password)

        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg:'Usuario o contraseña incorrecta'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuarioDB.id, usuarioDB.tipo);


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor'
        })
    }

}