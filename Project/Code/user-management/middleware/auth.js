/**
 * A middleware responsible for authorizing user before letting it access protected
 * server resources.
 */

const jwtUtils = require("../model/jwt_util");
const userAuthCache = require("../model/user_auth_cache");
const firebase = require('../firebase');

const verifyToken = async (req, res, next) => {
    console.log('verifyToken');
    const token = jwtUtils.extractTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({
            message: 'A token is required for authorization'
        });
    }

    // Cache it to reduce requests that we send to firebase.
    if (userAuthCache.contains(token)) {
        let userData = userAuthCache.get(token);
        req.userId = userData.uid;
        req.userEmail = userData.email;
        req.jwt = token;
        next();
    } else {
        try {
            // Verify the token and set user details in the request, so our web services
            // can use it
            let decodedToken = await firebase.app.auth().verifyIdToken(token);
            userAuthCache.put(token, {
                uid: decodedToken.uid,
                email: decodedToken.email
            });

            req.userId = decodedToken.uid;
            req.userEmail = decodedToken.email;
            req.jwt = token;
            next();
        } catch (error) {
            let errorMessage = 'Invalid Token';

            if (error.message.toString().toLowerCase().includes('expired')) {
                errorMessage = 'Token Expired';
            }

            res.status(403).json({
                message: errorMessage
            });
        }
    }
};

module.exports = verifyToken;