const router = require('express').Router();
const BrandController = require('../controller/BrandController');
const { upload } = require('../helper');

router.get('/show', BrandController.show);
router.post('/create', upload.single('image'), BrandController.create);
router.put('/update/:id', upload.single('image'), BrandController.update);
router.delete('/delete/:id', BrandController.remove);

module.exports = router;
