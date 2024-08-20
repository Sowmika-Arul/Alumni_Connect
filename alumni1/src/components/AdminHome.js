// src/AdminHome.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
    const [events, setEvents] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [venue, setVenue] = useState('');
    const [time, setTime] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('rollNo'); // Clear rollNo on logout
        navigate('/');
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5050/events');
            const data = await response.json();
            setEvents(data.events);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5050/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, date, venue, time })
            });

            if (response.ok) {
                fetchEvents();
                setName('');
                setDate('');
                setVenue('');
                setTime('');
            } else {
                console.error('Failed to add event');
            }
        } catch (err) {
            console.error('Error adding event:', err);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            const response = await fetch(`http://localhost:5050/events/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchEvents();
            } else {
                console.error('Failed to delete event');
            }
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            const response = await fetch(`http://localhost:5050/events/${editingEvent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, date, venue, time })
            });

            if (response.ok) {
                fetchEvents();
                setName('');
                setDate('');
                setVenue('');
                setTime('');
                setEditingEvent(null);
            } else {
                console.error('Failed to update event');
            }
        } catch (err) {
            console.error('Error updating event:', err);
        }
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setName(event.name);
        setDate(event.date.split('T')[0]); // Convert to YYYY-MM-DD format
        setVenue(event.venue);
        setTime(event.time);
    };

    return (
        <div className="admin-home">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <h1>Upcoming Events</h1>
            <form onSubmit={handleAddEvent} className="admin-form">
                <h2>Add Event</h2>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
                <button type="submit">Add Event</button>
            </form>

            {editingEvent && (
                <form onSubmit={handleUpdateEvent} className="admin-form">
                    <h2>Edit Event</h2>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    <button type="submit">Update Event</button>
                </form>
            )}

            <h2>Existing Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event._id}>
                        <h3>{event.name}</h3>
                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p>Venue: {event.venue}</p>
                        <p>Time: {event.time}</p>
                        <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                        <button onClick={() => handleEditClick(event)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminHome;
