const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'category',
  },
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
