const mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

const PollSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    options: [{ type: Schema.Types.ObjectId, ref: 'Options' }]
},schemaOptions);

PollSchema
    .pre('save', function (next) {
        this.last_updated = new Date();
        return next();
    });
PollSchema.plugin(autopopulate);

module.exports = mongoose.model('Polls', PollSchema);