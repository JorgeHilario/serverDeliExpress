const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardsSchema = new Schema({

    nombre:{
        type: String,
        required: true,
        trim: true
    },
    tarjeta:{
        type: Number,
        required: true,
        trim: true
    },
    mes:{
        type: Number,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    cvc:{
        type: Number,
        required: true
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Card', cardsSchema);