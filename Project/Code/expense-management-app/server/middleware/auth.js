/**
 * A middleware responsible for authorizing user before letting it access protected
 * server resources.
 */
const axios = require('axios');

const authorizeRequest = (req, res, next) => {
    console.log('verifyToken');

    let config = {
        headers: {
            authorization: req.headers['authorization']
        }
    };

    return axios.get(`${process.env.APP_SERVER_USER_URL}/auth`, config)
        .then(response => {
            req.userId = response.data.userId;
            req.userEmail = response.data.userEmail;
            next();
        })
        .catch(error => {
            let errorMessage = error.response?.data?.message || error.toString();
            console.error(errorMessage);
            res.status(error.status || 500).json({ message: errorMessage });
        });
};

module.exports = authorizeRequest;