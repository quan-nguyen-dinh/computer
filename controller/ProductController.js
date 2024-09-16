const Product = require('../models/product');
const { uploadToCloudinary } = require('../helper/index');

class ProductController {
    async show(req, res) {
        try {
            const { offset, limit } = req.params;
            const page = (offset - 1) * limit;
            const products = await Product.find().skip(page).limit(limit);
            res.status(200).json({ products });
        } catch (err) {
            console.log(err);
        }
    }
    async filter(req, res) {
        try {
            const { categoryId, review, minPrice, maxPrice, offset = 1, limit = 10 } = req.query;
            let query = null;
            const page = (offset - 1) * limit;
            if (categoryId) {
                query = Product.where('category').equals(categoryId)
            }
            if (review) {
                query = query.where('review').equals(review);
            }
            if (minPrice && maxPrice) {
                query = query.where('price').gte(minPrice).lte(maxPrice);
                // products = await Product.find({price: {$gte: minPrice}, price: {$lte: maxPrice}});
            } else if (minPrice) {
                query = query.where('price').gte(minPrice);
            } else if (maxPrice) {
                query = query.where('price').lte(maxPrice);
            }
            const products = query.skip(page).limit(limit).exec();
            res.status(200).json({ products });
        } catch (err) {
            console.log(err);
        }
    }
    async create(req, res) {
        try {
            const { name, shortDescription, description, quantity, price } = req.body;
            let primaryImage, subImage = [];
            (req.files || []).forEach(async (image) => {
                const imageUrl = await uploadToCloudinary(image)?.url;
                if (image.fieldname === 'primaryImg') {
                    primaryImage = imageUrl;
                } else {
                    subImage = [...subImage, imageUrl];
                }
            });
            // const result = await uploadToCloudinary(req.files);
            const newProduct = new Product({
                name, image: primaryImage, subImage, shortDescription, description, quantity, price
            });
            await newProduct.save();
            res.status(201).json({ message: 'Create successfully!' });
        } catch (err) {
            console.log(err);
        }
    }
    async detail(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(400).json({ message: 'Product not found' });
            }
            res.status(200).json({ product });
        } catch (err) {
            console.log(err);
        }
    }
    async update(req, res) {
        try {
            const { name, image, shortDescription, description, quantity, price } = req.body;
            await Product.findByIdAndUpdate(req.params.id, {
                name, image, shortDescription, description, quantity, price
            });
            res.status(200).json({ message: 'Update successfully!' });
        } catch (err) {
            console.log(err);
        }
    }
    async delete(req, res) {
        try {
            await Product.deteleOne({ _id: req.params.id });
            res.status(200).json({ message: 'Delete successfully!' })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ProductController();