module.exports = function admin(req, res, next) {
    if (req.user.role === 'customer') {
        return res.status(403).json({
            success: false,
            message: 'the appeal was rejected'
        })
    };

    next();
}