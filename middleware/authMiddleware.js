const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    // token tekshiruvi
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'The application was rejected due to lack of a token'
        })
    };

    // ... tekshiruv
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'invalid token' })
    }
};