// Internal Imports
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const compose = require('composable-middleware');
const { sendResponse } = require("../utils/common");

// Custom Imports
const config = require('../config');

// Mongoose models
const User = mongoose.model("User");

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
let isAuthenticated = () => {
    return compose()
        // Validate jwt
        .use((req, res, next) => {

            const token = req.header("authorization");
            if (!token) return res.status(401).send(sendResponse(null, true, "EMPTYTOKEN"));

            // To validate jwt token
            req.user = verifyToken(token, res);
            next();

        })
        // Attach user to request
        .use(async (req, res, next) => {
            try {
                // To get user by id
                let existingUser = await User.findById(req.user._id);

                // 
                if (!existingUser) {
                    return res.status(401).send(sendResponse(null, true, "TOKENEXPIRE"));
                }

                // Attaching user to request
                req.user = existingUser;
                next();
            } catch (error) {
                next(error);
            }
        });
}
/**
 * Returns a jwt token signed by the app secret
 */
let signToken = (id) => {
    return jwt.sign({ _id: id }, config.get("JWT.tokenSecret"), { expiresIn:  config.get("JWT.expireTime") }); // 1 month
}

/**
 * Returns decode date stored in token after verification
 */
let verifyToken = (token, res) => {
    try {
        // To verify jwt token
        return jwt.verify(token, config.get("JWT.tokenSecret"));
    } catch (error) {
        res.status(400).send(sendResponse(null, true, "TOKENEXPIRE"));
    }
}
module.exports = {
    isAuthenticated,
    signToken
}