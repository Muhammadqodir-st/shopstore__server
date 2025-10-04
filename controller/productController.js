const Product = require('../models/productModels');
const { Category } = require('../models/categoryModels');

// METHOD = GET
// get all product
const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .populate("createdBy", "name email role")

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
            .populate("category", "name")
            .populate("createdBy", "name email role")

        if (!product) {
            return res.status(404).json({ success: false, message: 'No product found' })
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// METHOD = POST
// get all product
const createProduct = async (req, res) => {
    try {
        const { title, description, price, discountPercent, stock, category } = req.body

        if (!title || !description || !price || !stock || !category) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' })
        }

        if (price < 0 || stock < 0) {
            return res.status(400).json({ success: false, message: 'Price and stock must be non-negative' })
        }

        if (discountPercent && (discountPercent < 0 || discountPercent > 100)) {
            return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100' })
        }

        const isCategory = await Category.findById(category);
        if (!isCategory) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' })
        };

        const images = req.files ? req.files.map(file => file.filename) : [];
        if (images.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image required' });
        }

        if (images.length > 5) {
            return res.status(400).json({ success: false, message: 'Maximum 5 images allowed' });
        }

        const product = await Product.create({
            title,
            description,
            price,
            stock,
            discountPercent,
            category,
            createdBy: req.user._id,
            images,
            mainImage: images[0]
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// METHOD = PUT
// product update by id
const uploadProduct = async (req, res) => {
    try {
        const { title, description, price, discountPercent, stock, category } = req.body

        if (!title || !description || !price || !stock || !category) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' })
        }

        if (price < 0 || stock < 0) {
            return res.status(400).json({ success: false, message: 'Price and stock must be non-negative' })
        }

        if (discountPercent && (discountPercent < 0 || discountPercent > 100)) {
            return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100' })
        }

        const isCategory = await Category.findById(category);
        if (!isCategory) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' })
        };

        const images = req.files ? req.files.map(file => file.filename) : [];
        if (images.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image required' });
        }

        if (images.length > 5) {
            return res.status(400).json({ success: false, message: 'Maximum 5 images allowed' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                price,
                stock,
                discountPercent,
                category,
                createdBy: req.user._id,
                images,
                mainImage: images[0]
            },
            { new: true }
        );

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// METHOD = DELETE
// product delete by id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'No product found' })
        }

        res.status(201).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { getAllProduct, getById, createProduct, uploadProduct, deleteProduct };