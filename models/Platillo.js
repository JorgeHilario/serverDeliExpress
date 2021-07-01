const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platillosSchema = new Schema({
    nombre: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
    },
    categoria: {
        type: String,
        trim: true
    },
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    imagen: {
        type: String,
    },
    existencia:{
        type: Boolean,
    },

    descripcion:{
        type: String,
    }
});


module.exports = mongoose.model('Platillo', platillosSchema);