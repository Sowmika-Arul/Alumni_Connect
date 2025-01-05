import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function VideoList() {
    const [videos, setVideos] = useState([]);
    const [domains, setDomains] = useState([]); // State to store available domains
    const [selectedDomain, setSelectedDomain] = useState(''); // State for selected domain

    // Fetch videos from the backend (with optional domain filtering)
    const fetchVideos = async (domain = '') => {
        let url = 'http://localhost:5050/videos';
        if (domain) {
            url += `?domain=${domain}`; // Add domain query parameter to the URL if filtering
        }
        try {
            const response = await axios.get(url);
            setVideos(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    // Fetch list of unique domains for the filter
    const fetchDomains = async () => {
        try {
            const response = await axios.get('http://localhost:5050/domains');
            setDomains(response.data);
        } catch (error) {
            console.error("Error fetching domains:", error);
        }
    };

    // Run these fetch functions when the component mounts
    useEffect(() => {
        fetchVideos(); // Fetch all videos initially
        fetchDomains(); // Fetch available domains for the filter
    }, []);

    // Handle domain filter change
    const handleDomainChange = (e) => {
        const selectedDomain = e.target.value;
        setSelectedDomain(selectedDomain);
        fetchVideos(selectedDomain); // Re-fetch videos when domain is changed
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.contentWrapper}>
                {/* Domain filter on the left */}
                <div style={styles.filterContainer}>
                    <select
                        value={selectedDomain}
                        onChange={handleDomainChange}
                        style={styles.select}
                    >
                        <option value="">All Domains</option>
                        {domains.map((domain) => (
                            <option key={domain} value={domain}>
                                {domain}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Video list on the right */}
                <div style={styles.videoListContainer}>
                    <h2 style={styles.heading}>Mentoring Videos</h2>
                    {videos.map((video) => (
                        <div key={video._id} style={styles.videoCard}>
                            <h3 style={styles.videoTitle}>{video.title}</h3>
                            <p style={styles.videoDescription}>{video.description}</p>
                            <p style={styles.uploadedBy}>
                                <strong>Uploaded by:</strong> {video.userName}
                            </p>
                            <div style={styles.videoWrapper}>
                                <video controls width="600" style={styles.video}>
                                    <source src={`http://localhost:5050${video.videoUrl}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
        backgroundColor: '#fafafa',
        padding: '20px 50px',
    },
    contentWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    filterContainer: {
        width: '20%', // Filter section on the left
        padding: '20px',
        height: '20%',
        marginTop: '100px',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    select: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    videoListContainer: {
        width: '60%', // Video list section on the right
        padding: '20px',
        marginRight: '120px'
    },
    heading: {
        textAlign: 'center',
        color: '#001c4b',
        marginBottom: '30px',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    videoCard: {
        border: '1px solid #ddd',
        padding: '20px',
        marginBottom: '30px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    videoTitle: {
        fontSize: '1.8rem',
        color: '#001c4b',
        marginBottom: '10px',
    },
    videoDescription: {
        fontSize: '1.1rem',
        color: '#555',
        marginBottom: '10px',
    },
    uploadedBy: {
        fontSize: '1rem',
        color: '#777',
        fontStyle: 'italic',
        marginBottom: '15px',
    },
    videoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '15px',
    },
    video: {
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
};

export default VideoList;
