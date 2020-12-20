const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
    id_pembeli: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    produk: [{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'crops',
        },
        quantity: Number,
        name: String,
        price: Number
    }],
    total: {
        type: Number
    },
    alamat_pengiriman: {
        type: String,
        required: true
    },
    id_kurir: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'couriers'
    },
    no_resi: {
        type: String,
    },
    file: {
        data: Buffer,
        contentType: String
    },
    status: {
        type: String,
        enum: ["dipesan", "dibayar", "diproses", "ditolak", "dikirim", "selesai"]
    }
}, {
    timestamps: true
});

var Transactions = mongoose.model('transactions', transactionSchema);

module.exports = Transactions;