import React, { useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function VideoUpload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [domain, setDomain] = useState('');
    const [message, setMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [userName, setUserName] = useState('');

    const fileInputRef = useRef(null);

    React.useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', video);
        formData.append('userName', userName);
        formData.append('domain', domain);

        try {
            const response = await axios.post('https://alumni-connect-5ad6.onrender.com/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage(response.data.message);
            setVideoUrl(response.data.videoUrl);

            // Reset the form
            setTitle('');
            setDescription('');
            setDomain('');
            setVideo(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setMessage('Failed to upload video');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2 style={styles.heading}>Upload Your Mentoring Video</h2>
                <form onSubmit={handleUpload} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={styles.textarea}
                    ></textarea>
                    <input
                        type="text"
                        placeholder="Domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <label htmlFor="file" style={styles.customFileInputLabel}>
                        Choose Video File
                    </label>
                    <input
                        id="file"
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        required
                        style={styles.fileInput}
                        ref={fileInputRef}
                    />
                    <button type="submit" style={styles.uploadButton}>Upload Video</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                {videoUrl && (
                    <div style={styles.videoContainer}>
                        <h3 style={styles.videoHeading}>Uploaded Video:</h3>
                        <video width="100%" controls style={styles.videoPlayer}>
                            <source src={`https://alumni-connect-5ad6.onrender.com${videoUrl}`} type="video/mp4" />
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
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        width: '50%',
        margin: '50px auto',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        color: '#333',
    },
    heading: {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        width: '80%',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    textarea: {
        padding: '12px',
        borderRadius: '8px',
        width: '80%',
        height: '120px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    fileInput: {
        display: 'none', // Hide the default file input
    },
    customFileInputLabel: {
        padding: '12px 20px',
        backgroundColor: '#f7f7f7',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '80%',
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
    },
    customFileInputLabelHover: {
        backgroundColor: '#e7e7e7',
        borderColor: '#888',
    },
    uploadButton: {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '80%',
        fontSize: '18px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    uploadButtonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
    message: {
        textAlign: 'center',
        fontSize: '16px',
        marginTop: '20px',
        color: '#28a745',
    },
    videoContainer: {
        textAlign: 'center',
        marginTop: '20px',
    },
    videoHeading: {
        fontSize: '20px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '10px',
    },
    videoPlayer: {
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
};

export default VideoUpload;
