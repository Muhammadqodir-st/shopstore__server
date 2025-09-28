const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer',
    }
});

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_PRIVATE_KEY);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;