const userRouter = require('./user');
const productRouter = require('./product');

function route(app) {
    app.use('/', userRouter);
    app.use('/product', productRouter);
}

module.exports = route;