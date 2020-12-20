const express = require('express');
const multer = require("multer");
// const path = require('path');
var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public")
    },
    filename: function (req, file, cb) {
        const parts = file.mimetype.split("/");
        cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
    }
})

const upload = multer({storage});

const uploads = require('../routes/upload');

// Return only base file name without dir
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    });
}

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


.post(async (req, res) => {
    try {
        // var imgPath = getMostRecentFileName(path.join(__dirname, '../public',));
        var newTransaction = new Transaction(req.body);
        // newTransaction.file.data = imgPath;
        newTransaction.file.contentType = 'image/png';
        var total = 0;
        req.body.produk.forEach((p) => {
            temp = p.price*p.quantity;
            total = temp+total;
        })
        newTransaction.total = total;
        newTransaction.no_resi = makeid(10);
        newTransaction.status = 'dipesan';
        console.log(newTransaction);
        newTransaction.save().then((transaction) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transaction);
        })
        next();
    } catch (error) {
        return error;
    }
})

//create transaction (buyer)
// .post(uploads,(req, res, next) => {
//     var newTransaction = new Transaction(req.body);
//     // newTransaction.file.data = fs.readFileSync(req.body.file);
//     newTransaction.file.contentType = 'image/png';
//     var total = 0;
//     req.body.produk.forEach((p) => {
//         temp = p.price*p.quantity;
//         total = temp+total;
//     })
//     newTransaction.total = total;
//     newTransaction.no_resi = makeid(10);
//     newTransaction.status = 'dibayar';
//     console.log(newTransaction);
//     newTransaction.save().then((transaction) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(transaction);
//     })
//     .catch(err => console.log(err));
// })

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

//update transaction status to DIBAYAR (farmer)
transactions.route('/:transaksiId/dibayar')
.put((req, res, next) => {
    Transaction.findByIdAndUpdate(req.params.transaksiId, {$set: {'status': 'dibayar'}}, {new: true})
        .then((transaction) => {
            if (transaction != null) {
                const imgPath = getMostRecentFileName(path.join(__dirname, '../public'));
                var newTransaction = new Transaction(transaction);
                newTransaction.file.data = imgPath;
                newTransaction.save();
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