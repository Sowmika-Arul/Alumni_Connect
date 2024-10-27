import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AlumniList from './components/AlumniList';
import Home from './components/Home';
import Profile from './components/Profile';
import AdminHome from './components/AdminHome';
import Events from './components/Events';
import Donate from './components/Donate';
import JobApplication from './components/JobApplication';
import AlumniDetail from './components/Alumni_info';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/alumni_list" element={<AlumniList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/adminHome" element={<AdminHome />} />
                <Route path="/jobs" element={<JobApplication />} />
                <Route path="/events" element={<Events />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/alumni_details/:rollNo" element={<AlumniDetail/>} />
            </Routes>
        </Router>
    );
}

export default App;
