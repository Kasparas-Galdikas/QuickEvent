import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useInView } from "react-intersection-observer"; // For infinite scroll
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const SearchResultsPage = () => {
    const { props } = usePage();
    const query = props.query; // Assuming 'query' is passed from Laravel
    const location = props.location; // Assuming 'location' is passed from Laravel

    const [events, setEvents] = useState([]);
    const [groupedEvents, setGroupedEvents] = useState({});
    const [selectedType, setSelectedType] = useState("Any type");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false); // Tracks loading state for infinite scroll
    const [initialLoading, setInitialLoading] = useState(true); // Tracks initial page load state

    const { ref, inView } = useInView(); // Detect when the element is in view

    // Fetch results function
    const fetchResults = async (page = 1) => {
        if (page === 1) setInitialLoading(true); // Start initial loading only for the first page
        setLoading(true);
        try {
            const response = await axios.get(`/api/events/search`, {
                params: {
                    query,
                    location,
                    page,
                    perPage: 10, // Adjust as needed
                },
            });

            const eventsData = response.data.data || []; // Extract events from 'data'

            if (page === 1) {
                setEvents(eventsData);
            } else {
                setEvents((prevEvents) => [...prevEvents, ...eventsData]);
            }

            const paginationData = {
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            };

            setHasMore(paginationData.current_page < paginationData.last_page);
            setCurrentPage(paginationData.current_page);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
            if (page === 1) setInitialLoading(false); // End initial loading after the first page fetch
        }
    };

    // Fetch results when query or location changes
    useEffect(() => {
        fetchResults();
    }, [query, location]);

    // Load more events when the user scrolls into view
    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreEvents();
        }
    }, [inView]);

    const loadMoreEvents = async () => {
        await fetchResults(currentPage + 1);
    };

    // Group events by date whenever events change
    useEffect(() => {
        const grouped = events.reduce((acc, event) => {
            const dateKey = event.event_date.split("T")[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {});
        setGroupedEvents(grouped);
    }, [events]);

    // Filter grouped events based on selected type
    const filteredGroupedEvents = Object.entries(groupedEvents).reduce(
        (acc, [date, events]) => {
            const filteredEvents =
                selectedType === "Any type"
                    ? events
                    : events.filter((event) => event.type === selectedType.toLowerCase());
            if (filteredEvents.length) {
                acc[date] = filteredEvents;
            }
            return acc;
        },
        {}
    );

    const handleResetFilters = () => {
        setSelectedType("Any type");
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            {/* Show initial loader while the page is loading */}
            {initialLoading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        height: "70vh", // Center the loader vertically
                        width: "100%",
                    }}
                >
                    <div
                        className="spinner-border"
                        role="status"
                        style={{
                            width: "3rem",
                            height: "3rem",
                            borderWidth: "0.3rem",
                            color: "#B0AB8C", // Vanilla blue color
                        }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="col-md-6 col-lg-7 mt-5 mx-auto text-center" style={{ marginLeft: "20px" }}>
                    <div
                        className="d-flex flex-column align-items-start mb-4"
                        style={{ color: "#8A8566" }} // Apply the color to the entire div
                    >
                        {(query || location) ? (
                            <h4>
                                Showing results for
                                {query && <strong> "{query}"</strong>}
                                {location && (
                                    <>
                                        {query ? " events near " : " events near "}
                                        <strong>"{location}"</strong>
                                    </>
                                )}
                            </h4>
                        ) : (
                            <h4>No query entered. Please try searching for an event.</h4>
                        )}
                    </div>


                    <div className="d-flex flex-column align-items-center">
                        {Object.keys(filteredGroupedEvents).length > 0 ? (
                            <>
                                {/* Event results */}
                                {Object.entries(filteredGroupedEvents).map(([date, events]) => (
                                    <div key={date} className="w-100">
                                        <h6
                                            className="text-start text-muted mb-3 fw-bold"
                                            style={{ marginLeft: "10px" }}
                                        >
                                            {(() => {
                                                const today = new Date().toISOString().split("T")[0];
                                                const tomorrow = new Date(
                                                    new Date().setDate(new Date().getDate() + 1)
                                                )
                                                    .toISOString()
                                                    .split("T")[0];

                                                if (date === today) {
                                                    return "Today";
                                                } else if (date === tomorrow) {
                                                    return "Tomorrow";
                                                } else {
                                                    const eventDate = new Date(date);
                                                    return eventDate.toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    });
                                                }
                                            })()}
                                        </h6>
                                        <hr />

                                        {events.map((event) => (
                                            <div
                                                className="card custom-card custom-hover mb-3 w-100"
                                                key={`search-event-${event.id}`}
                                                onClick={() =>
                                                    (window.location.href = `/events/details/${event.slug}`)
                                                }
                                                style={{
                                                    border: "none",
                                                    padding: "10px",
                                                    height: "auto",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <div className="row g-0 align-items-center">
                                                    <div className="col-md-4">
                                                        <img
                                                            src={event.image_path || "/images/default-event.png"}
                                                            className="card-img"
                                                            alt={event.title}
                                                            loading="lazy"
                                                            style={{
                                                                width: "230px",
                                                                height: "130px",
                                                                objectFit: "cover",
                                                                border: "1px solid black",
                                                                borderRadius: "8px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body py-2">
                                                            <h5 className="card-title">{event.title}</h5>
                                                            <p
                                                                className="card-text text-truncate"
                                                                style={{
                                                                    maxHeight: "3.6em",
                                                                    overflow: "hidden",
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
                            </>
                        ) : (
                            <div
                                className="d-flex flex-column justify-content-center align-items-center"
                                style={{
                                    height: "50vh", // Reduced height for closer positioning to the top
                                    width: "100%",
                                    marginTop: "0px",
                                }}
                            >
                                <img
                                    src="/images/search.png"
                                    alt="No results found"
                                    style={{
                                        maxWidth: "600px", // Larger image size
                                        height: "auto",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#B0AB8C", // Vanilla blue color matching the style in the image
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        marginTop: "10px",
                                        textAlign: "center",
                                    }}
                                >
                                    No results found
                                </p>
                            </div>
                        )}

                        {loading && Object.keys(filteredGroupedEvents).length > 0 && (
                            <div className="text-center my-4">
                                <p>Loading more events...</p>
                            </div>
                        )}

                        <div ref={ref}></div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default SearchResultsPage;
