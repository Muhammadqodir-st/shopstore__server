const Product = require('../models/productModels');

// METHOD = GET
// get all product
const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()

        res.json({ success: true, products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};


// METHOD = GET
// get all product
const getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'No product found' })
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};


// METHOD = GET
// get all product
const createProduct = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}