const { User } = require('../models/userModels');

// METHOD = GET
// get all wishlist
const getAllWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

// METHOD = POST
// push wishlist
const newWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.body;

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ success: true, wishlist: user.wishlist, message: 'product added to wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error!' })
    }
};


// METHOD = DELETE
// delete wishlist
const deleteWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        
        const userId = req.user._id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());

        await user.save();

        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.json({ success: false, message: 'server error!' })
        console.log(error);

    }
};

module.exports = { getAllWishlist, newWishlist, deleteWishlist };