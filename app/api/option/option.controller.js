// Internal Imports
const mongoose = require("mongoose");


// Custom Imports
const { responseStatus } = require("../../utils/constants");
const { sendResponse } = require("../../utils/common");
// Models
const Options = mongoose.model("Options");

/**
 * Creates a new Options
 */
exports.AddOption = async (req, res) => {
    try {

        let data = req.body;
        let lang = req.headers.lang
        if (!data.name) {
            return res.status(responseStatus.code_400).send(sendResponse(null, true, "BAD_REQUEST", lang));
        }
        const OptionsData = await Options.create(data)
        if (!OptionsData) {
            return res.status(responseStatus.code_403).send(sendResponse(null, true, "NOT_ACCEPTABLE", lang));
        }

        return res.status(responseStatus.code_201).send(sendResponse(OptionsData, false, "SUCCESS", lang));

    } catch (error) {
        return res.status(responseStatus.code_500).send(sendResponse(null, true, error.message));
    }
};

