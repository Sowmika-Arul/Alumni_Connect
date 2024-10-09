// AchievementsPage.js
import React, { useEffect, useState } from 'react';

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await fetch(`http://localhost:5050/achievements`);
                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                const data = await response.json();
                setAchievements(data.achievements || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching achievements:', error);
                setError('Failed to fetch achievements. Please try again later.');
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    if (loading) return <p>Loading achievements...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>Achievements</h1>
            {achievements.length > 0 ? (
                achievements.map((achievement, index) => (
                    <div className="card" key={index}>
                        <h2>{achievement.title}</h2>
                        <p>{achievement.description}</p>
                        {achievement.imageUrl && <img src={achievement.imageUrl} alt="Achievement" />}
                    </div>
                ))
            ) : (
                <p>No achievements available.</p>
            )}
        </div>
    );
};

export default AchievementsPage;
