const Category = require('../models/category');

class CategoryController {
    async show(_, res) {
        try {
            const categories = await Category.find({});
            res.status(200).json({categories});
        } catch (err) {
            console.error(err);
        }
    }
    async create(req, res){
        try {
            const {name, icon} = req.body;
            const category = new Category({
                name,
                icon
            });
            await category.save();
            res.status(200).json({message: 'Create successfully!'});
        } catch(err){
            console.log(err);
        }
    }
    async delete(req, res){
        try {
            const categoryId = req.params.slug;
            const result = await Category.findByIdAndDelete({ _id: categoryId });
            console.log(result);
            res.json(200).json({ messaage: 'Delete successfully!' });
        }catch(err) {
            console.log(err);
        }
    }
    async update(req, res) {
        try {
            const categoryId = req.params.slug;
            const result = await Category.findByIdAndUpdate({ _id: categoryId }, {name: req.body.name, icon: req.body.icon});
            console.log('results: ', result);
            res.status(200).json({ message: 'Update sucessfully!'});
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new CategoryController();