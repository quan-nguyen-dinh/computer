const Product = require('../models/product');
const User = require('../models/user');

class CartController {
    async show(req, res) {
        try {
            const userInfo = await User.findById(req.params.userId).select('cart');
            res.status(200).json({userInfo});
        } catch (err) {
            console.log(err);
        }
    }
    async addProduct(req, res) {
        try {
            const {quantity, product} = req.body;
            const user = await User.updateOne({_id: req.params.id}, {
                $push: {
                    "cart.products": {
                        product,
                        quantity
                    }
                }
            });
            console.log('user: ', user);
            res.status(200).json({message: 'Add product successfully!'});
        } catch(err) {
            console.log('err: ', err);
        }
    }
    async removeProduct(req, res) {
        try {
            const {productId, quantity, userId} = req.query;
            let {products} = await User.findById(userId).select('cart');
            products  = products.filter(item=>item.product._id === productId);
            const cart = await User.updateOne({_id: userId}, {
                $set: {'cart.products': products}
            });
            console.log('cart: ', cart);
            res.status(200).json({message: 'Remove product succesffully!'});
        } catch(err) {
            console.log(err);
        }
    }
    async updateProduct(req, res) {
        try {
            const {productId, quantity, userId} = req.query;
            let {products} = await User.findById(userId).select('cart');
            products  = products.map(item=>{
                if(item.product._id === productId) {
                    item.quanty = quantity;
                }
                return item;
            });
            const cart = await User.updateOne({_id: userId}, {
                $set: {'cart.products': products}
            });
            console.log('cart: ', cart);
            res.status(200).json({message: 'Update product succesffully!'});
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new CartController();