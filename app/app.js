// Internal imports
const path = require("path");
const http = require("http");

// External Imports
const express = require("express");
const bodyParser = require('body-parser');

// Custom Imports 
const config = require("./config");

// Initialize express
const app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/templates'));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize mongo connection
require("./mongodb")

// Setup Server
const server = http.createServer(app);

// Initialize middlewares
require("./middlewares")(app, express, __dirname);

// Initialize routes
require("./routes")(app);

// Initialize common services
require("./utils/common")


// Set server port
app.set("PORT", config.get("server.port"));
// 
app.get('/',  (req, res)=> {
    res.send("WhiteShort running on port : " + app.get("PORT"));
});

// Start server
function startServer() {
    server.listen(app.get("PORT"), function () {
        console.log('Express server listening on %d, in %s mode', app.get("PORT"),app.get("env"));
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
