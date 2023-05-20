const crypto = require('crypto');
const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');
const _ = require('lodash');
const Schema = mongoose.Schema;
const authTypes = ['linkedin','local'];

let validatePresenceOf = function (value) {
    return value && value.length;
};

const schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, schemaOptions);


/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
UserSchema
    .path('password')
    .validate(function (password) {
        if (authTypes.indexOf(this.provider) !== -1) {
            return true;
        }
        return password.length;
    }, 'Password cannot be blank');


UserSchema
    .post('init', function (model) {
        this.wasNew = this.isNew;
        this.is_updated = false;
        this._original = model;
    });

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {

    this.last_updated = new Date();
    this.wasNew = this.isNew;

    if (this.isModified("firstName") || this.isModified("lastName") || this.isModified("email")) {
        this.is_updated = true;
    }

    if (!this.isNew) {
        return next();
    }

    // Handle new/update passwords
    if (this.isModified('password')) {
        if (!validatePresenceOf(this.password)) {
            next(new Error('Invalid password'));
        }
        // Make salt with a callback
        this.salt = this.makeSalt();
        this.password = this.encryptPassword(this.password);
        next();
    } else {
        next();
    }
});


/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate: function (password) {
        return this.password === this.encryptPassword(password);
    },

    /**
     * Make salt
     *
     * @param {Number} byteSize Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        let defaultByteSize = 16;
        return crypto.randomBytes(defaultByteSize).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password || !this.salt) {
            return null;
        }
        let defaultIterations = 10000;
        let defaultKeyLength = 64;
        let salt = new Buffer.from(this.salt, 'base64');
        let digest = "sha512"

        return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, digest)
            .toString('base64');
    }
};

/**
 * Removing password field fron json
 */
UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.salt;
    return obj;
}

UserSchema.plugin(autopopulate);

module.exports = mongoose.model('User', UserSchema);
