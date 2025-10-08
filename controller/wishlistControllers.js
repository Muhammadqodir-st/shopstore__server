const { User } = require('../models/userModels');

// METHOD = GET
// get all wishlist
const getAllWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.params._id).populate('wishlist');

        res.json({ success: true, wishlist: user.wishlist })
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error!' })
    }
}

// METHOD = POST
// push wishlist
const newWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error!' })
    }
};


// METHOD = DELETE
// delete wishlist
const deleteWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
        const productId = req.params.productId;

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.json({ success: false, message: 'server error!' })
    }
};

module.exports = { getAllWishlist, newWishlist, deleteWishlist };