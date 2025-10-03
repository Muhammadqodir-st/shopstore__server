const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 4,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

function validate(category) {
    const schema = Joi.object({
        name: Joi.string().min(4).required()
    });

    return schema.validate(category);
}

module.exports = { Category, validate };