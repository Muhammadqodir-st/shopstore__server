const { User } = require('../models/userModels')
const Product = require('../models/productModels');

// METHOD = GET
// get all carts
const getAllCarts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product')

        res.json({ success: true, carts: user.cart })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};



// METHOD = POST
// add to cart
const newCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user._id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const exetingItem = user.cart.find(item => item.product.toString() === productId.toString());

        if (exetingItem) {
            exetingItem.quantity += quantity || 1;
        } else {
            user.cart.push({ product: productId, quantity: quantity || 1 })
        };

        await user.save();

        res.json({ success: true, message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};


// METHOD = DELETE
// remove cart
const deleteCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        let { productId } = req.body;

        if (!Array.isArray(productId)) {
            productId = [productId];
        }

        user.cart = user.cart.filter(item => !productId.includes(item.product.toString()));

        await user.save();

        res.json({ success: true, message: 'Products removed from cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};



// METHOD = PUT
// update one cart item
const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const cartItem = user.cart.find(item => item.product.toString() === productId.toString());

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        cartItem.quantity = quantity;

        await user.save();


        const cart = await User.findById(req.user._id).populate('cart.product');


        res.json({ success: true, message: 'Cart updated successfully', user: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { getAllCarts, newCart, deleteCart, updateCart };