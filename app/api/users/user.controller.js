// Internal Imports
const mongoose = require("mongoose");


// Custom Imports
const { responseStatus } = require("../../utils/constants");
const { sendResponse } = require("../../utils/common");
// Models
const User = mongoose.model("User");

/**
 * Creates a new user
 */
exports.register = async (req, res) => {
    try {

        let data = req.body;
        let lang = req.headers.lang
        if (!data.email || !data.password) {
            return res.status(responseStatus.code_400).send(sendResponse(null, true, "BAD_REQUEST", lang));
        }
        let user = await User.findOne({ email: data.email })
        if (user) {
            return res.status(responseStatus.code_400).send(sendResponse(user, true, "NOT_ACCEPTABLE", lang));
        }
        user = await User.create(data)
        if (!user) {
            return res.status(responseStatus.code_403).send(sendResponse(user, true, "NOT_ACCEPTABLE", lang));
        }

        return res.status(responseStatus.code_201).send(sendResponse(user, false, "SUCCESS", lang));

    } catch (error) {
        return res.status(responseStatus.code_500).send(sendResponse(null, true, error.message));
    }
};
