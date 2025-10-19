const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllorder, createOrders } = require('../controller/orderController');

router.get('/', auth, getAllorder);
router.post('/', auth, createOrders);

module.exports = router;