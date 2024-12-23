const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'brand',
  },
);

brandSchema.methods.getAll = function () {
  return this.model('Brand').find();
};

brandSchema.statics.getAll = function () {
  return this.find();
};

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
