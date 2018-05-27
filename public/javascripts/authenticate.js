const { SchemaModel } = require("./User_Schema");

const authenticate = function (req, res, next) {
    const token = req.cookies.authorizationToken;

    console.log('user token:', token);
    SchemaModel.findByToken(token).then(function (user) {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch(function (e) {
        res.status(401).send();
    });
}

module.exports = {authenticate};
