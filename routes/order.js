const OrderController = require('../controllers/OrderController');

const router = require('express').Router();

router.get('/totalOrders', OrderController.getOrderInfo);
router.get('/revenue', OrderController.getRenevue);
router.get('/show', OrderController.show);
router.get('/bestsellers', OrderController.getBestSeller);
router.get('/recentOrder/:userId', OrderController.getByUserId);
router.get('/productsByMonth', OrderController.getProductsByMonth);
router.get('/productsByDate', OrderController.getProductsByDate);
router.get('/productsByCategory', OrderController.getProductByCategory);
router.get('/productsByBrand', OrderController.getProductByBrand);
router.get('/orders/:id', OrderController.getById);
router.post('/create', OrderController.create);
router.put('/update/:id', OrderController.update);
router.delete('/delete', OrderController.delete);

module.exports = router;
