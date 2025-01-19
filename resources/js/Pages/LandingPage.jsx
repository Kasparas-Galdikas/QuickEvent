import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Register from './Auth/Register';
import axios from 'axios';

export default function Home() {
    const { auth } = usePage().props; // Access the logged-in user info via Inertia
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading

    const openRegisterModal = () => setShowRegisterModal(true);
    const closeRegisterModal = () => setShowRegisterModal(false);

    // Redirect logged-in users to the dashboard
    useEffect(() => {
        if (auth.user) {
            window.location.href = '/Home'; // Redirect to dashboard
        }
    }, [auth.user]);

    useEffect(() => {
        // Fetch upcoming events
        axios
            .get('/events/upcoming')
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            })
            .finally(() => {
                setLoading(false); // Set loading to false when the data is ready
            });
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="QuickEvent | Find Local Groups" />
            <Navbar />

            {/* Register Modal */}
            <Register show={showRegisterModal} onClose={closeRegisterModal} />

            {loading ? (
                // Loader
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '100vh' }}
                >
                    <div
                        className="spinner-border"
                        role="status"
                        style={{
                            color: '#B0AB8C',
                            width: '3rem', // Adjust the width for a larger spinner
                            height: '3rem', // Adjust the height for a larger spinner
                        }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>

                </div>
            ) : (
                <>
                    {/* Header Section */}
                    <header className="header py-5">
                        <div className="container d-flex align-items-center">
                            <div className="row w-100">
                                <div className="col-lg-6 d-flex flex-column justify-content-center">
                                    <h1
                                        className="mt-3 fw-bold text-start"
                                        style={{
                                            fontSize: 'calc(1.45rem + 1vw)',
                                            lineHeight: '1.2',
                                        }}
                                    >
                                        The people platform—Where interests become friendships
                                    </h1>
                                    <p
                                        className="lead mt-3 text-justify"
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        Whatever your interest, from hiking and reading to networking
                                        and skill sharing, there are thousands of people who share it
                                        on QuickEvent.
                                    </p>
                                    <button
                                        onClick={openRegisterModal}
                                        className="custom-btn btn btn-outline-primary fw-bold mt-4"
                                        style={{
                                            alignSelf: 'flex-start',
                                            padding: '8px 16px',
                                            fontSize: '14px',
                                            borderColor: '#8d9440',
                                        }}
                                    >
                                        Join QuickEvent
                                    </button>
                                </div>
                                <div className="col-lg-6 text-center">
                                    <img
                                        src="/images/intro.png"
                                        alt="Introduction"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '500px', objectFit: 'contain' }} // Ensures the image fits well within the specified size
                                    />

                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Upcoming Events Section */}
                    <section className="events py-5">
                        <div className="container">
                            <h2 className="mb-4 fw-bold">Upcoming Events</h2>
                            <div className="row row-cols-1 row-cols-md-4 g-4">
                                {events.map((event) => (
                                    <div className="col" key={event.id}>
                                        <a
                                            href={`/events/details/${event.slug}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <div className="card custom-card custom-hover event-card h-100">
                                                {/* Event Image */}
                                                <img
                                                    src={
                                                        event.image_path
                                                            ? `/storage/${event.image_path}` // Ensure relative paths are prefixed correctly
                                                            : '/images/default-event.png' // Fallback image
                                                    }
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            '/images/default-event.png';
                                                    }}
                                                    className="card-img-top border border-dark rounded"
                                                    alt={event.title}
                                                />

                                                {/* Event Details */}
                                                <div className="card-body d-flex flex-column justify-content-between text-center">
                                                    <h5 className="card-title fw-bold">
                                                        {event.title}
                                                    </h5>
                                                    <p className="card-text mb-1">
                                                        {new Intl.DateTimeFormat('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }).format(new Date(event.event_date))}{' '}
                                                        - {event.event_time}
                                                    </p>
                                                    <p className="card-text text-muted">
                                                        Location: {event.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Join QuickEvent Section */}
                    <section className="py-5">
                        <div className="container custom-card p-5">
                            <div className="row align-items-center">
                                <div className="col-lg-6 text-start">
                                    <h2 className="mb-3 fw-bold fs-4">Join QuickEvent</h2>
                                    <p className="lead fs-6">
                                        People use QuickEvent to meet new people, learn new things,
                                        find support, get out of their comfort zones, and pursue their
                                        passions — together.
                                    </p>
                                    <button
                                        onClick={openRegisterModal}
                                        className="custom-btn btn"
                                        style={{
                                            minWidth: '200px',
                                        }}
                                    >
                                        Sign up
                                    </button>
                                </div>
                                <div className="col-lg-6 d-flex justify-content-end">
                                    <img
                                        src="https://www.meetup.com/_next/image/?url=%2Fimages%2FindexPage%2Fjoin%2Fjoin_meetup.webp&w=750&q=75"
                                        alt="QuickEvent Hands"
                                        className="img-fluid"
                                        style={{
                                            width: '400px',
                                            height: 'auto',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <Footer />
        </div>
    );
}
