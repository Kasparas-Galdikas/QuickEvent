import React, { useState, useEffect } from "react";

const SearchForm = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        const detectLocation = async () => {
            if (!navigator.geolocation) {
                console.error("Geolocation is not supported by this browser.");
                return;
            }

            setLoadingLocation(true);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();

                        if (data && data.address) {
                            const city =
                                data.address.city ||
                                data.address.town ||
                                data.address.village ||
                                data.address.state ||
                                "";
                            const country = data.address.country_code
                                ? data.address.country_code.toUpperCase()
                                : "";

                            const detectedLocation = city
                                ? `${city}, ${country}`
                                : `Unknown Location, ${country}`;

                            setLocation(detectedLocation); // Update location state

                            // Check if location in the database is already set
                            const checkLocationResponse = await fetch('/check-location', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document
                                        .querySelector('meta[name="csrf-token"]')
                                        .getAttribute('content'),
                                },
                            });

                            const { location: currentLocation } = await checkLocationResponse.json();

                            if (!currentLocation) {
                                // Send the location to the backend if it is null
                                const backendResponse = await fetch('/update-location', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-TOKEN': document
                                            .querySelector('meta[name="csrf-token"]')
                                            .getAttribute('content'),
                                    },
                                    body: JSON.stringify({ location: detectedLocation }),
                                });

                                if (!backendResponse.ok) {
                                    console.error("Failed to send location to backend:", await backendResponse.text());
                                }
                            }
                        } else {
                            console.error("Address not found in API response.");
                        }
                    } catch (error) {
                        console.error("Error fetching location data:", error);
                    } finally {
                        setLoadingLocation(false); // Stop loading
                    }
                },
                (error) => {
                    console.error("Error detecting location:", error);
                    setLoadingLocation(false);
                }
            );
        };

        detectLocation();
    }, []);

    const buildUrl = () => {
        let url = "/search?";
        const params = [];

        if (query.trim()) {
            params.push(`query=${encodeURIComponent(query)}`);
        }

        if (location.trim()) {
            params.push(`location=${encodeURIComponent(location)}`);
        }

        return url + params.join("&");
    };

    return (
        <form
            className="d-flex ms-lg-3 p-3 p-lg-0"
            onSubmit={(e) => e.preventDefault()}
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
                <a
                    className="search btn"
                    href={buildUrl()}
                    role="button"
                >
                    <i className="bi bi-search text-secondary"></i>
                </a>
            </div>
        </form>
    );
};

export default SearchForm;
