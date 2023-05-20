const mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

const OptionSchema = new Schema({
    name: { type: String, required: true },
    imageURL: { type: String, default:"http://localhost:3052/templates/images/logo.png" },
    overallTotalEnergySpent: { type: Number, default: 0 }
},schemaOptions);

OptionSchema
    .pre('save', function (next) {
        this.last_updated = new Date();
        return next();
    });
OptionSchema.plugin(autopopulate);

module.exports = mongoose.model('Options', OptionSchema);