const express = require('express');
const router = express.Router();

const phimController = require('../app/controller/PhimController');

router.get('/:slug', phimController.showPhim);

module.exports = router;