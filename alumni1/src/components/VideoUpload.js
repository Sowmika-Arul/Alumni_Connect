import React, { useState } from 'react';
import axios from 'axios';

function VideoUpload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', video);

        try {
            const response = await axios.post('http://localhost:5050/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(response.data.message);
            setVideoUrl(response.data.videoUrl); // Update videoUrl with the server response
        } catch (error) {
            setMessage('Failed to upload video');
        }
    };

    return (
        <div>
            <h2>Upload Mentoring Video</h2>
            <form onSubmit={handleUpload}>
                <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])}
                    required
                />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
            {videoUrl && (
                <div>
                    <h3>Uploaded Video:</h3>
                    <video width="400" controls>
                        <source src={`http://localhost:5050${videoUrl}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
}

export default VideoUpload;
