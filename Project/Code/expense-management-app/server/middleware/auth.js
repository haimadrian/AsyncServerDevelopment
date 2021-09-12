/**
 * A middleware responsible for authorizing user before letting it access protected
 * server resources.
 */
const axios = require('axios');

const authorizeRequest = (req, res, next) => {
    console.log('verifyToken');

    return axios.get(process.env.APP_SERVER_USER_URL)
        .then(response => {
            if (response.status !== 200) {
                res.status(response.status).json({message: response.data.message});
            } else {
                req.userId = response.data.userId;
                next();
            }
        })
        .catch(error => {
            console.error(error);
            res.status(403).json({message: 'Invalid Token'});
        });
};

module.exports = authorizeRequest;