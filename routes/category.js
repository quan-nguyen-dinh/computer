const router = require('express').Router();
const CategoryController = require('../controller/CategoryController');
const { upload } = require('../helper');

router.get('/show', CategoryController.show);
router.post('/create', upload.single('icon'), CategoryController.create);
router.delete('/delete/:slug', CategoryController.delete);
router.put('/update/:slug', upload.single('icon'), CategoryController.update);

module.exports = router;
