import { Link } from 'react-router-dom';

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
            </ul>
        </nav>
    );
};

export default Navbar;
