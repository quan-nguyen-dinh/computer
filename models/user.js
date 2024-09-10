const mongoose = require("mongoose");

const defaultProfileImg = 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    require: true,
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  profileImage: {
    type: String,
    default: defaultProfileImg
  },
  userDescription: {
    type: String,
    default: null,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    }
  ],
  cart: {
    lastModify: {
      type: Date,
      default: Date.now
    },
    products: [
      {
        objectId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Product'
        },
        quantity: Number
      }
    ]
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
