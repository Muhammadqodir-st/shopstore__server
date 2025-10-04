const { User, validate } = require('../models/userModels');
const _ = require('lodash')
const bcrypt = require('bcrypt');


// get user 
const getUser = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.json({ success: true, user });
}


// sign up 
const signUp = async (req, res) => {
    try {
        // validate
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }

        // email tekshiruv
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, message: 'email available' })
        };

        // new user
        user = new User(_.pick(req.body, ['name', 'email', 'password', 'role']));

        // password hash
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt);

        // user save
        await user.save();

        // create token 
        const token = user.generateToken();

        // res
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path:'/'
        }).json({
            success: true,
            message: "User registered successfully",
            user: _.pick(user, ['_id', 'name', 'email', 'role'])
        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'server error' })
    }
}

module.exports = { getUser, signUp }