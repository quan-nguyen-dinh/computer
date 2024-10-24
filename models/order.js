const mongoose = require('mongoose');
const { ProductSchema } = require('./product');

const orderSchema = new mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      product: ProductSchema,
      quantity: Number,
    },
  ],
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'PROCESSING', 'CANCELLED'],
    default: 'PENDING',
  },
  totalPrice: BigInt,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
