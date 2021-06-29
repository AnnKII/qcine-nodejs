const express = require('express');
const router = express.Router();
const lichController = require('../app/controller/LichController');

router.get('/:slug',  lichController.booking);

module.exports = router;