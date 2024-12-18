const router = require('express').Router();
const BannerController = require('../controllers/BannerController');
const { upload } = require('../helper');

router.get('', BannerController.show);
router.get('/filter-banner', BannerController.filterBanner)
router.post('', upload.single('thumbnailURL'), BannerController.create);
router.put('/:id', upload.single('thumbnailURL'), BannerController.update);
router.delete('/:id', BannerController.remove);

module.exports = router;