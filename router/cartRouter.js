const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllCarts, newCart, deleteCart, updateCart } = require('../controller/cartController')

router.get('/', auth, getAllCarts);
router.post('/', auth, newCart);
router.put('/:id', auth, updateCart)
router.delete('/:productId', auth, deleteCart);

module.exports = router;