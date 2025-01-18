import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Profile() {
    const { props } = usePage();
    const user = props.auth.user;
    const [location, setLocation] = useState('Loading location...');
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        bio: '',
        interests: ['New In Town', 'Fun Times', 'Social Networking']
    });

    // Get user's location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    // Using OpenStreetMap's Nominatim service for reverse geocoding
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
                        {
                            headers: {
                                'Accept-Language': 'lt' // Get results in Lithuanian
                            }
                        }
                    );
                    
                    // Extract city and country from the response
                    const address = response.data.address;
                    const city = address.city || address.town || address.village || address.suburb;
                    setLocation(`${city}, LT`);
                } catch (error) {
                    console.error('Error getting location:', error);
                    setLocation('Location not available');
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                setLocation('Location access denied');
            });
        } else {
            setLocation('Geolocation not supported');
        }
    }, []);

    return (
        <>
            <Head title="Profile" />
            <Navbar />

            <div className="d-flex flex-column min-vh-100 container py-4">
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body p-0">
                                {/* Profile Photo Area */}
                                <div className="position-relative bg-teal-800" style={{ height: '200px' }}>
                                    <input
                                        type="file"
                                        id="profile-photo"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Handle file upload
                                            }
                                        }}
                                    />
                                    <button 
                                        className="btn custom-btn btn-sm position-absolute top-2 end-2"
                                        onClick={() => document.getElementById('profile-photo').click()}
                                    >
                                        <i className="fas fa-camera me-2"></i>
                                        Change Photo
                                    </button>
                                </div>

                                {/* Profile Info */}
                                <div className="p-4 bg-teal-800 text-white">
                                    <h3 className="mb-2">{user.name}</h3>
                                    <p className="mb-2">
                                        <i className="fas fa-envelope me-2"></i>
                                        {user.email}
                                    </p>
                                    <p className="mb-2">
                                        <i className="fas fa-map-marker-alt me-2"></i>
                                        {location}
                                    </p>
                                    <p className="mb-0">
                                        <i className="fas fa-calendar me-2"></i>
                                        Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="card mt-4">
                            <div className="card-body custom-card">
                                <h5 className="mb-3">Activity</h5>
                                <div className="d-flex justify-content-between text-center">
                                    <div className="px-3">
                                        <h5 className="mb-0">0</h5>
                                        <small className="text-muted">Groups</small>
                                    </div>
                                    <div className="px-3 border-start">
                                        <h5 className="mb-0">3</h5>
                                        <small className="text-muted">Interests</small>
                                    </div>
                                    <div className="px-3 border-start">
                                        <h5 className="mb-0">0</h5>
                                        <small className="text-muted">Events</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="card mt-4">
                            <div className="card-body custom-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">About me</h5>
                                    <button 
                                        className="btn btn-link p-0"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        className="form-control custom-textarea"
                                        value={userInfo.bio}
                                        onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                                        rows="3"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="mb-0">{userInfo.bio || "Tell us about yourself..."}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-8">
                        {/* Interests Section */}
                        <div className="card mb-4">
                            <div className="card-body custom-card">
                                <h5 className="mb-3">My interests (3)</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {userInfo.interests.map((interest, index) => (
                                        <span key={index} className="px-3 py-2 custom-btn rounded-pill">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="card mb-4">
                            <div className="card-body custom-card">
                                <h5 className="mb-3">Upcoming Events</h5>
                                <p className="text-muted">No upcoming events. Join some groups to find events!</p>
                            </div>
                        </div>

                        {/* My Groups */}
                        <div className="card">
                            <div className="card-body custom-card">
                                <h5 className="mb-3">My Groups</h5>
                                <p className="text-muted">You haven't joined any groups yet. Explore groups to get started!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}