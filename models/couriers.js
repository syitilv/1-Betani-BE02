const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var courierSchema = new Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    nama: {
        type: String
    },
    alamat: {
        type: String
    },
    nomor_tlp: {
        type: String
    }
}, {
    timestamps: true
});

var Courier;
try {
  Courier = mongoose.model('Courier', courierSchema);
}
catch(e) {
  Courier = mongoose.model('Courier');
}
module.exports = Courier;