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
            const { products, totalPrice, userId } = req.body;
            const order = new Order({ products, totalPrice, user: userId });
            await order.save();
            res.status(200).json({message: 'Order successfullly!'});
        }catch (err){
            console.log(err);
        }
   }
   async update(req, res) {
        try {
            const order = await Order.updateOne({_id: req.params.id},  { status: req.body?.status});
            console.log('update Order: ', order);
            res.status(200).json({message: 'Update Order successfully'});
        } catch(err){
            console.log(err);
        }
   }
   async delete(req, res) {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            console.log('DELETE Order: ', order);
            res.status(200).json({message: 'Delete Order successfully'});
        }catch(err) {
            console.log(err);
        }
   }
}

module.exports = new OrderController();