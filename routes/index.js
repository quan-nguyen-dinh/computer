const userRouter = require('./user');
const productRouter = require('./product');
const categoryRouter = require('./category');

function route(app) {
    app.use('/', userRouter);
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
}

module.exports = route;