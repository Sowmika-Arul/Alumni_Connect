import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AlumniList.css';

function AlumniList() {
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        departments: [],
        specializations: [],
        batches: [],
        locations: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('http://localhost:5050/api/alumni_list');

                if (response.ok) {
                    const data = await response.json();
                    setProfiles(data.profiles);
                    setFilteredProfiles(data.profiles); // Set initial filtered profiles to all profiles
                } else {
                    setError('Failed to fetch alumni profiles');
                }
            } catch (err) {
                setError('An error occurred');
            }
        };

        fetchProfiles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        navigate('/');
    };

    const viewDetails = (rollNo) => {
        navigate(`/alumni_details/${rollNo}`);
    };

    const handleFilterChange = (category, value) => {
        setFilters((prevFilters) => {
            const currentValues = prevFilters[category];
            if (currentValues.includes(value)) {
                return {
                    ...prevFilters,
                    [category]: currentValues.filter((v) => v !== value)
                };
            } else {
                return {
                    ...prevFilters,
                    [category]: [...currentValues, value]
                };
            }
        });
    };

    useEffect(() => {
        const applyFilters = () => {
            const filtered = profiles.filter(profile => {
                return (
                    (filters.departments.length === 0 || filters.departments.includes(profile.department)) &&
                    (filters.specializations.length === 0 || filters.specializations.includes(profile.specialization)) &&
                    (filters.batches.length === 0 || filters.batches.includes(profile.batch.toString())) &&
                    (filters.locations.length === 0 || filters.locations.includes(profile.location))
                );
            });
            setFilteredProfiles(filtered);
        };

        applyFilters();
    }, [filters, profiles]);

    // Extract unique values for checkbox filters
    const uniqueDepartments = [...new Set(profiles.map(profile => profile.department))];
    const uniqueSpecializations = [...new Set(profiles.map(profile => profile.specialization))];
    const uniqueBatches = [...new Set(profiles.map(profile => profile.batch))];
    const uniqueLocations = [...new Set(profiles.map(profile => profile.location))];

    return (
        <div className="alumni-list-container">
            <h2>Alumni List</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            {error && <p className="error-message">{error}</p>}

            <div className="alumni-list-content">
                <div className="filters">
                    <h3>Filters</h3>
                    <div className="filter-group">
                        <h4>Department</h4>
                        {uniqueDepartments.map(department => (
                            <label key={department}>
                                <input 
                                    type="checkbox" 
                                    checked={filters.departments.includes(department)} 
                                    onChange={() => handleFilterChange('departments', department)} 
                                />
                                {department}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Specialization</h4>
                        {uniqueSpecializations.map(specialization => (
                            <label key={specialization}>
                                <input 
                                    type="checkbox" 
                                    checked={filters.specializations.includes(specialization)} 
                                    onChange={() => handleFilterChange('specializations', specialization)} 
                                />
                                {specialization}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Batch</h4>
                        {uniqueBatches.map(batch => (
                            <label key={batch}>
                                <input 
                                    type="checkbox" 
                                    checked={filters.batches.includes(batch.toString())} 
                                    onChange={() => handleFilterChange('batches', batch.toString())} 
                                />
                                {batch}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Location</h4>
                        {uniqueLocations.map(location => (
                            <label key={location}>
                                <input 
                                    type="checkbox" 
                                    checked={filters.locations.includes(location)} 
                                    onChange={() => handleFilterChange('locations', location)} 
                                />
                                {location}
                            </label>
                        ))}
                    </div>
                </div>

                <table className="profile-grid">
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Batch</th>
                            <th>Department</th>
                            <th>Specialization</th>
                            <th>Location</th>
                            <th>Industry</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProfiles.length > 0 ? (
                            filteredProfiles.map((profile) => (
                                <tr key={profile.rollNo} className="profile-card">
                                    <td>{profile.rollNo}</td>
                                    <td>{profile.name}</td>
                                    <td>{profile.batch}</td>
                                    <td>{profile.department}</td>
                                    <td>{profile.specialization}</td>
                                    <td>{profile.location}</td>
                                    <td>{profile.industry}</td>
                                    <td>
                                        <button onClick={() => viewDetails(profile.rollNo)}>View Details</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No profiles available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AlumniList;
