const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var farmerSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nama: {
        type: String,
        required: true
    },
    tanggal_lahir: {
        type: Date
    },
    alamat: {
        type: String
    },
    jenis_kelamin: {
        type: String
    },
    nomor_hp: {
        type: String
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["aktif", "tidak aktif"]
    }
}, {
    timestamps: true
});

var Farmer = mongoose.model('farmer', farmerSchema);

module.exports = Farmer;