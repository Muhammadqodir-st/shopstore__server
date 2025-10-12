const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware')
const { getUser, signUp, getOne } = require('../controller/userController')

router.get('/me', auth, getUser);
router.get('/:id', auth, getOne)
router.post('/', signUp)

module.exports = router;