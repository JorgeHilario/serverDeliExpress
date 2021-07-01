const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordenesSchema = new Schema({
    
    tiempoEntrega:{
        type: Number
    },
    completado:{
        type: Boolean,
        default: false
    },
    total:{
        type: Number
    },
    pedido:{
        type: Array
    },
    direccion:{
        type: Object,
        required: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Orden', ordenesSchema);