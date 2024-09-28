const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');

router.get('/get-userinfo/:userId', UserController.getUserInfo);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/change-password', UserController.changePassword);

module.exports = router;