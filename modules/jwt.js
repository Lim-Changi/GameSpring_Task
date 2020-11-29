const jwt = require('jsonwebtoken');
const { secretKey, options } = require('../config/secretKey');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async (user) => {
        const payload = {
            id: user.id,
            userId: user.userId,
        };
        const token = jwt.sign(payload, secretKey, options);
        return token;
    },
    verify: async (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {

                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {

                return TOKEN_INVALID;
            } else {

                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}