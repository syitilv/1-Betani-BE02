const express = require('express');

const Cart = require('../models/carts');

const carts = express.Router();

carts.route('/')

//get all cart (admin)
.get((req, res, next) => {
    Cart.find()
    .then((cart) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cart);
    })
    .catch(err => console.log(err));
})

//add to cart (buyer)
.post(async(req, res, next) => {
    try {
    const data = req.body;
    const userId = data[0].userId;
    const products = data[0].products[0];
    const productId = data[0].products[0].productId;
    const quantity = data[0].products[0].quantity;
    
    let cart = await Cart.findOne({ userId: {$eq: userId} });

    if (cart) {
      let itemIndex = cart.products.findIndex(p => p.productId == productId);
      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity+productItem.quantity;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({ productId, quantity});
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      const newCart = await Cart.create({
        userId,
        products
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
})

// //delete all cart (admin)
// .delete((req, res, next) => {
//     Cart.remove()
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     })
//     .catch(err => console.log(err));
// });

carts.route('/:cartId')

//see carts by id (buyer)
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

//update cart by id (buyer)
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

//delete cart by id (buyer)
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