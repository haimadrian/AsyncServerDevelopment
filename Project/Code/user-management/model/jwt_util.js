const jwt = require("jsonwebtoken");

class JwtUtils {
    static sign(userId)/*: Promise<any>*/ {
        return new Promise((resolve, reject) => {
            jwt.sign({userId: userId},
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

    static verify(token)/*: Promise<any>*/ {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.TOKEN_KEY, {}, (error, claims) => {
                if (error) {
                    reject(error);
                } else {
                    // Claims is a json contains userId and JWT options. e.g.
                    // { userId: 'haim@gmail.com', iat: 1631213488, exp: 1631220688 }
                    resolve(claims);
                }
            });
        });
    }

    static extractTokenFromRequest(request/*: Express.Request*/) {
        const bearerPrefix = 'bearer ';
        let token = request.headers['Authorization'];

        if (token && token.toLowerCase().startsWith(bearerPrefix)) {
            token = token.substring(bearerPrefix.length - 1);
        }

        if (!token) {
            token = request.body.token || request.query.token || request.headers['x-access-token'];
        }

        return token;
    }
}

module.exports = JwtUtils;
