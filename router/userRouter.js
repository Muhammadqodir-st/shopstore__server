const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUser, signUp, logOut } = require('../controller/userController');

router.get('/me', auth, getUser);
router.post('/', signUp);
router.post('/logout', auth, logOut);

module.exports = router;