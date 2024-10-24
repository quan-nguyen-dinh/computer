const OrderController = require('../controller/OrderController');

const router = require('express').Router();

router.get('/totalOrders', OrderController.getOrderInfo);
router.get('/revenue', OrderController.getRenevue);
router.get('/show', OrderController.show);
router.get('/recentOrder/:userId', OrderController.getByUserId);
router.get('/productsByMonth', OrderController.getProductsByMonth);
router.get('/productsByCategory', OrderController.getProductByCategory);
router.get('/productsByBrand', OrderController.getProductByBrand);
router.post('/create', OrderController.create);
router.put('/update/:id', OrderController.update);
router.delete('/delete', OrderController.delete);

module.exports = router;
