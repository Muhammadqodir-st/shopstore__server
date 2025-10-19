const { User } = require('../models/userModels');

// METHOD = GET
// get all order
const getAllorder = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('order.products.product')

        res.json({ success: true, order: user.order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// METHOD = POST
// push new orders
const createOrders = async (req, res) => {
    try {
        const { firstName, lastName, state, city, street, phone, email, orders, totalPrice, deliveryDays } = req.body

        if (!firstName || !lastName || !state || !city || !street || !phone || !email || !orders || !totalPrice || !deliveryDays) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' })
        };

        const user = await User.findById(req.user._id).populate('order');

        user.order.push({ firstName, lastName, state, city, street, phone, email, products: orders, deliveryDays, totalPrice });

        await user.save();

        res.json({ success: true, message: 'Order placed successfully', order: user.order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error);
    }
};

module.exports = { getAllorder, createOrders };