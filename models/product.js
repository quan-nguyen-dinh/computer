const mongoose = require('moongose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: String,
    price: {
        type: BigInt,
        require: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    review: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    subImages: [String],
    shortDescription: String,
    description: String,
    quantity: {
        type: Number,
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    // orders: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Order'
    //     }
    // ]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;