const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .send({
                statusCode: 401,
                message: "Access denied. No token provided."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res
            .status(403)
            .send({
                statusCode: 403,
                message: "Invalid token"
            });
    }
}
