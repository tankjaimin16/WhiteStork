// Internal Imports
const express = require('express');

// Custom Imports
const controller = require('./user.controller');

const router = express.Router();


// To register new user
router.post('/register', controller.register);

module.exports = router;
