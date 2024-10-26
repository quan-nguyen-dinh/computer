const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: String,
    price: {
      type: BigInt,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      require: true,
    },
    brand: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Brand',
      require: true,
    },
    review: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    subImages: [String],
    shortDescription: String,
    description: String,
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'product' },
);

const Product = mongoose.model('Product', productSchema, { collection: 'product' });

module.exports = Product;
module.exports.ProductSchema = productSchema;
