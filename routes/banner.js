const router = require('express').Router();
const BannerController = require('../controllers/BannerController');

router.get('', BannerController.show);
router.post('', BannerController.create);
router.put('/:id', BannerController.update);
router.delete('/:id', BannerController.remove);

module.exports = router;