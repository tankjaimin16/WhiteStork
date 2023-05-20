// Internal Imports
const express = require('express');

// Custom Imports
const controller = require('./option.controller');
const auth = require('../../authentication/auth.service');

const router = express.Router();


// To register new user
router.post('/AddOption',auth.isAuthenticated(), controller.AddOption);
module.exports = router;
