const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/jpg"]
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, new Error('Only .png  .jpg  and .jpeg  format alowed!'), false)
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;