const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controller/categoryController')

router.get('/', getAllCategory);
router.get('/:id', getCategoryById);
router.post('/',  upload.single('image'), createCategory);
router.put('/:id', [auth, admin, upload.single('image')], updateCategory);
router.delete('/:id', [auth, admin], deleteCategory);

module.exports = router;