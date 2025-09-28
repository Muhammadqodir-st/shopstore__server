const express = require('express');
const router = express.Router();
const { getUser, signUp } = require('../controller/userController')

router.get('/me', getUser)
router.post('/', signUp)

module.exports = router