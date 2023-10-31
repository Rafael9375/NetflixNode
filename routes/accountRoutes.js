const express = require('express');
const userController = require('../controllers/accaountController');
const router = express.Router();

router.get('/account/all', userController.getAll);
router.post('/account/new', userController.addOne);

module.exports = router;