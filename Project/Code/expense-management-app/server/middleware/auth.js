/**
 * A middleware responsible for authorizing user before letting it access protected
 * server resources.
 */
const axios = require('axios');

const authorizeRequest = async (req, res, next) => {
    const config = {
        headers: {
            authorization: req.headers['authorization']
        }
    };

    try {
        const response = await axios.get(`${process.env.APP_SERVER_USER_URL}/api/auth`, config);
        req.userId = response.data.userId;
        req.userEmail = response.data.userEmail;
        next();
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.toString();
        console.error(errorMessage);
        res.status(error.status || 500).json({message: errorMessage});
    }
};

module.exports = authorizeRequest;