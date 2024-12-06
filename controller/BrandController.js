const { uploadToCloudinary } = require('../helper');
const Brand = require('../models/brand');
const { getOffset } = require('../utils/pagination');

async function show(req, res, next) {
  try {
    const { page, limit } = req.query;
    const offset = getOffset(page, limit);
    // const result = Promise.all((Brand.find({}).skip(offset).limit(limit)), Brand.countDocuments());
    const brands = await Brand.find({}).skip(offset).limit(limit);
    const totalBrands = await Brand.countDocuments();
    res.status(200).json({ brands, totalBrands });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { name } = req.body;
    const exitsBrand = await Brand.findOne({ name: name });
    console.log(exitsBrand);
    if (exitsBrand) {
      throw new Error("Brand's name is duplicated");
    }
    let imageUrl = '';
    if (req.file) {
      imageUrl = (await uploadToCloudinary(req.file))?.url;
    }
    const brand = new Brand({ name, image: imageUrl });
    await brand.save();
    res.status(200).json({ message: 'Create brand successfullly' });
  } catch (err) {
    console.log(err.name);
    if (err instanceof Error) {
      console.log(err.message);
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name } = req.body;
    const exitsBrand = await Brand.findOne({ name: name });
    console.log(exitsBrand);
    if (exitsBrand) {
      throw new Error("Brand's name is duplicated");
    }
    let imageUrl = '';
    if (!req.file) {
      imageUrl = req.body.image;
    } else imageUrl = (await uploadToCloudinary(req.file))?.url;
    const brand = await Brand.updateOne({ _id: req.params.id }, { name: name, image: imageUrl });
    res.status(200).json({ message: 'Update brand successfully' });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function remove(req, res) {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Delete brand successfully' });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { show, create, update, remove };
