const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardsSchema = new Schema({

    clienteStripe:{
        type: String,
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    creado:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Card', cardsSchema);