const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;


var cropsSchema = new Schema({
    nama_hasil_pertanian: {
        type: String,
        required: true
    },
    kategori_hasil_pertanian: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String
    },
    stok: {
        type: Number, 
        default: 1 
    },
    berat: {
        type: Number,
        default:1000
    },
    harga: {
        type: Currency,
        required: true,
        min: 0
    },
    satuan: {
        type: String,
        required: true
    },
    image : {
        type: String
    },
    id_farmers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmer',
        required: true 
    }
}, {
    timestamps: true
});

var Crops = mongoose.model('Crops', cropsSchema);

module.exports = Crops;