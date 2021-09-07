/**
 * A middleware responsible for authorizing user before letting it access server
 * resources.
 */

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const bearerPrefix = 'bearer ';
    let token = req.headers['Authorization'];

    if (token && token.toLowerCase().startsWith(bearerPrefix)) {
        token = token.substring(bearerPrefix.length - 1);
    }

    if (!token) {
        token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({
                message: 'A token is required for authorization'
            });
        }
    }

    try {
        req.user = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    return next();
};

module.exports = verifyToken;