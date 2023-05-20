const passport = require('passport');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors')

module.exports = (app, express, root) => {
    app.use(compression());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());
    // Enable request logs
    require("./request.log")(app);
}