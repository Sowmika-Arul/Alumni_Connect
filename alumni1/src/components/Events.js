// src/Events.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';


const Events = () => {
    const [events, setEvents] = useState([]);

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
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('rollNo'); // Clear rollNo on logout
        navigate('/');
    };
    return (
        <div className="events">
            <h1>Upcoming Events</h1>
            <button onClick={handleLogout}>Logout</button>
            {events.length > 0 ? (
                <ul>
                    {events.map(event => (
                        <li key={event._id}>
                            <h2>{event.name}</h2>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Venue: {event.venue}</p>
                            <p>Time: {event.time}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
};

export default Events;
