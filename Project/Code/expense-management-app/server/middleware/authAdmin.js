/**
 * A middleware responsible for authorizing admin before letting it access protected
 * server resources.
 */

const jwtUtils = require("../model/jwt_util");

const verifyToken = (req, res, next) => {
    const token = jwtUtils.extractTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({
            message: 'A token is required for authorization'
        });
    }

    // Verify the token
    jwtUtils.verify(token)
        .then(userInfo => {
            if ((userInfo.EXPENSE_DB_USERNAME !== JSON.stringify(encode(process.env.EXPENSE_DB_USERNAME))) ||
                (userInfo.EXPENSE_DB_PWD !== JSON.stringify(encode(process.env.EXPENSE_DB_PWD)))) {
                // Let it go to catch
                throw new Error();
            }

            next();
        })
        .catch(() => {
            res.status(403).json({
                message: 'Invalid Token'
            });
        });
};

function encode(text) {
    const encoder = new TextEncoder();
    return encoder.encode(text);
}

module.exports = verifyToken;