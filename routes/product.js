const express = require('express');
const router = express.Router();
const {upload} = require('../helper/index');
const ProductController = require('../controller/ProductController');

router.get('/get-all', ProductController.show);
router.post('/create', upload("image"), ProductController.create);
router.put('/update/:id', ProductController.update);
router.delete('/delete/:id', ProductController.delete);

module.exports = router;