// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './AlumniList.css';

// function AlumniList() {
//     const [profiles, setProfiles] = useState([]);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchProfiles = async () => {
//             try {
//                 const response = await fetch('http://localhost:5050/alumni_list');

//                 if (response.ok) {
//                     const data = await response.json();
//                     setProfiles(data.profiles);
//                 } else {
//                     setError('Failed to fetch alumni profiles');
//                 }
//             } catch (err) {
//                 setError('An error occurred');
//             }
//         };

//         fetchProfiles();
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('userProfile');
//         navigate('/');
//     };

//     const viewDetails = (rollNo) => {
//         navigate(`/alumni_details/${rollNo}`);
//     };

//     return (
//         <div>
//             <h2>Alumni List</h2>
//             <button onClick={handleLogout}>Logout</button>
//             {error && <p>{error}</p>}
//             <ul>
//                 {profiles.length > 0 ? (
//                     profiles.map((profile) => (
//                         <li key={profile.rollNo}>
//                             <p><strong>Roll No:</strong> {profile.rollNo}</p>
//                             <p><strong>Name:</strong> {profile.name}</p>
//                             <p><strong>Batch:</strong> {profile.batch}</p>
//                             <p><strong>Department:</strong> {profile.department}</p>
//                             <p><strong>Specialization:</strong> {profile.specialization}</p>
//                             <p><strong>Location:</strong> {profile.location}</p>
//                             <p><strong>Industry:</strong> {profile.industry}</p>
//                             <button onClick={() => viewDetails(profile.rollNo)}>View Details</button>
//                             <hr />
//                         </li>
//                     ))
//                 ) : (
//                     <p>No profiles available</p>
//                 )}
//             </ul>
//         </div>
//     );
// }

// export default AlumniList;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlumniList.css';

function AlumniList() {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        batch: '',
        department: '',
        specialization: '',
        location: '',
        industry: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const queryParams = new URLSearchParams(filters);
                const response = await fetch(`http://localhost:5050/alumni_list?${queryParams.toString()}`);

                if (response.ok) {
                    const data = await response.json();
                    setProfiles(data.profiles);
                } else {
                    setError('Failed to fetch alumni profiles');
                }
            } catch (err) {
                setError('An error occurred');
            }
        };

        fetchProfiles();
    }, [filters]);

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        navigate('/');
    };

    const viewDetails = (rollNo) => {
        navigate(`/alumni_details/${rollNo}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>Alumni List</h2>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}

            <div className="filters">
                <select name="batch" onChange={handleFilterChange}>
                    <option value="">All Batches</option>
                    <option value="2022 - 2026">2022 - 2026</option>
                    {/* Add more batches as needed */}
                </select>

                <select name="department" onChange={handleFilterChange}>
                    <option value="">All Departments</option>
                    <option value="CSE">CSE</option>
                    {/* Add more departments as needed */}
                </select>

                <select name="specialization" onChange={handleFilterChange}>
                    <option value="">All Specializations</option>
                    <option value="AI">AI</option>
                    {/* Add more specializations as needed */}
                </select>

                <select name="location" onChange={handleFilterChange}>
                    <option value="">All Locations</option>
                    <option value="Salem">Salem</option>
                    {/* Add more locations as needed */}
                </select>

                <select name="industry" onChange={handleFilterChange}>
                    <option value="">All Industries</option>
                    <option value="Zoho">Zoho</option>
                    {/* Add more industries as needed */}
                </select>
            </div>

            <ul>
                {profiles.length > 0 ? (
                    profiles.map((profile) => (
                        <li key={profile.rollNo}>
                            <p><strong>Roll No:</strong> {profile.rollNo}</p>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Batch:</strong> {profile.batch}</p>
                            <p><strong>Department:</strong> {profile.department}</p>
                            <p><strong>Specialization:</strong> {profile.specialization}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Industry:</strong> {profile.industry}</p>
                            <button onClick={() => viewDetails(profile.rollNo)}>View Details</button>
                            <hr />
                        </li>
                    ))
                ) : (
                    <p>No profiles available</p>
                )}
            </ul>
        </div>
    );
}

export default AlumniList;
