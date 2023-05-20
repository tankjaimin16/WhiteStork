const util = require('util');

module.exports = (app) => {

    app.use((req, res, next) => {

        let ip = req.connection.remoteAddress;

        console.info(`${req.url} request from:- ${ip}`);

        if (req.method.toLowerCase() === 'get') {

            console.info(util.format('request query:- %j', req.query));

        } else {

            console.info(util.format('request body:- %j', req.body));
        }
        next();
    });

};
