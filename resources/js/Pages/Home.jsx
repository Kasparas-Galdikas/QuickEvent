import React from 'react';
import { Head } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Home() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Home - QuickEvent" />

            {/* Navbar */}
            <Navbar />

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
            <Footer />
        </div>
    );
}
