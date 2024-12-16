const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            enum: ["main", "sub", "event"]  
        },
        thumbnailURL: {
            type: String,
            require: true
        },
        directURL: {
            type: String,
            require: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: 'banner'
    }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;