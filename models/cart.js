const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  lastModify: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: Product,
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema, { collection: 'cart' });

module.exports = Cart;
