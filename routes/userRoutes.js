const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/user/all', userController.getAll);
router.post('/user/new', userController.addOne);
router.post('/user/signin', userController.signin);
router.post('/user/signinProvider', userController.signinProvider);
router.post('/user/getByEmail', userController.getByEmail);

module.exports = router;

