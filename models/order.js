const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    createAt: {
        type: Date,
        default: Date.now
    },
    products: [
      {
        objectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: Number
      }
    ],
    totalPrice: BigInt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;