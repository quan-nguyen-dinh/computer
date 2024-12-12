const { uploadToCloudinary } = require('../helper');
const Category = require('../models/category');

class CategoryController {
  async show(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const categories = await Category.find({}).skip(offset).limit(limit);
      const totalCategories = await Category.countDocuments();
      res.status(200).json({ categories, totalCategories });
    } catch (err) {
      console.error(err);
    }
  }
  async create(req, res) {
    try {
      const { name } = req.body;
      console.log(req.body);
      console.log(req.file);
      let iconUrl = '';
      if (req.file) {
        iconUrl = (await uploadToCloudinary(req.file))?.url;
      }
      const category = new Category({
        name,
        icon: iconUrl,
      });
      await category.save();
      res.status(200).json({ message: 'Create category successfully!' });
    } catch (err) {
      console.log(err);
    }
  }
  async delete(req, res) {
    try {
      const categoryId = req.params.slug;
      const result = await Category.findByIdAndDelete(categoryId);
      console.log(result);
      res.status(200).json({ message: 'Delete category successfully!' });
    } catch (err) {
      console.log(err);
    }
  }
  async update(req, res) {
    try {
      const categoryId = req.params.slug;
      let iconUrl = '';
      if (req.file) {
        iconUrl = (await uploadToCloudinary(req.file))?.url;
      } else iconUrl = req.body.icon;
      const result = await Category.findByIdAndUpdate(categoryId, {
        name: req.body.name,
        icon: iconUrl,
      });
      console.log('results: ', result);
      res.status(200).json({ message: 'Update category sucessfully!' });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new CategoryController();
