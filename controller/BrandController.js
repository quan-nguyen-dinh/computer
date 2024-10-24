const { uploadToCloudinary } = require('../helper');
const Brand = require('../models/brand');

class BrandController {
  async show(_, res) {
    try {
      const brands = await Brand.getAll();
      res.status(200).json({ brands });
    } catch (err) {
      console.log(err);
    }
  }
  async create(req, res) {
    try {
      const { name } = req.body;
      const exitsBrand = await Brand.findOne({ name: name });
      console.log(exitsBrand);
      if (exitsBrand) {
        return res.status(200).json({ message: "Brand's name is duplicated" });
      }
      let imageUrl = '';
      if (req.file) {
        imageUrl = (await uploadToCloudinary(req.file))?.url;
      }
      const brand = new Brand({ name, image: imageUrl });
      await brand.save();
      res.status(200).json({ message: 'Create brand successfullly' });
    } catch (err) {
      console.log(err);
    }
  }
  async update(req, res) {
    try {
      let imageUrl = '';
      if (!req.file) {
        imageUrl = req.body.image;
      } else imageUrl = (await uploadToCloudinary(req.file))?.url;
      const brand = await Brand.updateOne(
        { _id: req.params.id },
        { name: req.body.name, image: imageUrl },
      );
      res.status(200).json({ message: 'Update brand successfully' });
    } catch (err) {
      console.log(err);
    }
  }
  async delete(req, res) {
    try {
      const brand = await Brand.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Delete brand successfully' });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new BrandController();
