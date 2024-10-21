// src/services/eventService.js
const Event = require('../models/eventModel'); // Ensure the path to your Event model is correct

const fetchAllEvents = async () => {
    return await Event.find({});
};

const createEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save();
};

const updateEventById = async (id, updateData) => {
    return await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteEventById = async (id) => {
    return await Event.findByIdAndDelete(id);
};

module.exports = {
    fetchAllEvents,
    createEvent,
    updateEventById,
    deleteEventById,
};
