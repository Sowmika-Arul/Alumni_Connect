import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function VideoUpload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [domain, setDomain] = useState(''); // New state for domain
    const [message, setMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [userName, setUserName] = useState('');

    React.useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', video);
        formData.append('userName', userName);
        formData.append('domain', domain); // Append the domain field

        try {
            const response = await axios.post('http://localhost:5050/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(response.data.message);
            setVideoUrl(response.data.videoUrl);
        } catch (error) {
            setMessage('Failed to upload video');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2 style={styles.heading}>Upload Mentoring Video</h2>
                <form onSubmit={handleUpload} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={styles.textarea}
                    ></textarea>
                    <input
                        type="text"
                        placeholder="Domain" // New input for domain
                        onChange={(e) => setDomain(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        required
                        style={styles.fileInput}
                    />
                    <button type="submit" style={styles.uploadButton}>Upload</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                {videoUrl && (
                    <div style={styles.videoContainer}>
                        <h3>Uploaded Video:</h3>
                        <video width="400" controls style={styles.videoPlayer}>
                            <source src={`http://localhost:5050${videoUrl}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        width: '40%',
        margin: '100px 450px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        padding: '12px',
        marginBottom: '12px',
        width: '80%',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
    },
    textarea: {
        padding: '12px',
        marginBottom: '12px',
        width: '80%',
        height: '120px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
    },
    fileInput: {
        marginBottom: '20px',
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outline: 'none',
    },
    uploadButton: {
        padding: '12px 20px',
        backgroundColor: '#001c4b',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '80%',
        fontSize: '16px',
    },
    message: {
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    videoContainer: {
        textAlign: 'center',
        marginTop: '20px',
    },
    videoPlayer: {
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
};

export default VideoUpload;
