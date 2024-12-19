import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Automatically close the menu on window resize for large screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) { // Bootstrap's `lg` breakpoint
                setIsMenuOpen(false);
            }
        };

        // Attach resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <Head title="Home - QuickEvent" />

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light position-relative border-bottom">
                <div className="container-fluid">
                    {/* Brand/Logo */}
                    <a className="navbar-brand fw-bold text-danger" href="/">
                        <span style={{ fontFamily: 'cursive', fontSize: '1.5rem' }}>QuickEvent</span>
                    </a>

                    {/* Mobile Toggle Button */}
                    <button
                        className="navbar-toggler d-lg-none"
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible Search and Auth Container */}
                    <div
                        className={` 
                            w-100 
                            ${isMenuOpen ? 'd-block' : 'd-none'} 
                            d-lg-flex 
                            flex-column 
                            flex-lg-row
                        `}
                    >
                        {/* Search Bar */}
                        <form className="d-flex ms-lg-3 p-3 p-lg-0">
                            <div className="input-group" style={{ height: '40px' }}>
                                <span className="input-group-text bg-white border-end-0 text-secondary" style={{ height: '100%' }}>
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    className="form-control border-start-0"
                                    type="text"
                                    placeholder="Search events"
                                    aria-label="Search events"
                                    style={{ height: '100%' }}
                                />
                                <input
                                    className="form-control border border-dark"
                                    type="text"
                                    placeholder="Enter location"
                                    aria-label="Enter location"
                                    style={{ height: '100%' }}
                                />
                                <button className="btn btn-danger" type="submit" style={{ height: '100%' }}>
                                    <i className="bi bi-search text-white"></i>
                                </button>
                            </div>
                        </form>

                        {/* Auth Buttons */}
                        <div
                            className={`d-flex ${
                                isMenuOpen ? 'justify-content-center' : 'ms-auto'
                            } p-3 p-lg-0`}
                        >
                            <a href="/login" className="btn btn-link text-dark me-3">Log in</a>
                            <a href="/signup" className="btn btn-primary">Sign up</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">The people platform—Where interests become friendships</h1>
                    <p className="hero-description">
                        Discover events, groups, and activities around you. Join now to connect with like-minded people.
                    </p>
                    <a href="/register" className="hero-button btn btn-success">Join Meetup</a>
                </div>
            </header>

            {/* Upcoming Events */}
            <section className="events">
                <div className="events-container">
                    <h2 className="events-title">Upcoming Online Events</h2>
                    <div className="events-grid">
                        {[1, 2, 3, 4].map((event) => (
                            <div className="event-card" key={event}>
                                <img
                                    src={`https://via.placeholder.com/300x200?text=Event+${event}`}
                                    className="event-image"
                                    alt={`Event ${event}`}
                                />
                                <div className="event-details">
                                    <h5 className="event-title">Event {event} Title</h5>
                                    <p className="event-date">Wed, Dec 18 - 3:00 PM EET</p>
                                    <a href="/events/1" className="event-link btn btn-outline-primary">
                                        See Details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore Categories */}
            <section className="categories">
                <div className="categories-container">
                    <h2 className="categories-title">Explore Top Categories</h2>
                    <div className="categories-grid">
                        {['Travel', 'Technology', 'Health', 'Games'].map((category) => (
                            <div className="category-card" key={category}>
                                <h5 className="category-title">{category}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} QuickEvent. All rights reserved.</p>
                    <ul className="footer-links">
                        <li><a href="/about" className="footer-link">About</a></li>
                        <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                        <li><a href="/help" className="footer-link">Help</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}
