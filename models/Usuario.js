const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    nombre:{
        type: String,
        required:[true, 'El nombre es obligatorio'],
        trim: true
    },
    apellido:{
        type: String,
        required:[true, 'El apellido es obligatorio'],
        trim: true
    },
    email:{
        type: String,
        required:[true, 'El correo es obligatorio'],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required:[true, 'Contraseña obligatoria'],
        trim:true
    },
    telefono:{
        type: Number,
        
    },
    img: {
        type: String,
    },
    online: {
        type: Boolean,
        default: true
    },
    tipo:{
        type: String,
        default: "Cliente"
    },
    customerStripe:{
        type: String
    },
    google:{
        type: Boolean,
        default: false
    },
    registrado:{
        type: Date,
        default: Date.now
    }
})

usuariosSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id; 
    return usuario;
}

module.exports = mongoose.model('Usuario', usuariosSchema);
