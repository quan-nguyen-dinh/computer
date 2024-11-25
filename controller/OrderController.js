const { uploadToCloudinary } = require('../helper');
const Order = require('../models/order');
const User = require('../models/user');

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
          $group: { _id: { month: { $month: '$createAt' } }, totalPrice: { $sum: '$totalPrice' } },
        },
        {
          $sort: { '_id.month': 1 },
        },
        {
          $project: {
            _id: 1,
            totalPrice: 1,
          },
        },
      ]).exec();
      res.status(200).json(renevue);
    } catch (err) {
      console.log(err);
    }
  }
  async getProductsByDay(_, res) {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Ngày đầu tiên của tháng
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1); // Ngày đầu tiên của tháng tiếp theo
      console.log('DATE: ', new Date());
      console.log(startDate, 'START DATE: ', startOfMonth);
      console.log(endDate, 'END DATE: ', endOfMonth);
      const orders = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $unwind: '$products',
        },

        {
          $group: {
            _id: {
              dayOfMonth: { $dayOfMonth: '$createdAt' },
            },
            value: { $sum: '$products.quantity' },
          },
        },
      ]);
      // const orders = await Order.aggregate([
      //   {
      //     $unwind: '$products',
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         year: { $year: '$createdAt' },
      //       },
      //       value: { $sum: '$products.quantity' },
      //     },
      //   },
      //   {
      //     $sort: {
      //       '_id.year': 1,
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 1,
      //       value: 1,
      //     },
      //   },
      // ]);
      res.status(200).json({ orders });
    } catch (error) {
      console.log(error);
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
              month: { $month: '$createdAt' },
            },
            value: { $sum: '$products.quantity' },
          },
        },
        {
          $sort: {
            '_id.month': 1,
          },
        },
        {
          $project: {
            _id: 1,
            value: 1,
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
            from: 'categories',
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
            totalPrice: {
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
            from: 'brands',
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
            totalProduct: {
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
  async show(_, res) {
    try {
      // const orders = await Order.find();
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: 'user',
            localField: 'user',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $group: {
            _id: '$_id',
            customerName: { $first: '$customer.name' },
            // totalProducts: { $count: '$products'},
            status: { $first: '$status' },
            totalPrice: { $first: '$totalPrice' },
            createdAt: { $first: '$createdAt' },
          },
        },
      ]);
      res.status(200).json({ orders });
    } catch (err) {
      console.log(err);
    }
  }
  async getByUserId(req, res) {
    try {
      const orders = await Order.find({ user: req.params.userId });
      res.status(200).json({ orders });
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
