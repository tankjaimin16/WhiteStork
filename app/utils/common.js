
// External Imports
const mongoose = require("mongoose");
const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// Custom Imports
const englishMsg = require("../utils/en.json");
/**
 * @description Common function to send response
 * @param {}
 */
exports.sendResponse = (data, is_error, message, lang) => {
  let json = { data: data, is_error: is_error, message: message };
  if (is_error === undefined) {
    json.is_error = false;
  }
  if (message === undefined) {
    json.message = "";
  } else {
    json.message = englishMsg[message] ?? message;
  }
  return json;
};

/**
 * @description check mongoose ID 
 * @param {}
 */
exports.checkParamsId = (id) => {
  return new Promise((resolve, reject) => {
    if (isValidObjectId(id)) {
      return resolve("")
    }
    return reject("IDNOTPROPER")
  });
};

