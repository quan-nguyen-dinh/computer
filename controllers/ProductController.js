const Product = require('../models/product');
const { uploadMultipleFileToCloudinary } = require('../helper/index');

async function show(req, res) {
  try {
    const { offset, limit } = req.query;
    const page = (offset - 1) * limit;
    const products = await Product.find()
      .populate('category', 'name')
      .populate('brand', 'name')
      .skip(page)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    res.status(200).json({ products, totalProducts });
  } catch (err) {
    console.log(err);
  }
}

async function getViewedProducts(req, res, next)  {
  try {
    const viewedProductIds = req.body.viewedProducts;
    const viewedProducts = await Product.find({_id: { $in: viewedProductIds}});
    console.log('viewedProductIds', viewedProducts);
    res.status(200).json({viewedProducts})
  }catch (error) {
    next(error);
  }
}

async function filter(req, res) {
  try {
    const {
      productName,
      brandId,
      sortBy,
      priceMin,
      priceMax,
      categoryId,
      review,
      offset = 1,
      limit = 10,
    } = req.query;

    let query = Product.find({});
    const page = (offset - 1) * limit;
    console.log('page: ', productName);
    console.log('query: ', req.query);
    if (productName) {
      query = query.find({ name: { $regex: productName, $options: 'i' } });
    }
    if (brandId) {
      query = query.where('brand').equals(brandId);
    }
    if (categoryId) {
      query = query.where('category').equals(categoryId);
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

async function create(req, res) {
  try {
    console.time();
    const { name, shortDescription, description, quantity, price, category, brand } = req.body;
    console.log('body: ', req.body);
    console.log('fiels: ', req.files);
    let primaryImage, subImages;
    if (req.files) {
      const imageUrls = await uploadMultipleFileToCloudinary(req.files);
      if (imageUrls.primaryImage) {
        primaryImage = imageUrls.primaryImage;
      }
      if (imageUrls.subImages) {
        subImages = imageUrls.subImages;
      }
    } else {
      primaryImage = req.body.primaryImg;
      subImages = [req.body.subImg1, req.body.subImg2, req.body.subImg3];
    }
    console.log('PRIMARY IMAGE TO UPLOAD----------------------------: ', primaryImage);
    console.log('SUBIMAGE TO UPLOAD+++++++++++++++++++++++++++++: ', subImages);
    const newProduct = new Product({
      name,
      image: primaryImage,
      subImages,
      shortDescription,
      description,
      quantity,
      price,
      category,
      brand,
    });
    await newProduct.save();
    console.timeEnd();
    res.status(200).json({ message: 'Create product successfully!' });
  } catch (err) {
    console.log(err);
  }
}
async function detail(req, res) {
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
async function update(req, res) {
  try {
    console.log('params: ', req.params);
    console.log('body: ', req.body);
    console.log('files: ', req.files);
    let primaryImg = '',
      subImages = [];
    const { name, shortDescription, category, description, quantity, price, brand } = req.body;
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
      name,
      image: primaryImg,
      shortDescription,
      description,
      quantity,
      price,
      subImages,
      category,
      brand,
    });
    res.status(200).json({ message: 'Update product successfully!' });
  } catch (err) {
    console.log(err);
  }
}
async function remove(req, res) {
  try {
    // cannot find product to delete -> return null.
    const response = await Product.findOneAndDelete({ _id: req.params.id });
    console.log('res: ', response);
    res.status(200).json({ message: 'Delete product successfully!' });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { show, create, update, remove, filter, detail, getViewedProducts };
