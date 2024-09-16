const Brand = require('../models/brand');

class BrandController {
    async show (_, res) {
        try {
            const brands = await Brand.getAll();
            res.status(200).json({ brands });
        } catch (err) {
            console.log(err);
        }
   }
}

module.exports = new BrandController();