const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    img: String,
    products: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        }
    ]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;