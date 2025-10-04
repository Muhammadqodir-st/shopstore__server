const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cn) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalnameu));
    }
});

function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/jpg"]
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, Error('Only .png  .jpg  and .jpeg  format alowed!'), false)
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;