const express = require('express');
const fs = require('fs'); 

const Transaction = require('../models/transactions');

const transactions = express.Router();

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

transactions.route('/')

//get all transaction (admin)
.get((req, res, next) => {
    Transaction.find()
    .then((transaction) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(transaction);
    })
    .catch(err => console.log(err));
})

//create transaction (buyer)
.post((req, res, next) => {
    var newTransaction = new Transaction(req.body);
    // newTransaction.bukti_pembayaran.data = fs.readFileSync(req.body.bukti_pembayaran);
    newTransaction.bukti_pembayaran.contentType = 'image/png';
    var total = 0;
    req.body.produk.forEach((p) => {
        temp = p.price*p.quantity;
        total = temp+total;
    })
    newTransaction.total = total;
    newTransaction.no_resi = makeid(10);
    newTransaction.status = 'dibayar';
    console.log(newTransaction);
    newTransaction.save().then((transaction) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(transaction);
    })
    .catch(err => console.log(err));
})

//delete all transaction (admin)
.delete((req, res, next) => {
    Transaction.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch(err => console.log(err));
});

transactions.route('/:transaksiId')

//get transaksi by id (buyer)
.get((req, res, next) => {
    Transaction.findById(req.params.transactionId)
    .then((transaction) =>{
        if (transaction != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transaction);
        } else {
            res.statusCode = 403;
            res.end('Not found');
        }
    })
    .catch(err => console.log(err));
})

//delete transaksi by id (buyer)
.delete((req, res, next) => {
    transaction.findByIdAndDelete(req.params.transactionId)
        .then((resp) => {
            if (resp != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            } else {
                res.statusCode = 403;
                res.end('Not found');
            }
        })
        .catch(err => console.log(err));
});

//update transaction status to DITOLAK (farmer)
transactions.route('/:transaksiId/ditolak')
.put((req, res, next) => {
    Transaction.findByIdAndUpdate(req.params.transaksiId, {$set: {'status': 'ditolak'}}, {new: true})
        .then((transaction) => {
            if (transaction != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(transaction);
            } else {
                res.statusCode = 403;
                res.end('Not found');
            }
        })
        .catch(err => console.log(err));
});

//update transaction status to DIPROSES (farmer)
transactions.route('/:transaksiId/diproses')
.put((req, res, next) => {
    Transaction.findByIdAndUpdate(req.params.transaksiId, {$set: {'status': 'diproses'}}, {new: true})
        .then((transaction) => {
            if (transaction != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(transaction);
            } else {
                res.statusCode = 403;
                res.end('Not found');
            }
        })
        .catch(err => console.log(err));
});

//update transaction status to DIKIRIM (courier)
transactions.route('/:transaksiId/dikirim')
.put((req, res, next) => {
    Transaction.findByIdAndUpdate(req.params.transaksiId, {$set: {'status': 'dikirim'}}, {new: true})
        .then((transaction) => {
            if (transaction != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(transaction);
            } else {
                res.statusCode = 403;
                res.end('Not found');
            }
        })
        .catch(err => console.log(err));
})

//update transaction status to SELESAI (buyer)
transactions.route('/:transaksiId/selesai')
.put((req, res, next) => {
    Transaction.findByIdAndUpdate(req.params.transaksiId, {$set: {'status': 'selesai'}}, {new: true})
        .then((transaction) => {
            if (transaction != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(transaction);
            } else {
                res.statusCode = 403;
                res.end('Not found');
            }
        })
        .catch(err => console.log(err));
})


module.exports = transactions;