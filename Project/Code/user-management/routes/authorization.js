const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const userAuthCache = require("../model/user_auth_cache");
const jwtUtils = require("../model/jwt_util");

// GET to verify JWT.
// Use this by our micro services in order to verify that a specified JWT is valid
// We just return 200 OK to indicate success. auth will return 401 in case of error.
router.get('/isvalid', auth, function (req, res) {
    if (userAuthCache.get(req.user.userId) !== req.jwt) {
        // Server recognized the request, but it is not a correct JWT.
        res.status(403).json({message: '403 Forbidden'});
    } else {
        res.status(200).json({message: '200 OK'});
    }
});

// Generate a new JWT for specified user identifier
router.put('/renew/user/:userId', function (req, res) {
    let token = jwtUtils.extractTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({
            message: 'A token is required for authorization'
        });
    }

    jwtUtils.verify(token)
        .then(claims => {
            token = jwtUtils.sign(claims.userId);
            userAuthCache.put(claims.userId, token);
            res.status(200).json({jwt: token});
        })
        .catch(error => {
            if (error.name === 'TokenExpiredError') {
                token = jwtUtils.sign(req.params.userId);
                userAuthCache.put(req.params.userId, token);
                res.status(200).json({jwt: token});
            } else {
                res.status(401).json({message: 'Invalid Token'});
            }
        });
});

module.exports = router;
