// Bring Mongoose into the app
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('../config');

mongoose.set('useCreateIndex', true);

// Create the database connection
mongoose.connect(config.get("db.uri"), { useNewUrlParser: true, useUnifiedTopology: true });

/** CONNECTION EVENTS */

// When successfully connected
mongoose.connection.on('connected', () => {
    console.info(`Mongoose default connection open to ${config.get("db.name")}`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.debug('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// Initialize Models
require("./models")();