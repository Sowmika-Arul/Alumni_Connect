import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import ChatFeed from './components/ChatFeed';
import LoginForm from './components/LoginForm';
import Login from './components/Login';
import AlumniList from './components/AlumniList';
import Home from './components/Home';
import Profile from './components/Profile';
import Add from './components/Add_information';
import AdminHome from './components/AdminHome';
import AlumniDetails from './components/AlumniDetails';
import Events from './components/Events';
import ImageGallery from './components/Images';
import './App.css';

function App() {
    if (!localStorage.getItem('username')) {
        return (
            <LoginForm />
        );
    }

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
                <Route path="/images" element={<ImageGallery />} />
                {/* Chat Route */}
                <Route
                    path="/chat"
                    element={
                        <ChatEngine
                            height="100vh"
                            projectID="83613c3b-397a-4bd4-a528-c575ed4c1e0c"
                            userName={localStorage.getItem('username')}
                            userSecret={localStorage.getItem('password')}
                            renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
