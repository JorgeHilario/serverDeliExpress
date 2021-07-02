const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantsSchema = new Schema({
    nombre: {
        type: String,
        required:[true, 'El nombre del restaurant es requerido'],
        trim: true
    },
    direccion:{
        type: String,
        required:[true, 'El dirección del restaurant es requerido'],
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
    descripcion: {
        type: String,
        required:[true, 'Añade una descripción de tu restaurant'],
    },
    categoria:{
        type: String,   
    },
    imagen: {
        type: String
    },
    telefono:{
        type: Number,
        required:[true, 'Agrega el numero de telefono del restaurant'],
    },
    online: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    registrado:{
        type: Date,
        default: Date.now
    }
});

restaurantsSchema.methods.toJSON = function(){
    const { __v, password, _id, estado, email, registrado, telefono, ...restaurant} = this.toObject();
    restaurant.uid = _id;
    return restaurant;
}

module.exports = mongoose.model('Restaurant', restaurantsSchema)