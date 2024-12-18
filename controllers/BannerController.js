const { uploadToCloudinary } = require("../helper");
const Banner = require("../models/banner");
const BaseError = require("../utils/error");
const { getOffset } = require("../utils/pagination");


async function filterBanner(_, res, next) {
    try {
        const result = await Banner.aggregate([
            {
                $facet: {
                    main: [
                        { $match: { name: "main" } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 3 },
                    ],
                    subs: [
                        { $match: { name: "sub" } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 3 },
                    ],
                    events: [
                        { $match: { name: "event" } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 4 },
                    ],
                },
            },
        ]);
        res.status(200).json({ banner: {
             ...result[0]
        }})
    } catch (error) {
        next(error)
    }
}

async function show(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = getOffset(page, limit);
        const [banners, totalBanners] = await Promise.all(
            ([
                Banner.find({}).skip(offset).limit(limit),
                Banner.countDocuments()
            ])
        );
        res.status(200).json({ banners, totalBanners });
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        let { name, directURL } = req.body;
        let errors = [];
        if (!name) {
            errors.push('Name must be not empty');
        }
        if (!directURL) {
            errors.push('Direct URL must be not empty');
        }
        if (!req.file) {
            errors.push('Thumbnail URL must be not empty')
        }
        if (errors.length > 0) {
            throw new BaseError(409, errors);
        }

        let thumbnailURL = '';
        if (req.file) {
            thumbnailURL = (await uploadToCloudinary(req.file))?.url;
        }
        const banner = new Banner({ name, thumbnailURL, directURL });
        banner.save();
        res.status(200).json({ message: 'Create banner successfully' });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { name, directURL } = req.body;
        if (req.file) {
            thumbnailURL = (await uploadToCloudinary(req.file))?.url;
        } else {
            thumbnailURL = req.body.thumbnailURL;
        }
        await Banner.updateOne({ _id: req.params.id }, { name, directURL, thumbnailURL });
        res.status(200).json({ message: 'Update banner successfully' });
    } catch (error) {
        next(error);
    }
};

async function remove(req, res, next) {
    try {
        const id = req.params.id;
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: 'Delete banner successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    show, create, update, remove, filterBanner
}