/**
 * A middleware responsible for authorizing user before letting it access protected
 * server resources.
 */

const jwtUtils = require("../model/jwt_util");
const userAuthCache = require("../model/user_auth_cache");
const firebase = require('../firebase');

const verifyToken = (req, res, next) => {
    console.log('verifyToken');
    const token = jwtUtils.extractTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({
            message: 'A token is required for authorization'
        });
    }

    // Cache it to reduce requests that we send to firebase.
    if (userAuthCache.contains(token)) {
        req.userId = userAuthCache.get(token);
        req.jwt = token;
    } else {
        // Verify the token and set user details in the request, so our web services
        // can use it
        firebase.app.auth().verifyIdToken(token)
            .then((decodedToken) => {
                userAuthCache.put(token, decodedToken.uid);
                req.userId = decodedToken.uid;
                req.jwt = token;
                next();
            })
            .catch((error) => {
                let errorMessage = 'Invalid Token';

                if (error.message.toString().toLowerCase().includes('expired')) {
                    errorMessage = 'Token Expired';
                }

                res.status(403).json({
                    message: errorMessage
                });
            });
    }
};

module.exports = verifyToken;