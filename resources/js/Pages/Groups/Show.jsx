import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import axios from 'axios';

export default function Show() {
    const { group, auth } = usePage().props;  // auth
    const [showUploadModal, setShowUploadModal] = useState(false);

    const [activeTab, setActiveTab] = useState('about');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // PRIDĖKITE ŠĮ useEffect:
    useEffect(() => {
        if (activeTab === 'events') {
            loadEvents();
        }
    }, [activeTab]);

    // PRIDĖKITE ŠIĄ FUNKCIJĄ:
    const loadEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/groups/${group.id}/events`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleFileUpload = async () => {
        const formData = new FormData();
        const file = document.getElementById('photo-upload').files[0];

        if (!file) {
            alert('Please select a file');
            return;
        }

        formData.append('image', file);
        formData.append('_method', 'PUT');

        try {
            await axios.post(`/groups/${group.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Atnaujinti puslapį po sėkmingo įkėlimo
            window.location.reload();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }

    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title={group.name} />
            <Navbar />

            <div className="container">
                <div className="mt-5">
                    {/* Hero Section */}
                    <div className="card custom-card mb-4">
                        <div className="card-body">
                            <div className="row">
                                {/* Left Column - Image with upload button */}
                                <div className="col-md-7 position-relative">
                                    <img
                                        src={group.image_path || "https://via.placeholder.com/600x400"}
                                        className="rounded w-100 h-100 object-fit-cover"
                                        alt={group.name}
                                    />
                                    {auth && auth.user && auth.user.id === group.user_id && (  // Add this condition
                                        <button
                                            className="btn custom-btn position-absolute top-0 start-0 m-3"
                                            onClick={() => setShowUploadModal(true)}
                                        >
                                            <i className="fas fa-camera me-2"></i>
                                            Upload Photo
                                        </button>
                                    )}
                                </div>

                                {/* Right Column - Group Info */}
                                <div className="col-md-5">
                                    <h1 className="fs-2 mb-4">{group.name}</h1>

                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            <span>{group.location}</span>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-user-friends me-2"></i>
                                            <span>1 member · Public group</span>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar me-2"></i>
                                            <span>Host <strong>{group.user?.name}</strong></span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button className="btn custom-btn mb-2 w-100">
                                            <i className="fas fa-comment me-2"></i>
                                            Contact members
                                        </button>
                                        {auth && auth.user && auth.user.id === group.user_id && (
                                            <button
                                                className="btn custom-btn w-100"
                                                onClick={() => router.get(`/groups/edit/${group.id}`)}
                                            >
                                                <i className="fas fa-edit me-2"></i>
                                                Edit Group
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="card custom-card mb-4">
                        <div className="card-body">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('about')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        About
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('events')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Events
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeTab === 'members' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('members')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Members
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeTab === 'photos' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('photos')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Pictures
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeTab === 'discussions' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('discussions')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Discussions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Left Column */}
                    <div className="row">
                        <div className="col-md-8">
                            {activeTab === 'about' && (
                                <div className="card custom-card mb-4">
                                    <div className="card-body">
                                        <h2 className="fs-4 mb-4">About us</h2>
                                        <p>{group.description}</p>

                                    </div>
                                </div>
                            )}

                            {activeTab === 'events' && (
                                <div className="card custom-card">
                                    <div className="card-body">
                                        <h2 className="fs-4 mb-4">Events</h2>
                                        {loading ? (
                                            <div className="text-center py-4">Loading...</div>
                                        ) : events.length > 0 ? (
                                            events.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="mb-4 border-bottom pb-4 custom-hover"
                                                    onClick={() => router.get(`/events/details/${event.slug}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="d-flex">
                                                        <img
                                                            src={event.image_path || "/images/default-event.png"}
                                                            className="rounded w-20 h-20 object-fit-cover"
                                                            alt={event.name}
                                                            style={{ width: '120px', height: '80px' }}
                                                        />
                                                        <div className="ms-3 flex-grow-1">
                                                            <h5>{event.title}</h5>
                                                            <p className="mb-1">
                                                                <i className="fas fa-calendar me-2"></i>
                                                                {new Date(event.event_date).toLocaleDateString()}
                                                                {' '}
                                                                {event.event_time}
                                                            </p>
                                                            <p className="mb-1">
                                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                                {event.location}
                                                            </p>
                                                            <p className="mb-0">
                                                                <i className="fas fa-users me-2"></i>
                                                                {event.attendees?.length || 0} attendees
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4">
                                                <p>No events scheduled yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'members' && (
                                <div className="card custom-card">
                                    <div className="card-body">
                                        <h2 className="fs-4 mb-4">Members</h2>
                                        <p>Members section coming soon...</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'photos' && (
                                <div className="card custom-card">
                                    <div className="card-body">
                                        <h2 className="fs-4 mb-4">Pictures</h2>
                                        <p>Pictures section coming soon...</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'discussions' && (
                                <div className="card custom-card">
                                    <div className="card-body">
                                        <h2 className="fs-4 mb-4">Discussions</h2>
                                        <p>Discussions section coming soon...</p>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Right Column */}
                        <div className="col-md-4">
                            {/* Organizatoriaus kortelė */}
                            <div className="card custom-card mb-4">
                                <div className="card-body">
                                    <h2 className="fs-4 mb-4">Host</h2>
                                    <div className="d-flex items-center gap-3">
                                        <div className="rounded-circle bg-secondary" style={{ width: '64px', height: '64px' }}></div>
                                        <div>
                                            <p className="fw-bold mb-1">{group.user?.name}</p>
                                            <button className="btn btn-link p-0">
                                                <i className="fas fa-comment me-1"></i>
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Narių kortelė */}
                            <div className="card custom-card mb-5"> {/* Pridėjome mb-5 klasę */}
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="fs-4 m-0">Members (1)</h2>
                                        <a href="#" className="text-primary">All</a>
                                    </div>

                                    {/* Organizatoriaus įrašas narių sąraše */}
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="rounded-circle bg-secondary" style={{ width: '48px', height: '48px' }}></div>
                                        <div className="ms-3">
                                            <p className="mb-0 fw-semibold">{group.user?.name}</p>
                                            <small className="text-muted">Host</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload Photo</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowUploadModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="photo-upload" className="form-label">
                                        Choose a photo for your group
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="photo-upload"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                                <small className="text-muted">
                                    Recommended size: 600x400 pixels. Maximum file size: 5MB.
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowUploadModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn custom-btn"
                                    onClick={handleFileUpload}  // Pridėtas onClick handler
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}