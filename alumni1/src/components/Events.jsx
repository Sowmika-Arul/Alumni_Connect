// src/Events.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Events.css';
import Navbar from './Navbar.jsx';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('https://alumni-connect-5ad6.onrender.com/api/events');
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
        <div>   
             <Navbar/>
        <div className="events">
            <h1>Upcoming Events</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            {events.length > 0 ? (
                <ul>
                    {events.map(event => (
    <li key={event._id}>
        <h2>{event.name}</h2>
        <div className="event-details">
            <span>Date: {new Date(event.date).toLocaleDateString()}</span>
            <span> | Venue: {event.venue}</span>
            <span> | Time: {event.time}</span>
        </div>
    </li>
))}
                </ul>
            ) : (
                <p className="no-events">No events found.</p>
            )}
        </div>
        </div>
    );
};

export default Events;
