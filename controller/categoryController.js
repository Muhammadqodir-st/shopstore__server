const { Category, validate } = require('../models/categoryModels');

// METHOD = GET
// get all category
const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        if (categories.length === 0) {
            return res.status(404).json({ success: false, categories })
        }

        res.json({ success: true, categories })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// METHOD = GET
// get category by id
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'No category found' })
        };

        res.json({ success: true, category })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// METHOD = POST
// create category
const createCategory = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        };

        let category = await Category.findOne({ name: req.body.name });
        if (category) {
            return res.json({ success: false, message: 'existing category' });
        };

        category = await Category.create({
            name: req.body.name
        });


        res.status(201).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// METHOD = PUT
// update by id category
const updateCategory = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        };

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true });
        if (!category) {
            return res.status(404).json({ success: false, message: 'No category found' })
        };

        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// METHOD = PUT
// update by id category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        res.json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory };