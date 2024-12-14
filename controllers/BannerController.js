const { uploadToCloudinary } = require("../helper");
const Banner = require("../models/banner");
const BaseError = require("../utils/error");


async function show(req, res, next) {
    try {
        const banners = await Banner.find({});
        res.status(200).json({ banners });
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        const { name, directURL } = req.body;
        if (name) {
            throw BaseError(404, 'Name must be not null');
        }
        let thumbnailURL = '';
        if(req.file) {
            thumbnailURL = (await uploadToCloudinary(req.file))?.url;
        }
        const banner = new Banner({ name, thumbnailURL, directURL});
        banner.save();
        res.status(200).json({ message: 'Create banner successfully'});
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { name, directURL} = req.body;
        if (req.file) {
            thumbnailURL = (await uploadToCloudinary(req.file))?.url;
        } else {
            thumbnailURL = req.body.thumbnailURL;
        }
        const banner = await Banner.updateOne({ _id: req.params.id }, {name, directURL, thumbnailURL});
        console.log('UPDATE BANNER: ', banner);
        res.status(200).json({ message: 'Update banner successfully'});
    } catch (error) {
        next(error);
    }
};

async function remove(req, res, next) {
    try {
        const id = req.params.id;
        const result = await Banner.findByIdAndDelete(id);
        console.log(result);
        res.status(200).json({ message: 'Delete banner successfully'});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    show, create, update, remove
}