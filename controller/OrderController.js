const { uploadToCloudinary } = require('../helper');
const Order = require('../models/order');

class OrderController {
    async show (_, res) {
        try {
            const orders = await Order.find();
            res.status(200).json({ orders });
        } catch (err) {
            console.log(err);
        }
   }
   async getByUserId(req, res) {
        try {
            const orders = await Order.find({user: req.params.userId});
            res.status(200).json({ orders });
        } catch (err) {
            console.log(err);
        }
   }
   async create(req, res) {
        try {
            const { name, products, totalPrice, userId } = req.body;
            const Order = new Order({name, products, totalPrice, user: userId });
            await Order.save();
            res.status(200).json({message: 'Order successfullly!'});
        }catch (err){
            console.log(err);
        }
   }
   async update(req, res) {
        try {
            const { name, products, totalPrice, userId } = req.body;
            const Order = await Order.updateOne({_id: req.params.id},  { name: req.body.name, image: imageUrl});
            console.log('update Order: ', Order);
            res.status(200).json({message: 'Update Order successfully'});
        } catch(err){
            console.log(err);
        }
   }
   async delete(req, res) {
        try {
            const Order = await Order.findByIdAndDelete(req.params.id);
            console.log('DELETE Order: ', Order);
            res.status(200).json({message: 'Delete Order successfully'});
        }catch(err) {
            console.log(err);
        }
   }
}

module.exports = OrderController;