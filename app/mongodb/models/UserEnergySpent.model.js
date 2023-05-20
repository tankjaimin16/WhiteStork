const mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

const UserEnergySpentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    option: { type: Schema.Types.ObjectId, ref: 'Options', required: true},
    currentUserEnergySpent: { type: Number, default:0 },
},schemaOptions);

UserEnergySpentSchema
    .pre('save', function (next) {
        this.last_updated = new Date();
        return next();
    });
UserEnergySpentSchema.plugin(autopopulate);

module.exports = mongoose.model('UserEnergySpent', UserEnergySpentSchema);