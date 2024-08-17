// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AlumniList from './components/AlumniList';
import Home from './components/Home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/alumni_list" element={<AlumniList />} />
                <Route path="/home" element={<Home />} />
                
            </Routes>
        </Router>
    );
}
export default App;
