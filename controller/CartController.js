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
            const {quantity, product, userId} = req.body;
            console.log('product: ', product);
            console.log('userId: ', userId);
            console.log('quantity: ', quantity);
            const availableProduct = await Product.findById(product._id);
            if(availableProduct.quantity < quantity) {
                return res.status(200).json({message: "No available product!"});
            }
            let {products} = (await User.findById(userId).select('cart'))?.cart;
            let hasProduct = false;
            products.forEach(item=>{
                if(item.product._id.toString() === product._id) {
                    item.quantity += quantity;
                    hasProduct = true;
                }
            });
            if (hasProduct) {
                const cart =  await User.updateOne({_id: userId}, {
                    $set: {'cart.products': products}
                });
                console.log('HAS PRODUCT: ', cart);
               
            } else {
                const user = await User.updateOne({_id: userId}, {
                    $push: {
                        "cart.products": {
                            product,
                            quantity 
                        }
                    }
                });
                console.log('NO HAS PRODUCT: ', user);
            }
            const aProduct = await Product.updateOne({_id: product._id}, {$inc: {quantity: -quantity}});
            console.log('a: ', aProduct);
            res.status(200).json({message: 'Add product successfully!'});
        } catch(err) {
            console.log('err: ', err);
            res.status(500).json(err);
        }
    }
    async removeProduct(req, res) {
        try {
            const {productId, userId} = req.query;
            console.log(req.query);
            let {products} = (await User.findById(userId).select('cart'))?.cart;
            console.log('cart: ', products);
            // let products = cart.products;
            console.log('PRODUCTS: ', products);
            products  = products.filter(item=>{
                console.log('item: ', item.product);
                return item?.product?._id.toString() !== productId;
            });
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
            let {products} = (await User.findById(userId).select('cart')).cart;
            products.forEach(item=>{
                if(item.product._id.toString() === productId) {
                    item.quantity = quantity;
                }
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