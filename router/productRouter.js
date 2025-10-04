const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getAllProduct, getById, createProduct } = require('../controller/productController');

router.get('/', getAllProduct);
router.get('/:id', getById);
router.post('/', upload.array('images', 5), createProduct);

module.exports = router;