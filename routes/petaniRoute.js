const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// models
const Petani = require('../models/petani');

// routes
var petaniRouter = express.Router();    // inisiasi router

petaniRouter.use(bodyParser.json());

// method API (router kosong)
petaniRouter.route('/')

.post((req, res, next) => {
    Petani.create(req.body)
    .then((tambah) => {
        console.log('Registrasi Petani Berhasil', tambah);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(tambah);
    })
})

.get((req, res, next) => {
    Petani.find({})
    .then((tampil) => {
        res.statusCode = 200;
        res.setHeader('Conten-Type','application/json');
        res.json(tampil);
    })
})

.delete((req, res, next) => {
    Petani.remove()
    .then((hapus) => {
        console.log('Data Semua Petani Berhasil Dihapus');
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(hapus);
    })
})

// method API (router diikuti ID Petani)
petaniRouter.route('/:petaniId')

.get((req, res, next) => {
    Petani.findById(req.params.petaniId)
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
    Petani.findByIdAndUpdate(req.params.petaniId, {$set: req.body}, {new: true})
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
    Petani.findByIdAndDelete(req.params.petaniId)
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
;

module.exports = petaniRouter;