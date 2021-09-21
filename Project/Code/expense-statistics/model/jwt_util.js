const jwt = require("jsonwebtoken");

function jwtSign(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload,
            process.env.TOKEN_KEY,
            {expiresIn: "2h"},
            (error, jwtValue) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(jwtValue);
                }
            });
    });
}

module.exports = jwtSign;
