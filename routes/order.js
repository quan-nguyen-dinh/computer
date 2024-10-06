const OrderController = require('../controller/OrderController');

const router = require('express').Router();

router.get('/show', OrderController.show);
router.get('/recentOrder/:userId', OrderController.getByUserId);
router.post('/create', OrderController.create);
router.put('/update/:id', OrderController.update);
router.delete('/delete', OrderController.delete);

module.exports = router;
