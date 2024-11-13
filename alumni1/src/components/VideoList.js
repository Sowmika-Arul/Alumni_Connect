import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VideoList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await axios.get('http://localhost:5050/videos');
            setVideos(response.data);
        };
        fetchVideos();
    }, []);

    return (
        <div>
            <h2>Mentoring Videos</h2>
            {videos.map((video) => (
                <div key={video._id}>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    <video controls width="600">
                        <source src={`http://localhost:5050${video.videoUrl}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            ))}
        </div>
    );
}

export default VideoList;
