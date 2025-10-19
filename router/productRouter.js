const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getAllProduct, getById, createProduct, uploadProduct, deleteProduct } = require('../controller/productController');

router.get('/', getAllProduct);
router.get('/:id', getById);
router.post('/', [auth, admin, upload.array('images', 3)], createProduct);
router.put('/:id', [auth, admin, upload.array('images', 3)], uploadProduct);
router.delete('/:id', [auth, admin], deleteProduct);

module.exports = router; 