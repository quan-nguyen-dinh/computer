const Product = require('../models/product');
const { uploadToCloudinary } = require('../helper/index');

class ProductController {
    async show(req, res) {
        try {
            const { offset, limit } = req.query;
            const page = (offset - 1) * limit;
            const products = await Product.find().populate("category", "name").skip(page).limit(limit);
            res.status(200).json({ products });
        } catch (err) {
            console.log(err);
        }
    }
    async filter(req, res) {
        try {
            const { productName, brandName, sortBy, priceMin, priceMax, categoryId, review, offset = 1, limit = 10 } = req.query;
            let query = Product.find({});
            const page = (offset - 1) * limit;
            console.log('page: ', productName);
            console.log('query: ', req.query);
            if (productName) {
                query = query.find({ name: { $regex: productName, $options: 'i' } })
            }
            if (categoryId) {
                query = query.where('category').equals(categoryId)
            }
            switch (sortBy) {
                case 'latest_items':
                    query = query.sort({ createAt: -1 });
                    break;
                case 'price_low_to_high':
                    query = query.sort({ price: 1 });
                    break;
                case 'price_hight_to_low':
                    query = query.sort({ price: -1 });
                    break;
                default:
                    break;
            }
            if (review) {
                query = query.where('review').equals(review);
            }
            if (priceMin && priceMax) {
                query = query.where('price').gte(priceMin).lte(priceMax);
            } else if (priceMin) {
                query = query.where('price').gte(priceMin);
            } else if (priceMax) {
                query = query.where('price').lte(priceMax);
            }
            const products = await query.skip(page).limit(limit).exec();
            console.log('products: ', products);
            res.status(200).json({ products });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
    async create(req, res) {
        try {
            const { name, shortDescription, description, quantity, price, categoryId } = req.body;
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
                name, image: primaryImage, subImage, shortDescription, description, quantity, price, categoryId
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
            // cannot find product to delete -> return null.
            const response = await Product.findOneAndDelete({ _id: req.params.id });
            console.log('res: ', response);
            res.status(200).json({ message: 'Delete successfully!' })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ProductController();