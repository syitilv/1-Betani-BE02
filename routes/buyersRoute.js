const express = require('express');

const Buyer = require('../models/buyers');

const buyers = express.Router();
const {
    userAuth,
    checkRole
  } = require("../utils/Auth");

buyers.route('/')

.get(userAuth, checkRole(["admin"]), async(req, res, next) => {
    Buyer.find()
    .then((buyer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(buyer);
    })
    .catch(err => console.log(err));
})

.post(userAuth, checkRole(["admin"]), async(req, res, next) => {
    Buyer.create(req.body)
    .then((buyer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(buyer);
    })
    .catch(err => console.log(err));
})

.delete(userAuth, checkRole(["admin"]), async(req, res, next) => {
    Buyer.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch(err => console.log(err));
});

buyers.route('/:buyerId')

.get(userAuth, checkRole(["admin", "buyer"]), async(req, res, next) => {
    Buyer.findById(req.params.buyerId)
    .then((buyer) =>{
        if (buyer != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(buyer);
        } else {
            res.statusCode = 403;
            res.end('Not found');
        }
    })
    .catch(err => console.log(err));
})

.put(userAuth, checkRole(["admin", "buyer"]), async(req, res, next) => {
    Buyer.findByIdAndUpdate(req.params.buyerId, {$set: req.body}, {new: true})
        .then((buyer) => {
            if (buyer != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(buyer);
            } else {
                res.statusCode = 403;
                res.end('Not found');
            }
        })
        .catch(err => console.log(err));
})

.delete(userAuth, checkRole(["admin", "buyer"]), async(req, res, next) => {
    Buyer.findByIdAndDelete(req.params.buyerId)
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

module.exports = buyers;