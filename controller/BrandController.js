const { uploadToCloudinary } = require('../helper');
const Brand = require('../models/brand');

class BrandController {
    async show (_, res) {
        try {
            const brands = await Brand.getAll();
            brands.getAll();
            res.status(200).json({ brands });
        } catch (err) {
            console.log(err);
        }
   }
   async create(req, res) {
        try {
            const { name} = req.body;
            const imageUrl = await uploadToCloudinary(req.file?.image)?.url;
            const brand = new Brand({name, imageUrl});
            await brand.save();
            res.status(200).json({message: 'Create brand successfullly!'});
        }catch (err){
            console.log(err);
        }
   }
   async update(req, res) {
        try {
            const imageUrl = await uploadToCloudinary(req.file?.image)?.url;
            const brand = await Brand.updateOne({_id: req.params.id}, {name: req.body.name, image: imageUrl});
            console.log('update brand: ', brand);
            res.status(200).json({message: 'Update brand successfully'});
        } catch(err){
            console.log(err);
        }
   }
   async delete(req, res) {
        try {
            const brand = await Brand.findByIdAndDelete(req.params.id);
            console.log('DELETE BRAND: ', brand);
            res.status(200).json({message: 'Delete brand successfully'});
        }catch(err) {
            console.log(err);
        }
   }
}

module.exports = new BrandController();