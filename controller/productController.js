const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, bucketName } = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/productModels');
const { Category } = require('../models/categoryModels');


// METHOD = GET
// get all product
const getAllProduct = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category) filter.category = category;

        const products = await Product.find(filter)
            .populate('category', 'name')
            .populate('createdBy', 'name email role');

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// METHOD = GET
// get all product
const getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('createdBy', 'name email role');

        if (!product) return res.status(404).json({ success: false, message: 'No product found' });

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// METHOD = POST
// get all product
const createProduct = async (req, res) => {
    try {
        const { title, description, price, discountPercent, stock, category } = req.body;

        if (!title || !description || !price || !stock || !category)
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });

        if (price < 0 || stock < 0)
            return res.status(400).json({ success: false, message: 'Price and stock must be non-negative' });

        if (discountPercent && (discountPercent < 0 || discountPercent > 100))
            return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100' });

        const isCategory = await Category.findById(category);
        if (!isCategory)
            return res.status(400).json({ success: false, message: 'Invalid category ID' });

        if (!req.files || req.files.length === 0)
            return res.status(400).json({ success: false, message: 'At least one image required' });

        if (req.files.length > 5)
            return res.status(400).json({ success: false, message: 'Maximum 5 images allowed' });

        // 🔹 AWS upload
        const imageUrls = [];
        for (const file of req.files) {
            const fileName = `${uuidv4()}.webp`;
            const uploadParams = {
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            await s3Client.send(new PutObjectCommand(uploadParams));
            const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            imageUrls.push(imageUrl);
        }

        const product = await Product.create({
            title,
            description,
            price,
            stock,
            discountPercent,
            category,
            createdBy: req.user._id,
            images: imageUrls,
            mainImage: imageUrls[0],
        });

        res.status(201).json({ success: true, message: 'Product created', product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// METHOD = PUT
// product update by id
const uploadProduct = async (req, res) => {
    try {
        const { title, description, price, discountPercent, stock, category } = req.body;

        if (!title || !description || !price || !stock || !category)
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });

        const isCategory = await Category.findById(category);
        if (!isCategory)
            return res.status(400).json({ success: false, message: 'Invalid category ID' });

        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'No product found' });

        let imageUrls = product.images;

        if (req.files && req.files.length > 0) {
            // eski rasmlarni o‘chirish
            for (const imageUrl of product.images) {
                const key = imageUrl.split('.com/')[1];
                await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
            }

            imageUrls = [];
            for (const file of req.files) {
                const fileName = `${uuidv4()}.webp`;
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                await s3Client.send(new PutObjectCommand(uploadParams));
                const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
                imageUrls.push(imageUrl);
            }
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                price,
                stock,
                discountPercent,
                category,
                createdBy: req.user._id,
                images: imageUrls,
                mainImage: imageUrls[0],
            },
            { new: true }
        );

        res.json({ success: true, message: 'Product updated', product: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// METHOD = DELETE
// product delete by id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'No product found' });

        for (const imageUrl of product.images) {
            const key = imageUrl.split('.com/')[1];
            await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
        }

        await product.deleteOne();

        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { getAllProduct, getById, createProduct, uploadProduct, deleteProduct };