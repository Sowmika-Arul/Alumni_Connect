// SuccessStoriesPage.js
import React, { useEffect, useState } from 'react';

const SuccessStoriesPage = () => {
    const [successStories, setSuccessStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSuccessStories = async () => {
            try {
                const response = await fetch(`http://localhost:5050/success_stories`);
                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                const data = await response.json();
                setSuccessStories(data.successStories || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching success stories:', error);
                setError('Failed to fetch success stories. Please try again later.');
                setLoading(false);
            }
        };

        fetchSuccessStories();
    }, []);

    if (loading) return <p>Loading success stories...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>Success Stories</h1>
            {successStories.length > 0 ? (
                successStories.map((story, index) => (
                    <div className="card" key={index}>
                        <h2>{story.title}</h2>
                        <p>{story.story}</p>
                        {story.imageUrl && <img src={story.imageUrl} alt="Success Story" />}
                    </div>
                ))
            ) : (
                <p>No success stories available.</p>
            )}
        </div>
    );
};

export default SuccessStoriesPage;
