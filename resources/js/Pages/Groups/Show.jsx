import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';

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

        try {
            const response = await axios.post(`/groups/${group.id}/update-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                window.location.reload(); // Reload the page
            }
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
                                        src={
                                            group.image_path
                                                ? `/storage/${group.image_path}` // Access the image via the `/storage` URL
                                                : '/images/default-group.png'   // Fallback image
                                        }
                                        className="rounded object-fit-cover"
                                        alt={group.name}
                                        style={{
                                            width: '600px', // Fixed width
                                            height: '320px', // Fixed height
                                            border: '1px solid black', // 1px black border
                                        }}
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
                                            <>
                                                <button
                                                    className="btn custom-btn mb-2 w-100"
                                                    onClick={() => router.get(`/groups/edit/${group.id}`)}
                                                >
                                                    <i className="fas fa-edit me-2"></i>
                                                    Edit Group
                                                </button>

                                                <button
                                                    className="btn custom-btn w-100"
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Are you sure?',
                                                            text: 'Are you sure you want to delete this group? This action cannot be undone.',
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Yes, delete it!',
                                                            cancelButtonText: 'Cancel',
                                                            reverseButtons: true, // ✅ This flips the buttons
                                                            customClass: {
                                                                confirmButton: 'custom-confirm-button',
                                                                cancelButton: 'custom-cancel-button',
                                                                popup: 'custom-popup',
                                                            },
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                router.delete(`/groups/${group.id}`, {
                                                                    onSuccess: () => {
                                                                        Swal.fire({
                                                                            title: 'Deleted!',
                                                                            text: 'The group has been deleted.',
                                                                            icon: 'success',
                                                                            confirmButtonText: 'OK',
                                                                            customClass: {
                                                                                confirmButton: 'custom-confirm-button',
                                                                                popup: 'custom-popup',
                                                                            },
                                                                        }).then(() => {
                                                                            router.visit('/Home');
                                                                        });
                                                                    },
                                                                    onError: (error) => {
                                                                        console.error('Error deleting group:', error);
                                                                        Swal.fire({
                                                                            title: 'Error!',
                                                                            text: 'Failed to delete the group. Please try again later.',
                                                                            icon: 'error',
                                                                            confirmButtonText: 'OK',
                                                                            customClass: {
                                                                                confirmButton: 'custom-confirm-button',
                                                                                popup: 'custom-popup',
                                                                            },
                                                                        });
                                                                    },
                                                                });
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <i className="fas fa-trash-alt me-2"></i>
                                                    Remove Group
                                                </button>


                                            </>
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
                                        style={{
                                            cursor: 'pointer',
                                            color: activeTab === 'about' ? '#2c2c2c' : '#6c757d', // Dark text for active, muted for inactive
                                            backgroundColor: activeTab === 'about' ? '#f7f4e4' : 'transparent', // Slightly brighter vanilla background for active
                                            fontWeight: activeTab === 'about' ? 'bold' : 'normal', // Optional: Bold for active
                                        }}
                                    >
                                        About
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('events')}
                                        style={{
                                            cursor: 'pointer',
                                            color: activeTab === 'events' ? '#2c2c2c' : '#6c757d', // Dark text for active, muted for inactive
                                            backgroundColor: activeTab === 'events' ? '#f7f4e4' : 'transparent', // Slightly brighter vanilla background for active
                                            fontWeight: activeTab === 'events' ? 'bold' : 'normal', // Optional: Bold for active
                                        }}
                                    >
                                        Events
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
                                                            src={
                                                                event.image_path
                                                                    ? `/storage/${event.image_path}` // Access the image via the `/storage` URL
                                                                    : '/images/default-event.png'   // Fallback image
                                                            }
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
                                        <img
                                            src={
                                                group.user?.profile_image_path
                                                    ? `/storage/${group.user.profile_image_path}` // User's profile image
                                                    : '/images/default-profile.png' // Fallback image
                                            }
                                            alt={group.user?.name || 'Default Profile'}
                                            className="rounded-circle"
                                            style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                        />
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div
                    className="modal custom fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content custom-card">
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
                                    onClick={handleFileUpload} // Call the upload handler
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