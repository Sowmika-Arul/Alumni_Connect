import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const navStyles = {
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    };

    const ulStyles = {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
        padding: 0
    };

    const liStyles = {
        margin: '0 15px'
    };

    const linkStyles = {
        color: 'black',
        textDecoration: 'none',
        fontWeight: 'bolder'
    };

 const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        navigate('/');
    };

    return (
        <nav style={navStyles}>
            <ul style={ulStyles}>
                <li style={liStyles}><Link to="/alumni_list" style={linkStyles}>Our Alumni</Link></li>
                <li style={liStyles}><Link to="/events" style={linkStyles}>Events</Link></li>
                <li style={liStyles}><Link to="/donate" style={linkStyles}>Donate</Link></li>
                <li style={liStyles}><Link to="/profile" style={linkStyles}>Profile</Link></li>
                <li style={liStyles}><Link to="/jobs" style={linkStyles}>Job</Link></li> 
                <li style={liStyles}><Link to="/transaction" style={linkStyles}>Give Backs</Link></li> 
                <li style={liStyles}><Link to="/videolist" style={linkStyles}>Learn & Grow</Link></li> 
                <li style={liStyles}><Link to="/videoupload" style={linkStyles}>Share Knowledge</Link></li> 
                <li style={liStyles}><Link to="/innovatives" style={linkStyles}>Innovations</Link></li> 
                <button className="logout-button" onClick={handleLogout} style={{
                display: 'block',
                margin: '0 auto 20px auto',
                padding: '10px 20px',
                backgroundColor: '#1D2951',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'background-color 0.3s, transform 0.3s'
            }}>Logout</button>
            </ul>
        </nav>
    );
};

export default Navbar;
