// Internal Imports
const express = require('express');

// Custom Imports
const controller = require('./poll.controller');
const auth = require('../../authentication/auth.service');

const router = express.Router();


// To register new user
router.post('/AddPoll',auth.isAuthenticated(), controller.AddPoll);
router.post('/GetAllPoll',auth.isAuthenticated(), controller.GetAllPoll);
router.get('/GetPoll/:id',auth.isAuthenticated(), controller.GetPoll);
router.post('/VotePoll/:id',auth.isAuthenticated(), controller.VotePoll);
module.exports = router;
