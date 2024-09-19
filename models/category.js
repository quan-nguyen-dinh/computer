const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    icon: {
        name: String,
        component: []
    },
    img: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;