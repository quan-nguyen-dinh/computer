const router = require('express').Router();
const BrandController = require('../controller/BrandController');

router.get('/show', BrandController.show);
router.post('/create', BrandController.create);
router.put('/update/:id', BrandController.update);
router.delete('/delete/:id', BrandController.delete);

module.exports = router;