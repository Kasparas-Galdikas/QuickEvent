import React from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { router } from '@inertiajs/react';

export default function Events() {
    const { auth } = usePage().props;
    const username = auth?.user?.name || 'Guest';

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Events" />
            <Navbar />

            <div className="container flex-grow-1">
                <div className="mt-5">
                    <h2 className='fs-1'>Welcome, {username} 👋</h2>

                    {/* Horizontal layout for groups and tips */}
                    <div className="row mb-4">
                        {/* Groups box */}
                        <p className="lead fs-3 mb-5">Groups you organize</p>

                        <div className="col-md-6">
                            <div className="card custom-card h-100">
                                <div className="card-body">
                                    <div className="d-flex">
                                        {/* Group Image */}
                                        <div style={{ minWidth: '180px', height: '180px' }}>
                                            <img
                                                src="https://via.placeholder.com/180"
                                                className="rounded w-100 h-100 object-fit-cover"
                                                alt="Group"
                                                style={{ backgroundColor: '#00a2c7' }}
                                            />
                                        </div>
                                        {/* Group Info */}
                                        <div className="d-flex flex-column ms-4" style={{ minHeight: '180px' }}>
                                            <div>
                                                {/* Group Name */}
                                                <h6 className="mb-2">My Group Name</h6>
                                                {/* Member Info with Icon */}
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fas fa-user-friends me-2"></i> {/* Font Awesome Icon */}
                                                    <small>1 member</small>
                                                </div>

                                                {/* Group Description */}
                                                <p
                                                    className="mb-4"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: '3',
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    My Group Description My Group Description
                                                    My Group Description My Group Description My Group Description My Group Description My Group
                                                    Descript My Group Description My Group Descript My Group Description My Group Descript
                                                    My Group Description My Group Descript My Group Description My Group Descript My Group
                                                    Description My Group Descript
                                                </p>
                                            </div>
                                            <button
                                                className="btn custom-btn"
                                                style={{ alignSelf: 'flex-start' }}
                                                onClick={() => router.get('/events/create')}
                                            >
                                                <i className="fas fa-calendar-plus me-2"></i> {/* Font Awesome Icon */}
                                                Create event
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Tips box */}
                        <div className="col-md-6">

                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <h5 className="card-title text-dark mb-0">Next event you're hosting</h5>
                                    <i className="fas fa-calendar-alt ms-2" style={{ fontSize: '24px', color: 'black' }}></i> {/* Font Awesome Icon */}
                                </div>
                                <p className="mb-2">Scheduling an event encourages more people to join your group.</p>
                                <p className="mb-2">Need help with your group? Are you an organizer who wants to help others succeed?</p>
                                <a href="#" className="text-primary">Join the Meetup Organizers Discord channel</a>
                            </div>

                        </div>
                    </div>
                    <p className="lead fs-3 mb-5">Upcoming Events</p>
                </div>

                <div className="row w-100">
                    <div className="col-md-4 col-lg-3 mb-4">
                        <Calendar className="mx-auto" />

                        <div className="card custom-card mt-4">
                            <div className="card-body">
                                <h5 className="card-title text-center text-dark">Your Next Events</h5>
                                <p className="text-center">You have not registered for any events yet.</p>
                                <div className="d-flex justify-content-center">
                                    <button className="custom-btn btn btn-primary">View All</button>
                                </div>
                            </div>
                        </div>

                        <div className="card custom-card mt-4">
                            <div className="card-body">
                                <h5 className="card-title text-center text-dark">Your Groups</h5>
                                <p className="text-center">You have not joined any groups</p>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-link">Discover groups</button>
                                </div>
                            </div>
                        </div>

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

                    <div className="col-md-8 col-lg-9">
                        <div className="d-flex justify-content mb-3">
                            <select className="form-select w-auto">
                                <option>Any type</option>
                                <option>Online</option>
                                <option>In-person</option>
                            </select>
                            <button className="custom-btn btn ms-2">Reset Filters</button>
                        </div>

                        <div className="d-flex flex-column align-items-center">
                            {[1, 2, 3, 4].map((event) => (
                                <div className="card custom-card mb-4 w-100" key={event} style={{ border: 'none' }}>
                                    <div className="row g-0">
                                        <div className="col-md-12">
                                            <div className="card-body">
                                                <h6 className="text-muted">Mon, Dec 23 - 10:00 PM EET</h6>
                                                <hr />
                                            </div>
                                        </div>

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
                                                <a href="/events/1" className="custom-btn btn mt-2">
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

            <Footer />
        </div>
    );
}