const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client, bucketName } = require('../config/awsConfig')
const { Category, validate } = require('../models/categoryModels');
const { v4: uuidv4 } = require('uuid');



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
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const name = req.body.name.trim().toLowerCase();
        let category = await Category.findOne({ name });
        if (category) {
            return res.status(409).json({ success: false, message: 'Category already exists' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const fileName = `${uuidv4()}.webp`;

        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Failed to upload image to S3' });
        }


        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        category = await Category.create({
            name,
            image: imageUrl,
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

        const fileName = `${uuidv4()}.webp`;

        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Failed to upload image to S3' });
        }


        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;


        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, image: imageUrl },
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
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const key = category.image.split('.com/')[1]; 
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));

        await category.deleteOne();

        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory };