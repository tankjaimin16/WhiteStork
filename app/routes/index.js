/**
 * Main application routes
 */
const path = require('path');

module.exports = (app) => {
// Insert routes below
    app.use('/auth', require('../authentication'));
    app.use('/api/users', require('../api/users'));
    app.use('/api/polls', require('../api/polls'));
    app.use('/api/options', require('../api/option'));
};
