// Internal Imports
const path = require('path');

// External Imports
const convict = require('convict');

// Define a schema
const config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development"],
        default: "development",
        env: "NODE_ENV"
    },
    server: {
        ip: {
            doc: "The IP address to bind.",
            format: "ipaddress",
            default: "127.0.0.1",
            env: "IP_ADDRESS",
        },
        port: {
            doc: "The port to bind.",
            format: "port",
            default: 3052,
            env: "PORT",
            arg: "port"
        },
    },
    JWT: {
        expireTime: {
            doc: 'Token Expiration time',
            format: Number,
            default: 60 * 43800 // 1 month
        },
        tokenSecret: {
            doc: 'Token Secret',
            format: String,
            default: "WhiteShort-secret"
        }
    },
    db: {
        uri: {
            doc: "Database host name/IP",
            format: 'String',
            default: "mongodb+srv://admin:WhiteStorkTest123@cluster0.llftlmi.mongodb.net/Demo?retryWrites=true&w=majority"
        },
        name: {
            doc: "Database name",
            format: String,
            default: 'whiteStork'
        }
    }
});

// Load environment dependent configuration
let env = config.get('env');

// process.exit();
config.loadFile(`${__dirname}/${env}.json`);

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
