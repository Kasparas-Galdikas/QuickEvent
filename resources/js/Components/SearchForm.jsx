import React, { useState } from "react";

const SearchForm = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");

    const buildUrl = () => {
        let url = "/search?";
        const params = [];

        // Include query if provided
        if (query.trim()) {
            params.push(`query=${encodeURIComponent(query)}`);
        }

        // Include location if provided
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
                    placeholder="Your location"
                    aria-label="Your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
