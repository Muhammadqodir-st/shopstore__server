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
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 }
        }
    ],
    order: [
        {
            products: [
                {
                    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                    quantity: { type: Number, default: 1 }
                }
            ],
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            state: { type: String, required: true },
            city: { type: String, required: true },
            street: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
            deliveryDays: { type: Number, default: 2 },
            totalPrice: { type: Number, required: true }
        }
    ]
});

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, role: this.role, wishlist: this.wishlist, cart: this.cart, orders: this.orders }, process.env.JWT_PRIVATE_KEY);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('customer', 'vendor', 'admin')
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;