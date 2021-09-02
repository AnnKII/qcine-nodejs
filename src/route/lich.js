const express = require('express');
// const { listLich } = require('../app/controller/LichController');
const router = express.Router();
const lichController = require('../app/controller/LichController');

router.get('/date/:slug', lichController.lichByDate);
router.get('/:slug',  lichController.booking);
router.get('/', lichController.currentLich);

module.exports = router;