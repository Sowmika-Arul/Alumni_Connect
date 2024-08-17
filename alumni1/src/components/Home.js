import React from 'react';
import './Home.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <img src="/images/ab1.png" alt="Logo" className="logo" />
        <div className="contact-info">
          <span>Call Us: 9874563210</span>
          <span>Email: support@govt.com</span>
          <span>Location: Gujarat</span>
        </div>
        <div className="social-media">
          <i className="fa-solid fa-envelope"></i>
          <i className="fa-solid fa-location-dot"></i>
          <i className="fa-solid fa-phone"></i>
        </div>
      </div>
    </header>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/alumni_list">Our Alumni</a></li>
        <li><a href="/team">Events</a></li>
        <li><a href="/contact">Donation</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
};

const MainContent = () => {
  return (
    <main className="main-content">
      <section className="hero">
        <h1>WELCOME TO OUR UNIVERSITY</h1>
        <button>About us</button>
      </section>
      <section className="courses">
        <div className="frame-container">
          <div className="black-transparent-frame1">Showcase inspiring success stories from your alumni network. Highlight their journey, achievements, and contributions to their industries.</div>
          <div className="black-transparent-frame2">Promote upcoming alumni events, reunions, and networking opportunities. Include event dates, locations, and a brief overview.</div>
          <div className="black-transparent-frame3">Highlight the various benefits and resources available to alumni, such as career services, mentorship programs, and access to exclusive content.</div>
        </div>
      </section>
    </main>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      {/* Add footer content here */}
    </footer>
  );
};

const Home = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <MainContent />
      <Footer />
    </div>
  );
};

export default Home;
