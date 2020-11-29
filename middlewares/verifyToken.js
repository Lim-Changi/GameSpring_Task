const jwt = require('../modules/jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const verifyToken = {
    checkToken: async (req, res, next) => {
        try {
            const bearertoken = req.cookies.authorization;
            const bearer = bearertoken.split(' ');
            const token = bearer[1];
            if (!token) {
                req.flash('error_message', '로그인이 필요합니다')
                return res.status(500).redirect('/');
            }
            const user = await jwt.verify(token);
            if (user === TOKEN_EXPIRED) {
                req.flash('error_message', '로그인이 필요합니다')
                return res.status(401).redirect('/');
            }
            if (user === TOKEN_INVALID) {
                req.flash('error_message', '로그인이 필요합니다')
                return res.status(401).redirect('/');
            }
            if (user.id === undefined) {
                req.flash('error_message', '로그인이 필요합니다')
                return res.status(401).redirect('/');
            }
            req.decoded = user;
            next();
        } catch (error) {

            return res.status(500).redirect('/');
        }

    }
}
module.exports = verifyToken;