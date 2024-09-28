const Product = require('../models/product');
const { uploadMultipleFileToCloudinary } = require('../helper/index');
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
    async uploadImage(files) {
        let primaryImage = null, subImages = [];
        await Promise.all((Object.entries(files)).map(async (image) => {
            console.log('image: ', image);
            const imageUrl = await uploadToCloudinary(image[1][0]);
            console.log('URL: ', imageUrl.url);
            if (image[0] === 'primaryImg') {
                primaryImage = imageUrl.url;
            } else {
                subImages = [...subImages, imageUrl.url];
            }
        }));
        return { primaryImage, subImages};
    }
    async create(req, res) {
        try {
            console.time();
            const { name, shortDescription, description, quantity, price, category } = req.body;
            console.log('body: ', req.body);
            console.log('fiels: ', req.files)
            const {primaryImage, subImages} = uploadMultipleFileToCloudinary(req.files);
            console.log('PRIMARY IMAGE TO UPLOAD----------------------------: ', primaryImage);
            console.log('SUBIMAGE TO UPLOAD+++++++++++++++++++++++++++++: ', subImages);
            const newProduct = new Product({
                name, image: primaryImage, subImages, shortDescription, description, quantity, price, category
            });
            await newProduct.save();
            console.timeEnd();
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
            console.log('params: ', req.params);
            console.log('body: ', req.body);
            console.log('files: ', req.files);
            let primaryImg = '', subImages = [];
            const { name, shortDescription, category, description, quantity, price } = req.body;
            if (req.body.primaryImg) {
                primaryImg = req.body.primaryImg;
            }
            if (Object.keys(req.files).length > 0) {
                const images = await uploadMultipleFileToCloudinary(req.files);
                primaryImg = primaryImg || images.primaryImage;
                subImages = images.subImages;
            } else {
                subImages = [req.body.subImg1, req.body.subImg2, req.body.subImg3];
            }
            console.log(primaryImg, subImages);
            await Product.findByIdAndUpdate(req.params.id, {
                name, image: primaryImg, shortDescription, description, quantity, price, subImages, category
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