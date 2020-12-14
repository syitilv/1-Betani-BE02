const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var farmerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nama_petani: {
        type: String,
        required: true
    },
    tanggal_lahir: {
        type: Date,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    jenis_kelamin: {
        type: String,
        required: true
    },
    nomor_hp: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Farmer = mongoose.model('farmer', farmerSchema);

module.exports = Farmer;