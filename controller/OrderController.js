const { uploadToCloudinary } = require('../helper');
const Order = require('../models/order');
const User = require('../models/user');
const { filter } = require('./ProductController');

class OrderController {
  async getOrderInfo(_, res) {
    try {
      // const a = await Order.updateMany({_id: "670147cdbdd6339def386d93"}, {$set: {'products.$.product.description': "66e9747cbbdc693d94337d22"}});
      // console.log(a, );
      console.log(
        await Order.aggregate()
          .unwind('products')
          .group({
            _id: null,
            totalProducts: { $sum: '$products.quatity' },
            revenue: { $sum: '$totalPrice' },
          })
          .project('-_id totalProducts revenue'),
      );
      const orderInfo = await Promise.allSettled([
        Order.countDocuments(),
        Order.aggregate([
          {
            $unwind: '$products',
          },
          {
            $group: {
              _id: null,
              totalProducts: { $sum: '$products.quantity' },
              revenue: { $sum: '$totalPrice' },
            },
          },
          {
            $project: {
              _id: 0,
              totalProducts: 1,
              revenue: 1,
            },
          },
        ]),
      ]);
      console.log(orderInfo);
      const data = {
        totalOrders: orderInfo[0]?.value,
        totalProducts: orderInfo[1]?.value[0]?.totalProducts,
        revenue: orderInfo[1]?.value[0]?.revenue,
      };
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  }
  async getRenevue(req, res) {
    const filterByTime = {
      month: { month: { $month: '$createAt' } },
      year: { year: { $year: '$createAt' } },
    };
    console.log('req.query: ', req.query);
    try {
      const renevue = await Order.aggregate([
        {
          $group: { _id: { $month: '$createdAt' }, value: { $sum: '$totalPrice' } },
        },
        {
          $sort: { '_id': 1 },
        },
      ]).exec();
      res.status(200).json(renevue);
    } catch (err) {
      console.log(err);
    }
  }
  async getProductsByDate(req, res) {
    try {
      console.log('query: ', req.query);
      let operators = [];
      if (req.query.filterBy === 'day') {
        const startDate = new Date();
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        operators.push({
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        })
      }
      const filterByTime = {
        day: { $dayOfMonth: '$createdAt' },
        month: { $month: '$createdAt' },
        year: { $year: '$createdAt' },
      };
      const subOperators = [
        {
          $unwind: '$products',
        },
        {
          $group: {
            _id: filterByTime[req.query.filterBy],
            value: { $sum: '$products.quantity' },
          },
        },
        {
          $sort: {
            '_id': 1,
          },
        }
      ]
      operators = [...operators, ...subOperators];
      console.log(operators);
      const orders = await Order.aggregate(operators)
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
    }
  }
  async getBestSeller(_, res, next) {
    try {
      const bestsellers = await Order.aggregate([
        {
          $unwind: "$products"
        },
        {
          $group: {
            _id: "$products.product._id",
            value: {
              $sum: "$products.quantity"
            }
          }
        },
        {
          $sort: {
            'value': -1
          }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'product',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          }
        },
        {
          $unwind: "$product"
        },
      ]);
      res.status(200).json({ bestsellers });
    } catch (error) {
      console.log(error);
      // next(err)
    }
  }
  async getProductsByMonth(_, res) {
    try {
      const orders = await Order.aggregate([
        {
          $unwind: '$products',
        },
        {
          $group: {
            _id: {
              $month: '$createdAt'
            },
            value: { $sum: '$products.quantity' },
          },
        },
        {
          $sort: {
            '_id': 1,
          },
        },
      ]);
      console.log('orders: ', orders);
      res.status(200).json(orders);
    } catch (err) {
      console.log(err);
    }
  }
  async getProductByCategory(_, res) {
    try {
      const orders = await Order.aggregate([
        {
          $unwind: '$products', // Bóc tách từng phần tử của mảng products thành document riêng
        },
        {
          $lookup: {
            from: 'category',
            localField: 'products.product.category',
            foreignField: '_id',
            as: 'category_order',
          },
        },
        {
          $unwind: '$category_order',
        },
        {
          $group: {
            _id: '$category_order.name',
            value: {
              $sum: '$totalPrice',
            },
          },
        },
      ]);
      console.log('orders: ', orders);
      res.status(200).json(orders);
    } catch (err) {
      console.log(err);
    }
  }
  async getProductByBrand(_, res) {
    try {
      const products = await Order.aggregate([
        {
          $unwind: '$products', // Bóc tách từng phần tử của mảng products thành document riêng
        },

        {
          $lookup: {
            from: 'brand',
            localField: 'products.product.brand',
            foreignField: '_id',
            as: 'brand_order',
          },
        },
        {
          $unwind: '$brand_order',
        },
        {
          $limit: 5,
        },
        {
          $group: {
            _id: '$brand_order.name',
            value: {
              $sum: '$products.quantity',
            },
          },
        },
      ]);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async show(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const result = await Order.aggregate([
        {
          $lookup: {
            from: 'user',
            localField: 'user',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$customer'
        },
        {
          $group: {
            _id: '$_id',
            customerName: { $first: '$customer.name' },
            // totalProducts: { $count: '$products'},
            status: { $first: '$status' },
            totalPrice: { $first: '$totalPrice' },
            createdAt: { $first: '$createdAt' },
          }
        },
        {
          $facet: {
            orders: [
              { $skip: offset },
              { $limit: Number(limit) }
            ],
            totalOrders: [
              { $count: 'count' }
            ]
          }
        }
      ]);
      const orders = result[0]?.orders;
      const totalOrders = result[0]?.totalOrders[0]?.count;
      res.status(200).json({ orders, totalOrders });
    } catch (err) {
      console.log(err);
    }
  }
  async getByUserId(req, res) {
    try {
      const { page = 1 } = req.query;
      const offset = (page - 1) * 10;
      const orders = await Order.find({ user: req.params.userId }).skip(offset).limit(10);
      const totalOrders = await Order.find({ user: req.params.userId }).countDocuments();
      res.status(200).json({ orders, totalOrders });
    } catch (err) {
      console.log(err);
    }
  }
  async getById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      res.status(200).json({ order });
    } catch (error) {
      console.log(error);
    }
  }
  async create(req, res) {
    try {
      const { products, totalPrice, userId } = req.body;
      let { products: productsInCart } = (await User.findById(userId).select('cart'))?.cart;
      console.log('PRODUCTS: ', products);
      console.log('productsInCart: ', productsInCart);
      if (productsInCart.length === products.length) {
        productsInCart = [];
      } else {
        let newProducts = [];
        productsInCart = productsInCart.filter((_item) => {
          const result = !products.find(
            (item) => item.product._id.toString() === _item.product._id.toString(),
          );
          console.log('result: ', result);
          return !products.find(
            (item) => item.product._id.toString() === _item.product._id.toString(),
          );
        });
        console.log('newProducts: ', productsInCart);
      }
      const cart = await User.updateOne(
        { _id: userId },
        {
          $set: { 'cart.products': productsInCart },
        },
      );
      console.log('CART AFTER UPDATE: ', cart);
      console.log('cart: ', productsInCart);
      const newOrder = new Order({ products, totalPrice, user: userId });
      const result = await newOrder.save();
      console.log('result: ', result);
      res.status(200).json({ message: 'Order successfullly!' });
    } catch (err) {
      console.log(err);
    }
  }
  async update(req, res) {
    try {
      const order = await Order.updateOne({ _id: req.params.id }, { status: req.body?.status });
      console.log('update Order: ', order);
      res.status(200).json({ message: 'Update Order successfully' });
    } catch (err) {
      console.log(err);
    }
  }
  async delete(req, res) {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      console.log('DELETE Order: ', order);
      res.status(200).json({ message: 'Delete Order successfully' });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new OrderController();
