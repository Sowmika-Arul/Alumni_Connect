// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Fetch all events
router.get('/events', eventController.getAllEvents);

// Create a new event
router.post('/events', eventController.createEvent);

// Update an event by ID
router.put('/events/:id', eventController.updateEvent);

// Delete an event by ID
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
