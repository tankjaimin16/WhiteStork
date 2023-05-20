const express = require('express');
const passport = require('passport');
const auth = require('../auth.service');
const { sendResponse } = require('../../utils/common');
const { responseStatus } = require('../../utils/constants');

const router = express.Router();

router.post('/', async (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        let lang = req.headers.lang;
        var error = error || info;
        if (error) {
            return res.status(responseStatus.code_200).send(sendResponse(null, true, error, lang));
        }
        if (!user) {
            return res.status(responseStatus.code_200).send(sendResponse(null, true, "NOT_FOUND", lang));
        }
        var token = auth.signToken(user._id);
        res.send(sendResponse({token:token},false,"SUCCESS",lang));
    })(req, res, next)
});

module.exports = router;
