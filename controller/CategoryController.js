const { uploadToCloudinary } = require('../helper');
const Category = require('../models/category');

class CategoryController {
  async show(_, res) {
    try {
      const categories = await Category.find({});
      res.status(200).json({ categories });
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
