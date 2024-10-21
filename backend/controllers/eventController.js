// src/controllers/eventController.js
const eventService = require('../services/eventService');

const getAllEvents = async (req, res) => {
    try {
        const events = await eventService.fetchAllEvents();
        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

const createEvent = async (req, res) => {
    const { name, date, venue, time } = req.body;

    try {
        const eventData = { name, date, venue, time };
        await eventService.createEvent(eventData);
        res.status(200).json({ message: 'Event added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedEvent = await eventService.updateEventById(id, updateData);

        if (updatedEvent) {
            res.status(200).json({ event: updatedEvent });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await eventService.deleteEventById(id);

        if (deletedEvent) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
