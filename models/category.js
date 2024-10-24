const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema, { collection: 'category' });

module.exports = Category;
