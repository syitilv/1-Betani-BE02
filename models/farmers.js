const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var farmerSchema = new Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    nama: {
        type: String
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
        type: String
    },
    status: {
        type: String,
        enum: ["aktif", "tidak aktif"]
    }
}, {
    timestamps: true
});

var Farmers;
try {
  Farmers = mongoose.model('Farmers', farmerSchema);
}
catch(e) {
  Farmers = mongoose.model('Farmers');
}
// var Farmer = mongoose.model('farmer', farmerSchema);

module.exports = Farmers;