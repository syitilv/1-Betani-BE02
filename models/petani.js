const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var petaniSchema = new Schema({
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

var Petani = mongoose.model('petani', petaniSchema);

module.exports = Petani;