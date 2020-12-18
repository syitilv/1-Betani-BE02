const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyers',
        required: true 
    },
    products: [
        {
          productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'crops',
          },
          quantity: Number,
        //   name: String,
        //   price: Number
        }
    ]
}, {
    timestamps: true
});

var Carts = mongoose.model('carts', cartSchema);

module.exports = Carts;