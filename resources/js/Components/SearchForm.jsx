import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react"; // Import Inertia router

const SearchForm = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            setLoadingLocation(true);
         
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
    
                        try {
                            // Send lat/lon to the backend
                            const response = await fetch(`/check-location?lat=${latitude}&lon=${longitude}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-TOKEN": document
                                        .querySelector('meta[name="csrf-token"]')
                                        .getAttribute("content"),
                                },
                            });
    
                            const data = await response.json();
    
                            if (data.location) {
                                setLocation(data.location); // Update UI with location
                            } else {
                                console.error("Failed to fetch accurate location from backend");
                            }
                        } catch (error) {
                            console.error("Error fetching location:", error);
                        } finally {
                            setLoadingLocation(false);
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        setLoadingLocation(false);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setLoadingLocation(false);
            }
        };
    
        fetchLocation();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (query.trim()) {
            params.append("query", query);
        }

        if (location.trim()) {
            params.append("location", location);
        }

        const url = `/search?${params.toString()}`;

        router.visit(url); // Use Inertia.js for SPA navigation
    };

    return (
        <form
            className="d-flex ms-lg-3 p-3 p-lg-0"
            onSubmit={(e) => e.preventDefault()} // Prevent form submission
        >
            <div className="input-group">
                <span className="input-group-text">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Search events"
                    aria-label="Search events"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <input
                    className="form-control"
                    type="text"
                    placeholder={loadingLocation ? "Detecting location..." : "Your location"}
                    aria-label="Your location"
                    value={location} // Reflect state
                    onChange={(e) => setLocation(e.target.value)} // Allow manual override
                />
                <button
                    type="button"
                    className="search btn"
                    onClick={handleSearch} // Use Inertia.js for navigation
                >
                    <i className="bi bi-search text-secondary"></i>
                </button>
            </div>
        </form>
    );
};

export default SearchForm;
