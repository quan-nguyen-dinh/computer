const userRouter = require('./user');
const productRouter = require('./product');
const categoryRouter = require('./category');
const cartRouter = require('./cart');
const brandRouter = require('./brand');
const orderRouter = require('./order');
const bannerRouter = require('./banner');

function route(app) {
    app.use('/', userRouter);
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
    app.use('/cart', cartRouter);
    app.use('/brand', brandRouter);
    app.use('/order', orderRouter);
    app.use('/banners', bannerRouter);
}

module.exports = route;