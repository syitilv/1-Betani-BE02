const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var buyerSchema = new Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    nama_pembeli: {
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
    status: {
        type: String
    }
}, {
    timestamps: true
});

var Buyers;
try {
  Buyers = mongoose.model('buyers', buyerSchema);
}
catch(e) {
  Buyers = mongoose.model('buyers');
}

// var Buyers = mongoose.model('buyers', buyerSchema);

module.exports = Buyers;