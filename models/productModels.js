const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    discountedPrice: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    reating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    },
    mainImage: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

function arrayLimit(val) {
    return val.length <= 3;
};

productSchema.pre("save", function (next) {
    if (this.discountPercent > 0) {
        this.discountedPrice = this.price - (this.price * this.discountPercent / 100)
    } else {
        this.discountedPrice = this.price
    }
    next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;