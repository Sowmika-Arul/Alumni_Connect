import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import LoginForm from './components/LoginForm';
=======
>>>>>>> cb675ef4099602d0b5daf3494726dc93a8736fff
import Login from './components/Login';
import AlumniList from './components/AlumniList';
import Home from './components/Home';
import Profile from './components/Profile';
import Add from './components/Add_information';
import AdminHome from './components/AdminHome';
import AlumniDetails from './components/AlumniDetails';
import Events from './components/Events';
import JobApplication from './components/JobApplication';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/alumni_list" element={<AlumniList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add_information" element={<Add />} />
                <Route path="/adminHome" element={<AdminHome />} />
                <Route path="/alumni_details/:rollNo" element={<AlumniDetails />} />
                <Route path="/events" element={<Events />} />
<<<<<<< HEAD
                <Route path="/jobs" element={<JobApplication />} />
               
=======
                <Route path="/images" element={<ImageGallery />} />
>>>>>>> cb675ef4099602d0b5daf3494726dc93a8736fff
            </Routes>
        </Router>
    );
}

export default App;
