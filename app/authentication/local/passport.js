const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

exports.setup = function (User, config) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, async (email, password, done) => {
        try {
            let existingUser = await User.findOne({ email: email.toLowerCase() });
            if (!existingUser) {
                return done(null, false, 'ERROR_EMAIL_NOT_REGISTERED');
            }

            let authenticated = existingUser.authenticate(password)

            if (!authenticated) {
                return done(null, false, 'ERROR_INVALID_EMAIL_PWD');
            } else {
                return done(null, existingUser);
            }
        } catch (error) {
            return done(error);
        }
    }));
};
