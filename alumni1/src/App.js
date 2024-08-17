// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AlumniList from './components/AlumniList';
import Home from './components/Home';
import Profile from './components/Profile'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/alumni_list" element={<AlumniList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />   
            </Routes>
        </Router>
    );
}
export default App;
