const express = require('express');
const mongoose = require("mongoose");
const config = require('../config');
const User = mongoose.model("User");

// Passport Configuration
require('./local/passport').setup(User, config);

const router = express.Router();

router.use('/local', require('./local'));

module.exports = router;
