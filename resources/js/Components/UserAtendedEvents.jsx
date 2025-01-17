import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserAtendedEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendedEvents = async () => {
            try {
                const response = await axios.get("/user-attended-events");
                setEvents(response.data);
            } catch (err) {
                setError("Failed to fetch attended events.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendedEvents();
    }, []);

    const formatEventDate = (date, time) =>
        new Date(`${date}T${time}`).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="card custom-card mt-4">
            <div className="card-body mb-2">
                <h5 className="card-title text-center text-dark">Your Attended Events</h5>
                <hr />
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <a
                                    key={event.id}
                                    href={`/events/details/${event.slug}`} // Correct URL
                                    className="text-decoration-none text-inherit"
                                >
                                    <div className="custom-card custom-hover card mt-2">
                                        <div className="card-body d-flex align-items-center">
                                            <div
                                                className="event-image me-3"
                                                style={{
                                                    flexShrink: 0, // Prevent image from shrinking
                                                    width: "60px",
                                                    height: "60px",
                                                }}
                                            >
                                                <img
                                                    src={event.image_path || "/images/default-event.png"}
                                                    alt="Event Thumbnail"
                                                    className="rounded"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border: "1px solid black",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                            <div className="event-info">
                                                <h6
                                                    className="card-title mb-1 text-truncate"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "normal",
                                                        lineHeight: "1.2em",
                                                        maxHeight: "3.6em",
                                                    }}
                                                >
                                                    {event.title}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p className="text-center text-muted">No attended events to display.</p>
                        )}
                        <div className="d-flex justify-content-center mt-3">
                            <a href="/events/attending" className="custom-btn btn btn-primary">
                                View All Attended Events
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
