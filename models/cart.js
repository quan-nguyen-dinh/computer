const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    lastModify: {
        type: Date,
        default: Date.now
    },
    products:[
        {
            objectId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ]
});

