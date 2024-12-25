import React from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react'; // Import Inertia's usePage hook
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Calendar from 'react-calendar'; // Import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import default styling

export default function Events() {
    const { auth } = usePage().props; // Access shared Inertia props
    const username = auth?.user?.name || 'Guest'; // Use "Guest" if user is not logged in

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Evemts" />
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="container flex-grow-1">
                <div className="row w-100">
                    {/* Welcome Message */}
                    <div className="mt-5 mb-5"> {/* Adjust margin for larger space */}
                        <h2 className='fs-1'>Welcome, {username} 👋</h2>
                        <p className="lead fs-3">Upcoming Events</p>
                    </div>

                    {/* Left Side: Calendar, Upcoming Events, and Welcome Message */}
                    <div className="col-md-4 col-lg-3 mb-4">

                        {/* Calendar */}

                        <Calendar className="mx-auto" />


                        {/* Your Next Events */}
                        <div className="card custom-card mt-4">
                            <div className="card-body">
                                <h5 className="card-title text-center text-dark">Your Next Events</h5>
                                <p className="text-center">You have not registered for any events yet.</p>
                                <div className="d-flex justify-content-center">
                                    <button className="custom-btn btn btn-primary">View All</button>
                                </div>
                            </div>
                        </div>

                        {/* Your Groups */}
                        <div className="card custom-card mt-4">
                            <div className="card-body">
                                <h5 className="card-title text-center text-dark">Your Groups</h5>
                                <p className="text-center">You have not joined any groups</p>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-link">Discover groups</button>
                                </div>
                            </div>
                        </div>

                        {/* Your Interests */}
                        <div className="card custom-card mt-4">
                            <div className="card-body">
                                <h5 className="card-title text-center text-dark">Your Interests</h5>
                                <p className="text-center">You have not added any interests</p>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-link">Select interests</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Right Side: Event Listings and Filters */}
                    <div className="col-md-8 col-lg-9">
                        {/* Filters */}
                        <div className=" d-flex justify-content mb-3">
                            <select className="form-select w-auto">
                                <option>Any type</option>
                                <option>Online</option>
                                <option>In-person</option>
                            </select>
                            <button className=" custom-btn btn ms-2">Reset Filters</button>
                        </div>

                        {/* Event Listings */}
                        <div className="d-flex flex-column align-items-center">
                            {[1, 2, 3, 4].map((event) => (
                                <div className="card custom-card mb-4 w-100" key={event} style={{ border: 'none' }}>
                                    <div className="row g-0">
                                        {/* Event Date and Details on Top */}
                                        <div className="col-md-12">
                                            <div className="card-body">
                                                {/* Event Date */}
                                                <h6 className="text-muted">Mon, Dec 23 - 10:00 PM EET</h6>
                                                <hr /> {/* Horizontal line to separate date from event details */}
                                            </div>
                                        </div>

                                        {/* Event Image on the Left, Details on the Right */}
                                        <div className="col-md-4">
                                            <img
                                                src={`https://via.placeholder.com/300x200?text=Event+${event}`}
                                                className="card-img"
                                                alt={`Event ${event}`}
                                                style={{ borderTopLeftRadius: '0.25rem', borderBottomLeftRadius: '0.25rem' }}
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">Let's Speak English Conversation Club!</h5>
                                                <p className="card-text">English Conversation Practice • Berlin, DE</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <p className="mb-0">5 attendees</p>

                                                </div>
                                                <a href="/events/1" className=" custom-btn btn mt-2">
                                                    See Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
