import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import UserAtendedEvents from '@/Components/UserAtendedEvents';

export default function Home() {
    const { auth, groups, events: initialEvents, pagination } = usePage().props; // Fetch events from props
    const username = auth?.user?.name || 'Guest';

    // Normalize date to ensure comparison consistency
    const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    // States for general events
    const [events, setEvents] = useState(initialEvents || []); // Initialize events with initial data
    const [currentPage, setCurrentPage] = useState(pagination?.current_page || 1); // Track the current page
    const [hasMore, setHasMore] = useState(currentPage < pagination?.last_page); // Check if more pages are available
    const [loading, setLoading] = useState(false); // Prevent duplicate fetch calls


    // States for calendar-specific events
    const [selectedDate, setSelectedDate] = useState(() => normalizeDate(new Date())); // Default to today's date
    const [calendarEvents, setCalendarEvents] = useState([]); // Calendar-specific events
    const [calendarPage, setCalendarPage] = useState(1); // Page for calendar-specific events
    const [calendarHasMore, setCalendarHasMore] = useState(false); // Whether more events are available for the selected date
    const [calendarLoading, setCalendarLoading] = useState(false); // Loading state for calendar-specific events

    // Infinite scroll refs for both general and calendar events
    const { ref: generalRef, inView: generalInView } = useInView();
    const { ref: calendarRef, inView: calendarInView } = useInView();

    // Load more general events when scrolled into view
    useEffect(() => {
        if (generalInView && hasMore && !loading && calendarEvents.length === 0) {
            loadMoreEvents();
        }
    }, [generalInView]);

    // Load more calendar-specific events when scrolled into view
    useEffect(() => {
        if (calendarInView && calendarHasMore && !calendarLoading) {
            fetchEventsForCalendar(selectedDate, calendarPage + 1);
        }
    }, [calendarInView]);

    // Fetch events for the calendar, paginated
    const fetchEventsForCalendar = async (date, page = 1) => {
        setCalendarLoading(true);
        try {
            const response = await axios.get('/api/calendar-events', {
                params: {
                    date: date.toISOString(),
                    page,
                    perPage: 10,
                },
            });

            if (response?.data?.events) {
                setCalendarEvents((prev) =>
                    page === 1 ? response.data.events : [...prev, ...response.data.events]
                );
                setCalendarPage(page);
                setCalendarHasMore(page < response.data.pagination.last_page);
            } else {
                setCalendarEvents([]);
                setCalendarHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        } finally {
            setCalendarLoading(false);
        }
    };

    const fetchMoreEvents = async (page) => {
        try {
            const response = await axios.get(`/api/events?page=${page}`);

            if (response?.data?.events) {
                return {
                    events: response.data.events,
                    pagination: response.data.pagination,
                };
            }
            return {
                events: [],
                pagination: {},
            };
        } catch (error) {
            console.error("Error fetching more events:", error);
            return {
                events: [],
                pagination: {},
            };
        }
    };

    const loadMoreEvents = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const { events: newEvents, pagination: newPagination } = await fetchMoreEvents(currentPage + 1);

            if (newEvents.length > 0) {
                setEvents((prevEvents) => [...prevEvents, ...newEvents]);
                setCurrentPage(newPagination.current_page);
                setHasMore(newPagination.current_page < newPagination.last_page);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more events:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedEvents = React.useMemo(() => {
        const source = calendarEvents.length > 0 ? calendarEvents : events; // Use calendarEvents if available
        return source.reduce((groups, event) => {
            const eventDate = normalizeDate(event.event_date).toDateString();
            if (!groups[eventDate]) groups[eventDate] = [];
            groups[eventDate].push(event);
            return groups;
        }, {});
    }, [events, calendarEvents]);


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
                                            <div
                                                className="card-body custom-hover"
                                                onClick={() => router.get(`/groups/show/${group.id}`)} // SPA navigation
                                                style={{ cursor: 'pointer', padding: '20px' }}
                                            >
                                                <div className="d-flex">
                                                    {/* Group Image */}
                                                    <div style={{ minWidth: '150px', height: '150px', flexShrink: 0 }}>
                                                        <img
                                                            src={
                                                                group.image_path
                                                                    ? `/storage/${group.image_path}` // Access the image via the `/storage` URL
                                                                    : '/images/default-group.png'   // Fallback image
                                                            }
                                                            className="rounded w-100 h-100 object-fit-cover"
                                                            alt={group.name}
                                                            style={{
                                                                border: '1px solid black',
                                                                borderRadius: '8px',
                                                            }}
                                                        />
                                                    </div>
                                                    {/* Group Info */}
                                                    <div className="d-flex flex-column ms-4" style={{ flex: 1, minWidth: 0 }}>
                                                        <div>
                                                            <h6 className="mb-2">{group.name}</h6>
                                                            <div className="d-flex align-items-center mb-2">
                                                                <i className="fas fa-user-friends me-2"></i>
                                                                <small>{group.member_count || 1} member(s)</small>
                                                            </div>
                                                            <p style={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: '3',
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                lineHeight: '1.5',
                                                                margin: '0 0 16px 0',
                                                                maxWidth: '100%'
                                                            }}>
                                                                {group.description}
                                                            </p>
                                                        </div>

                                                        {/* Create Event Button */}
                                                        <button
                                                            className="btn custom-btn"
                                                            style={{ alignSelf: 'flex-start' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.get(`/groups/set-group/${group.id}`) // SPA navigation
                                                            }}
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
                                                        {/* Right Column: Related Events displayed */}
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
                                                                        src={
                                                                            event.image_path
                                                                                ? `/storage/${event.image_path}` // Ensure relative paths are prefixed correctly
                                                                                : '/images/default-event.png' // Fallback image
                                                                        }
                                                                        alt={event.title || 'Event Image'} // Fallback alt text
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
                        <Calendar
                            className="mx-auto custom-card custom-calendar"
                            onChange={(date) => {
                                const normalizedDate = normalizeDate(date);
                                setSelectedDate(normalizedDate);
                                setCalendarEvents([]);
                                setCalendarPage(1);
                                setCalendarHasMore(false);
                                fetchEventsForCalendar(normalizedDate);
                            }}
                            value={selectedDate}
                        />

                        <UserAtendedEvents />

                    </div>

                    <div className="col-md-6 col-lg-7">

                        <div className="ms-4">

                            <div className="d-flex justify-content-start mb-3">
                                <select className="custom-select w-32">
                                    <option>Any type</option>
                                    <option>Online</option>
                                    <option>In-person</option>
                                </select>
                                <button className="custom-btn btn ms-2">Reset Filters</button>
                            </div>

                            <div className="d-flex flex-column align-items-center">
                                {Object.entries(groupedEvents)
                                    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                                    .filter(([date]) => normalizeDate(date) >= selectedDate)
                                    .map(([date, groupedEvents], index) => (
                                        <div key={date} className="w-100">
                                            {/* Display 'No events planned' message for the selected date */}
                                            {index === 0 && normalizeDate(date) > selectedDate && (
                                                <div className="w-100">
                                                    <h6
                                                        className="text-start text-muted mb-3 fw-bold"
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        {selectedDate.toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </h6>
                                                    <p className="text-center">No events planned for this date</p>
                                                    <hr />
                                                </div>
                                            )}

                                            <h6
                                                className="text-start text-muted mb-3 fw-bold"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                {new Date(date).toDateString() === new Date().toDateString()
                                                    ? 'Today'
                                                    : new Date(date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                            </h6>
                                            <hr />

                                            {groupedEvents.map((event) => (
                                                <div
                                                    className="card custom-card custom-hover mb-3 w-100"
                                                    key={`global-event-${event.id}`}
                                                    onClick={() => router.get(`/events/details/${event.slug}`)}
                                                    style={{
                                                        border: 'none',
                                                        padding: '10px',
                                                        height: 'auto',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <div className="row g-0 align-items-center">
                                                        <div className="col-md-4">
                                                            <img
                                                                src={
                                                                    event.image_path
                                                                        ? `/storage/${event.image_path}` // Ensure relative paths are prefixed correctly
                                                                        : '/images/default-event.png' // Fallback image
                                                                }
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
                                                                    style={{
                                                                        maxHeight: '3.6em',
                                                                        overflow: 'hidden',
                                                                    }}
                                                                >
                                                                    {event.description}
                                                                </p>
                                                                <p className="mb-0">Location: {event.location}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                {/* Display message if no events are planned */}
                                {Object.entries(groupedEvents)
                                    .filter(([date]) => normalizeDate(date) >= selectedDate)
                                    .length === 0 && (
                                        <div className="w-100">
                                            <h6
                                                className="text-start text-muted mb-3 fw-bold"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                {selectedDate.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </h6>
                                            <p className="text-center">No events planned for this date</p>
                                            <hr />
                                        </div>
                                    )}

                                {/* Infinite scroll loader */}
                                {calendarEvents.length > 0 && calendarHasMore && (
                                    <div ref={calendarRef} className="text-center my-4">
                                        {calendarLoading ? (
                                            <p>Loading more events...</p>
                                        ) : (
                                            <p>Scroll down to load more events</p>
                                        )}
                                    </div>
                                )}

                                {calendarEvents.length === 0 && hasMore && (
                                    <div ref={generalRef} className="text-center my-4">
                                        {loading ? <p>Loading more events...</p> : <p>Scroll down to load more events</p>}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
