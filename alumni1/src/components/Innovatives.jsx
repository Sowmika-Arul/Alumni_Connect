import React, { useEffect, useState } from 'react';
import '../styles/Innovatives.css';
import Navbar from './Navbar.jsx';

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://alumni-connect-5ad6.onrender.com/api/projects');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                setProjects(data.projects);
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false); 
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="projects-container">
            <Navbar/>
            <h2>Innovative Projects</h2>

            {loading && <p>Loading...</p>} 
            {error && <p className="error-message">{error}</p>} 

            <div className="projects-list">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id} className="project-card">
                            <h3>{project.projectName}</h3>
                            <p><strong>Domain:</strong> {project.domain}</p>
                            <p><strong>Description:</strong> {project.description}</p>
                            <p><strong>Percentage Completed:</strong> {project.percentageCompleted}%</p>
                            <p><strong>End User:</strong> {project.endUser}</p>

                           
                            {project.teamLeaderName && <p><strong>Team Lead:</strong> {project.teamLeaderName}</p>}
                            {project.department && <p><strong>Department:</strong> {project.department}</p>}
                            {project.emailId && <p><strong>Email:</strong> <a href={`mailto:${project.emailId}`}>{project.emailId}</a></p>}

                      
                            {project.imageUrl && (
                                <img
                                    src={`http://localhost:5050/${project.imageUrl}`} 
                                    alt={project.projectName} 
                                    className="project-image"
                                />
                            )}
                        </div>
                    ))
                ) : (
                    !loading && <p>No projects found</p> 
                )}
            </div>
        </div>
    );
}

export default ProjectsPage;
