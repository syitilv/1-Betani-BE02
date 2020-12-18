const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// models
const Farmer = require('../models/farmers');

// routes
var farmerRouter = express.Router();    // inisiasi router

const {
    userAuth,
    checkRole
  } = require("../utils/Auth");


farmerRouter.route('/')

// menambahkan data petani
.post((req, res, next) => {
    Farmer.create(req.body)
    .then((tambah) => {
        console.log('Registrasi Petani Berhasil', tambah);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(tambah);
    })
})

// menampilkan semua data petani
.get((req, res, next) => {
    Farmer.find({})
    .then((tampil) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        return res.json(tampil);
    })
})

// menghapus semua data petani
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

// GET BY ID
farmerRouter.route('/:farmerId')    

// method API (router kosong)
farmerRouter.route('/')

.post(userAuth, checkRole(["admin"]), async(req, res, next) => {
    Farmer.create(req.body)
    .then((tambah) => {
        console.log('Registrasi Petani Berhasil', tambah);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(tambah);
    })
})

.get(userAuth, checkRole(["admin"]), async(req, res, next) => {
    Farmer.find({})
    .then((tampil) => {
        res.statusCode = 200;
        res.setHeader('Conten-Type','application/json');
        res.json(tampil);
    })
})

.delete(userAuth, checkRole(["admin"]), async(req, res, next) => {
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

.get(userAuth, checkRole(["admin", "farmer"]), async(req, res, next) => {
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

.put(userAuth, checkRole(["admin", "farmer"]), async(req, res, next) => {
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

.delete(userAuth, checkRole(["admin", "farmer"]), async(req, res, next) => {
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

module.exports = farmerRouter;