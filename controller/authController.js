const { User } = require('../models/userModels')
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi')

// login
const login = async (req, res) => {
    // validate
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message })
    }

    // email tekshiruv
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'Incorrect email or password' })
    };

    // password tekshiruv
    const isValidate = await bcrypt.compare(req.body.password, user.password);
    if (!isValidate) {
        return res.status(400).json({ success: false, message: 'Incorrect email or password' })
    };

    // create token 
    const token = user.generateToken();

    // res
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path:'/'
    }).json({ success: true, message: 'Login successful', user: _.pick(user, ['_id', 'name', 'email', 'role']) })
}

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(user);
}

module.exports = { login }