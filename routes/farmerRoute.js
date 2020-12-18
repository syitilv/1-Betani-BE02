const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const cors = require('cors');   // added
// const weather = require("./weather");   // added

// models
const Farmer = require('../models/farmers');

// routes
var farmerRouter = express.Router();    // inisiasi router

// petaniRouter.use(bodyParser.json());
// petaniRouter.use(cors());

// var app = express;    // added

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// method API (router kosong)
farmerRouter.route('/')

.post((req, res, next) => {
    Farmer.create(req.body)
    .then((tambah) => {
        console.log('Registrasi Petani Berhasil', tambah);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(tambah);
    })
})

.get((req, res, next) => {
    Farmer.find({})
    .then((tampil) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        return res.json(tampil);
    })
})

.delete((req, res, next) => {
    Farmer.remove()
    .then((hapus) => {
        console.log('Data Semua Petani Berhasil Dihapus');
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(hapus);
    })
})

// method API (router diikuti ID Petani)
farmerRouter.route('/:farmerId')

.get((req, res, next) => {
    Farmer.findById(req.params.farmerId)
    .then((tampil) => {
        if(tampil == null){
            res.statusCode = 403;
            res.end('Data Petani Yang Dicari Tidak Ditemukan!');
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(tampil);
        }
    });
})

.put((req, res, next) => {
    Farmer.findByIdAndUpdate(req.params.farmerId, {$set: req.body}, {new: true})
    .then((update) => {
        if(update == null){
            res.statusCode = 403;
            res.end('Data Petani Yang Dicari Tidak Ditemukan!');
        }else{
            res.statusCode = 200;
            res.json(update);
        }
    });
})

.delete((req, res, next) => {
    Farmer.findByIdAndDelete(req.params.farmerId)
    .then((hapus) => {
        if(hapus == null){
            res.statusCode = 403;
            res.end('Data Petani Yang Dicari Tidak Ditemukan!');
        }else{
            hapus.save();
            res.end('Data Petani Berhasil Dihapus');
        }
    });
})

// // method API (router diikuti cuaca)
// petaniRouter.route('/:cuaca')
// .get((req, res, next) => {
//     Petani.find(req.params.cuaca)
//     .then(() => {
//         const oneDayInMs = 86400000;
//         setInterval(() => weather.get(), oneDayInMs);
//     })
// })
;

// app.route('/weather')
// resource.get().then(() => {
//     render('index');
// });
// app.get('/weather', weather.index);

// app.route('/')
// resource.get().then(() => {
//     const oneDayInMs = 86400000;
//     setInterval(() => weather.get(), oneDayInMs);
// });

// app.listen(3000, function () {
//     console.log('Example app listening on port 4000!');

//     resource.get()
//         .then(() => {
            // const oneDayInMs = 86400000;
            // setInterval(() => weather.get(), oneDayInMs);
//         });
// });

// app.listen(4000, function () {
// // Update
//     resource.get()
//         .then(() => {
//             const oneDayInMs = 86400000;
//             setInterval(() => weather.get(), oneDayInMs);
//         });
// });

module.exports = farmerRouter;