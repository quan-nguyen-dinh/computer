const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    image: String,
    products: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        }
    ]
});

brandSchema.methods.getAll = function() {
    return this.model('Brand').find();
};

brandSchema.statics.getAll = function() {
    return this.find();
}

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;