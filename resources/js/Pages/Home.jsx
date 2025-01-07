import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Events() {
    const { auth, groups, events } = usePage().props; // Fetch events from props
    const username = auth?.user?.name || 'Guest';


    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title="Home" />
            <Navbar />

            <div className="container">
                <div className="mt-5">
                    <h2 className="fs-1">Welcome, {username} 👋</h2>

                    {/* Horizontal layout for groups (left) and group events (right) */}
                    {groups.length > 0 && (
                        <div className="row mb-4">
                            {/* Left Column: Groups */}
                            <div className="col-md-6">
                                <p className="lead fs-3 mb-4">Groups you organize</p>

                                {groups.map((group) => (
                                    <div className="col-12 mb-4" key={group.id}>
                                        <div className="card custom-card">
                                            <div className="card-body">
                                                <div className="d-flex">
                                                    {/* Group Image */}
                                                    <div style={{ minWidth: '150px', height: '150px' }}>
                                                        <img
                                                            src={group.image_path || '/images/default-group.png'}
                                                            className="rounded w-100 h-100 object-fit-cover"
                                                            alt={group.name}
                                                            style={{
                                                                border: '1px solid black',
                                                                borderRadius: '8px',
                                                            }}
                                                        />
                                                    </div>
                                                    {/* Group Info */}
                                                    <div className="d-flex flex-column ms-4" style={{ minHeight: '180px' }}>
                                                        <div>
                                                            {/* Group Name */}
                                                            <h6 className="mb-2">{group.name}</h6>

                                                            {/* Member Info with Icon */}
                                                            <div className="d-flex align-items-center mb-2">
                                                                <i className="fas fa-user-friends me-2"></i>
                                                                <small>{group.member_count || 1} member(s)</small>
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
                                                                {group.description}
                                                            </p>
                                                        </div>

                                                        {/* Create Event Button */}
                                                        <button
                                                            className="btn custom-btn"
                                                            style={{ alignSelf: 'flex-start' }}
                                                            onClick={() => router.get(`/groups/set-group/${group.id}`)}
                                                        >
                                                            <i className="fas fa-calendar-plus me-2"></i>
                                                            Create event
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column: Events for each group */}
                            <div className="col-md-4">
                                {groups.some((group) => group.events && group.events.length > 0) ? (
                                    <>
                                        <p className="lead fs-5 mt-2 mb-4">Next event you’re hosting</p>

                                        {groups.map((group) =>
                                            group.events && group.events.length > 0 ? (
                                                <div
                                                    className="card custom-card mb-4"
                                                    key={group.id}
                                                    style={{
                                                        height: '220px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    <div
                                                        className="card-body"
                                                        style={{
                                                            height: '100%',
                                                            overflowY: 'auto',
                                                            padding: '15px',
                                                            borderRadius: '8px',
                                                        }}
                                                    >
                                                        {group.events.map((event) => (
                                                            <div
                                                                key={`group-event-${event.id}`}
                                                                className="d-flex custom-hover align-items-start mb-2"
                                                                style={{
                                                                    borderBottom: '1px solid #ddd',
                                                                    paddingBottom: '8px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => router.get(`/events/details/${event.slug}`)}
                                                            >
                                                                {/* Event Image */}
                                                                <div
                                                                    style={{
                                                                        width: '130px',
                                                                        height: '70px',
                                                                        marginRight: '8px',
                                                                        overflow: 'hidden',
                                                                        borderRadius: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        backgroundColor: '#f0f0f0',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={event.image_path || '/images/default-event.png'}
                                                                        alt={event.title}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                            border: '1px solid black',
                                                                            borderRadius: '8px',
                                                                        }}
                                                                    />
                                                                </div>

                                                                {/* Event Details */}
                                                                <div style={{ flex: 1 }}>
                                                                    <p className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>
                                                                        {new Date(
                                                                            `${event.event_date}T${event.event_time}`
                                                                        ).toLocaleString('en-US', {
                                                                            weekday: 'short',
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </p>
                                                                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                                                                        {event.title}
                                                                    </h6>
                                                                    <p className="small mb-0" style={{ fontSize: '0.85rem' }}>
                                                                        Group: <strong>{group.name}</strong>
                                                                    </p>
                                                                </div>
                                                            </div>

                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-4">
                                        <h5 className="text-muted mb-2">Next event you’re hosting</h5>
                                        <p className="small mb-3">
                                            Scheduling an event encourages more people to join your group. Need help with
                                            your group? Are you an organizer who wants to help others succeed?
                                        </p>
                                        <a
                                            href="https://discord.gg/organizers"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-link text-decoration-none p-0"
                                            style={{ textAlign: 'left' }}
                                        >
                                            Join the Meetup Organizers Discord channel
                                        </a>
                                    </div>


                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Remaining Page Content */}
                <p className="lead fs-3 mb-5">Upcoming Events</p>

                <div className="row">
                    <div className="col-md-4 col-lg-3 mb-4">
                        <Calendar className="mx-auto" />

                        <div className="card custom-card mt-4">
                            <div className="card-body" style={{ marginBottom: '20px' }}>
                                <h5 className="card-title text-center text-dark">Your Next Events</h5>
                                <p className="text-center">You have not registered for any events yet.</p>
                                <div className="d-flex justify-content-center">
                                    <button className="custom-btn btn btn-primary">View All</button>
                                </div>
                            </div>
                        </div>

                        <div className="card custom-card mt-4">
                            <div className="card-body" style={{ marginBottom: '20px' }}>
                                <h5 className="card-title text-center text-dark"> Groups you’re part of</h5>
                                <p className="text-center">You have not registered for any events yet.</p>
                                <div className="d-flex justify-content-center">
                                    <button className="custom-btn btn btn-primary">View All</button>
                                </div>
                            </div>
                        </div>

                        <div className="card custom-card mt-4">
                            <div className="card-body" style={{ marginBottom: '20px' }}>
                                <h5 className="card-title text-center text-dark">Your interests</h5>
                                <p className="text-center">You have not registered for any events yet.</p>
                                <div className="d-flex justify-content-center">
                                    <button className="custom-btn btn btn-primary">View All</button>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="col-md-6 col-lg-7" style={{ marginLeft: '20px' }}>
                        <div className="d-flex justify-content-start mb-3">
                            <select className="form-select w-auto">
                                <option>Any type</option>
                                <option>Online</option>
                                <option>In-person</option>
                            </select>
                            <button className="custom-btn btn ms-2">Reset Filters</button>
                        </div>

                        <div className="d-flex flex-column align-items-center">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <div
                                        className="card custom-card custom-hover mb-3 w-100"
                                        key={`global-event-${event.id}`}
                                        onClick={() => router.get(`/events/details/${event.slug}`)} // Make the entire card clickable
                                        style={{
                                            border: 'none',
                                            padding: '10px',
                                            height: 'auto',
                                            cursor: 'pointer', // Add pointer cursor for hover effect
                                        }}
                                    >
                                        <div className="row g-0 align-items-center">
                                            <div className="col-md-4">
                                                <img
                                                    src={event.image_path || '/images/default-event.png'}
                                                    className="card-img"
                                                    alt={event.title}
                                                    loading="lazy"
                                                    style={{
                                                        width: '230px',
                                                        height: '130px',
                                                        objectFit: 'cover',
                                                        border: '1px solid black',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body py-2">
                                                    <h5 className="card-title">{event.title}</h5>
                                                    <p
                                                        className="card-text text-truncate"
                                                        style={{ maxHeight: '3.6em', overflow: 'hidden' }}
                                                    >
                                                        {event.description}
                                                    </p>
                                                    <p className="mb-0">Location: {event.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No upcoming events available</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
