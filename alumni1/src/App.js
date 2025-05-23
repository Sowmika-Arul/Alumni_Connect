import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
// import Signup from './components/Signup';
import AlumniList from './components/AlumniList';
import Home from './components/Home';
import Profile from './components/Profile';
import AdminHome from './components/AdminHome';
import Events from './components/Events';
import Donate from './components/Donate';
import JobApplication from './components/JobApplication';
import AlumniDetail from './components/Alumni_info';
import Transaction from './components/Transaction';
import Videolist from './components/VideoList';
import VideoUpload from './components/VideoUpload';
import Projects from './components/ProjectUpload';
import Innovatives from './components/Innovatives';
// import VerifyEmail from "./components/VerifyEmail"; 
// import SetPassword from './components/SetPassword';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/alumni_list" element={<AlumniList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/adminHome" element={<AdminHome />} />
                <Route path="/jobs" element={<JobApplication />} />
                <Route path="/events" element={<Events />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/alumni_details/:rollNo" element={<AlumniDetail/>} />
                <Route path="/transaction" element={<Transaction/>} />
                <Route path="/videolist" element={<Videolist />} />
                <Route path="/videoupload" element={<VideoUpload />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/innovatives" element={<Innovatives />} />
                {/* <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/set-password" element={<SetPassword />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
