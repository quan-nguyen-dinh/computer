const userRouter = require('./user');
const productRouter = require('./product');
const categoryRouter = require('./category');
const cartRouter = require('./cart');
const brandRouter = require('./brand');

function route(app) {
    app.use('/', userRouter);
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
    app.use('/cart', cartRouter);
    app.use('/brand', brandRouter);
}

module.exports = route;