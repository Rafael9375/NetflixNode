const express = require('express')
const sessionController = require('../controllers/verificationTokenController')
const router = express.Router()

router.get('/verificationToken/all', sessionController.getAll);
router.post('/verificationToken/new', sessionController.createRefreshToken);
router.post('/verificationToken/check', sessionController.checkRefreshToken);

module.exports = router;