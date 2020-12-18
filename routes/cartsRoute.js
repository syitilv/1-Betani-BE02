const express = require('express');

const Cart = require('../models/carts');
const Crop = require('../models/crops');

const carts = express.Router();

carts.route('/')

.get((req, res, next) => {
    Cart.find()
    .then((cart) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cart);
    })
    .catch(err => console.log(err));
})

.post(async(req, res, next) => {
    // Cart.create(req.body)
    // .then((cart) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(cart);
    // })
    // .catch(err => console.log(err));
    try {
    const data = req.body;
    const userId = data[0].userId;
    const products = data[0].products[0];
    const productId = data[0].products[0].productId;
    const quantity = data[0].products[0].quantity;
    
    let cart = await Cart.findOne({ userId: {$eq: userId} });


    if (cart) {
      //cart exists for user
      console.log('masuk sini');
      let itemIndex = cart.products.findIndex(p => p.productId == productId);
      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity+productItem.quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity});
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
})

.delete((req, res, next) => {
    Cart.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch(err => console.log(err));
});

carts.route('/:cartId')

.get((req, res, next) => {
    Cart.findById(req.params.cartId)
    .then((cart) =>{
        if (cart != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        } else {
            res.statusCode = 403;
            res.end('Not found');
        }
    })
    .catch(err => console.log(err));
})

.put((req, res, next) => {
    Cart.findByIdAndUpdate(req.params.cartId, {$set: req.body}, {new: true})
    .then((cart) => {
        if (cart != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        } else {
            res.statusCode = 403;
            res.end('Not found');
        }
    })
    .catch(err => console.log(err));
})

.delete((req, res, next) => {
    Cart.findByIdAndDelete(req.params.cartId)
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

module.exports = carts;