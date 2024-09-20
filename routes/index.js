const userRouter = require('./user');
const productRouter = require('./product');
const categoryRouter = require('./category');
const cartRouter = require('./cart');

function route(app) {
    app.use('/', userRouter);
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
    app.use('/cart', cartRouter);
}

module.exports = route;