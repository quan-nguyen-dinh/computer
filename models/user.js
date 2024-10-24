const mongoose = require('mongoose');
const Product = require('./product');
const { ProductSchema } = require('./product');

const defaultProfileImg = 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    require: true,
    default: 'user',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  profileImage: {
    type: String,
    default: defaultProfileImg,
  },
  userDescription: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  cart: {
    lastModify: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        product: ProductSchema,
        quantity: Number,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});

const User = mongoose.model('User', userSchema, { collection: 'user' });

module.exports = User;
