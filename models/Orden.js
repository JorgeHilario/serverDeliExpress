const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordenesSchema = new Schema({
    de:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    para:{
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    tiempoEntrega:{
        type: Number,
        default: 0
    },
    aceptado:{
        type: Boolean,
        default: false
    },
    completado:{
        type: Boolean,
        default: false
    },
    enviado:{
        type: Boolean,
        default: false
    },
    entregado:{
        type: Boolean,
        default: false
    },
    pedido:{
        type: Array
    },
    direccion:{
        type: Object,
        required: true
    },
    payMethod:{
        type: String
    },
    creado:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Orden', ordenesSchema);