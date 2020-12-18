const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var adminSchema = new Schema({
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

var Admin;
try {
  Admin = mongoose.model('Admin', adminSchema);
}
catch(e) {
  Admin = mongoose.model('Admin');
}
module.exports = Admin;