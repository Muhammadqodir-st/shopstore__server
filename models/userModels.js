const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');


const userSchema = mongoose.Schema({
    name: {
        trype: String,
        minlength: 3,
        required: true
    },
    email: {
        String,
        unique: true,
        required: true
    },
    password: {
        trype: String,
        minlength: 8,
        required: true
    }
});

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this, _id }, process.env.JWT_PRIVATE_KEY);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;