import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <img src="/images/logo1.jpg" alt="Logo" className="logo" />
        <div className="contact-info">
          <span>Call Us: 9874563210</span>
          <span>Email: support@govt.com</span>
          <span>Location: Gujarat</span>
        </div>
        <div className="social-media">
          <a href="mailto:support@govt.com"><i className="fa-solid fa-envelope"></i></a>
          <a href="https://www.google.com/maps"><i className="fa-solid fa-location-dot"></i></a>
          <a href="tel:9874563210"><i className="fa-solid fa-phone"></i></a>
        </div>
      </div>
    </header>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="/alumni_list">Our Alumni</a></li>
        <li><Link to="/events">Events</Link></li>
        <li><a href="/donate">Donation</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><Link to="/jobs">Job</Link></li> 
        <li><a href="/">Logout</a></li>
      </ul>
    </nav>
  );
};

const MainContent = () => {
  const handleSchemesClick = () => {
    window.location.href = 'https://www.myscheme.gov.in/search/state/Gujarat';
  };

  return (
    <main className="main-content">
      <section className="hero">
        <h1 style={{color: 'white'}}>WELCOME TO OUR UNIVERSITY</h1>
        <button onClick={handleSchemesClick} className="cta-btn">Explore Schemes</button>
      </section>

      <section className="testimonials">
        <h2>Alumni Success Stories</h2>
        <div className="testimonial-slider">
          {/* You can add rotating testimonials here */}
          <blockquote>"Thanks to the university's alumni network, I landed my dream job!" - John Doe</blockquote>
          <blockquote>"The mentorship programs helped me grow my career." - Jane Smith</blockquote>
        </div>
      </section>

      <section className="courses">
        <div className="frame-container">
          <div className="black-transparent-frame1">Showcase inspiring success stories from your alumni network. Highlight their journey, achievements, and contributions to their industries.</div>
          <div className="black-transparent-frame2">Promote upcoming alumni events, reunions, and networking opportunities. Include event dates, locations, and a brief overview.</div>
          <div className="black-transparent-frame3">Highlight the various benefits and resources available to alumni, such as career services, mentorship programs, and access to exclusive content.</div>
        </div>
      </section>

      <section className="upcoming-events">
        <h2>Upcoming Events</h2>
        <div className="event-list">
          <div className="event-item">Alumni Meet 2024 - Feb 15th</div>
          <div className="event-item">Networking Workshop - Mar 1st</div>
          <div className="event-item">Mentorship Sessions - Mar 10th</div>
        </div>
      </section>
    </main>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a> | 
        <a href="/terms">Terms of Service</a>
      </div>
      <p>&copy; 2024 Our University. All Rights Reserved.</p>
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
