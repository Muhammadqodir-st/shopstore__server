const express = require('express');
const router = express.Router();
const { getAllCarts, newCart, deleteCart } = require('../controller/cartController')

router.get('/', getAllCarts);
router.post('/', newCart);
router.delete('/', deleteCart);

module.exports = router;