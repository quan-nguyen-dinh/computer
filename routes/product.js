const express = require('express');
const router = express.Router();
const {upload} = require('../helper/index');
const ProductController = require('../controller/ProductController');
/**
 * @openapi
 * '/product/get-all':
 *  get:
 *     tags:
 *     - Product 
 *     summary: Get all products 
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string 
 *                  name:
 *                    type: string
 *                  image:
 *                    type: string
 *                  price:
 *                    type: number 
 *                  category:
 *                      type: string 
 *       400:
 *         description: Bad request
 */
router.get('/get-all', ProductController.show);

router.post('/create', upload.fields([
    {
        name: 'primiryImg'
    },
    {
        name: 'subImg1'
    },
    {
        name: 'subImg2'
    },
    {
        name: 'subImg3'
    },
]), ProductController.create);
router.put('/update/:id', ProductController.update);
router.get('/filter-product', ProductController.filter);
router.delete('/delete/:id', ProductController.delete);

module.exports = router;