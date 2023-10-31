const express = require('express')
const sessionController = require('../controllers/sessionController')
const router = express.Router()

router.get('/session/all', sessionController.getAll);
router.post('/session/new', sessionController.addOne);

module.exports = router;