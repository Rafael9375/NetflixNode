const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

router.get('/movie/all', movieController.getAll);
router.get('/movie/allskip', movieController.getSkip);
router.post('/movie/getFavorites', movieController.getFavorites);
router.get('/movie/count', movieController.getCount);
router.get('/movie/getbyid', movieController.getById);
router.post('/movie/new', movieController.addOne);
router.post('/movie/newRange', movieController.addRange);
router.post('/movie/updateFavorite', movieController.updateFavorite);
router.post('/movie/addToFavorite', movieController.addToFavorite);
router.post('/movie/getListById', movieController.getListById);
router.post('/movie/getFavoritList', movieController.getFavoritList);


module.exports = router;