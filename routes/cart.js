const router = require('express').Router();
const CartController = require('../controller/CartController');

router.get('/show/:userId', CartController.show);
router.post('/add-product', CartController.addProduct);
router.delete('/remove-product',CartController.removeProduct);
router.put('/update-product', CartController.updateProduct);

module.exports = router;