/**
 * A middleware responsible for authorizing user before letting it access protected
 * server resources.
 */

const jwtUtils = require("../model/jwt_util");

const verifyToken = (req, res, next) => {
    console.log('verifyToken');
    const token = jwtUtils.extractTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({
            message: 'A token is required for authorization'
        });
    }

    // Verify the token and set user details in the request, so our web services
    // can use it
    jwtUtils.verify(token)
        .then(claims => {
            console.log('verifyToken: Success');
            req.user = claims;
            req.jwt = token;
            next();
        })
        .catch(error => {
            console.log('verifyToken: error - ', error);
            res.status(401).json({message: 'Invalid Token'});
        });
};

module.exports = verifyToken;