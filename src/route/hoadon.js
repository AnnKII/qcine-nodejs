const express = require('express');
const router = express.Router();
const hoadoncontroller = require('../app/controller/HoaDonController');
    router.get('/:slug', hoadoncontroller.hoadonINFO);
    router.get('/', hoadoncontroller.index);

module.exports = router;
