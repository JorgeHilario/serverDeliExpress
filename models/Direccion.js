
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const direccionSchema = new Schema({

    colonia:{
        type: String
    },
    calle:{
        type: String
    },
    cp:{
        type: Number
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

})

module.exports = mongoose.model('Direccion', direccionSchema);