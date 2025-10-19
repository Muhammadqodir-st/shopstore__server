const express = require('express');
const route = express.Router();
const { getAllWishlist, newWishlist, deleteWishlist } = require('../controller/wishlistControllers');
const auth = require('../middleware/authMiddleware')

route.get('/:id', auth, getAllWishlist);
route.post('/', auth, newWishlist);
route.delete('/', auth, deleteWishlist);

module.exports = route;