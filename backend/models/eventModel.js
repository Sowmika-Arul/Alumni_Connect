const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    time: { type: String, required: true },
}, { collection: 'Events' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event