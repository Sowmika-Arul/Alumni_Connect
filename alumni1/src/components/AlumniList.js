import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlumniList.css';

function AlumniList() {
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        specialization: '',
        batch: '',
        location: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('http://localhost:5050/alumni_list');

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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    useEffect(() => {
        const applyFilters = () => {
            const filtered = profiles.filter(profile => {
                return (
                    (filters.department === '' || profile.department.includes(filters.department)) &&
                    (filters.specialization === '' || profile.specialization.includes(filters.specialization)) &&
                    (filters.batch === '' || profile.batch.toString().includes(filters.batch)) &&
                    (filters.location === '' || profile.location.includes(filters.location))
                );
            });
            setFilteredProfiles(filtered);
        };

        applyFilters();
    }, [filters, profiles]);

    // Extract unique values for dropdowns
    const uniqueDepartments = [...new Set(profiles.map(profile => profile.department))];
    const uniqueSpecializations = [...new Set(profiles.map(profile => profile.specialization))];
    const uniqueBatches = [...new Set(profiles.map(profile => profile.batch))];
    const uniqueLocations = [...new Set(profiles.map(profile => profile.location))];

    return (
        <div className="alumni-list-container">
            <h2>Alumni List</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            {error && <p className="error-message">{error}</p>}

            <div className="filters">
                <select name="department" value={filters.department} onChange={handleFilterChange}>
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(department => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>

                <select name="specialization" value={filters.specialization} onChange={handleFilterChange}>
                    <option value="">All Specializations</option>
                    {uniqueSpecializations.map(specialization => (
                        <option key={specialization} value={specialization}>
                            {specialization}
                        </option>
                    ))}
                </select>

                <select name="batch" value={filters.batch} onChange={handleFilterChange}>
                    <option value="">All Batches</option>
                    {uniqueBatches.map(batch => (
                        <option key={batch} value={batch}>
                            {batch}
                        </option>
                    ))}
                </select>

                <select name="location" value={filters.location} onChange={handleFilterChange}>
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
            </div>

            <div className="profile-grid">
                {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                        <div className="profile-card" key={profile.rollNo}>
                            <p><strong>Roll No:</strong> {profile.rollNo}</p>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Batch:</strong> {profile.batch}</p>
                            <p><strong>Department:</strong> {profile.department}</p>
                            <p><strong>Specialization:</strong> {profile.specialization}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Industry:</strong> {profile.industry}</p>
                            <button onClick={() => viewDetails(profile.rollNo)}>View Details</button>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>No profiles available</p>
                )}
            </div>
        </div>
    );
}

export default AlumniList;
