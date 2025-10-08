const express = require('express');
const route = express.Router();
const { getAllWishlist, newWishlist, deleteWishlist } = require('../controller/wishlistControllers')

route.get('/', getAllWishlist);
route.post('/', newWishlist);
route.delete('/', deleteWishlist);

module.exports = route;