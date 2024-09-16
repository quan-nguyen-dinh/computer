const router = require('express').Router();
const CategoryController = require('../controller/CategoryController');

router.get('/show', CategoryController.show);
router.post('/create', CategoryController.create);
router.delete('/delete/:slug', CategoryController.delete);
router.put('/update/:slug', CategoryController.update);

module.exports = router;