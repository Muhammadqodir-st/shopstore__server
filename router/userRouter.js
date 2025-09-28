const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware')
const { getUser, signUp } = require('../controller/userController')

router.get('/me', auth, getUser)
router.post('/', signUp)

module.exports = router;