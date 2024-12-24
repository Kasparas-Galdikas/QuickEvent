import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import '../../css/Navbar.css';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import axios from 'axios';

export default function Navbar() {
    const { auth } = usePage().props; // Access user data from shared props
    const user = auth.user;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            // Perform logout request
            await axios.post('/logout');

            // Refresh CSRF token
            await refreshCsrfToken();

            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const refreshCsrfToken = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');

            const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
            const newCsrfToken = csrfMetaTag?.getAttribute('content');

            if (newCsrfToken) {
                axios.defaults.headers.common['X-CSRF-TOKEN'] = newCsrfToken;
            } else {
                console.error('CSRF token not found. Ensure the meta tag exists.');
            }
        } catch (error) {
            console.error('Error refreshing CSRF token:', error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid">
                    <Link href="/" className="navbar-brand d-flex align-items-center">
                        <ApplicationLogo alt="QuickEvent Logo" />
                    </Link>

                    <button
                        className="navbar-toggler d-lg-none"
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`w-100 ${isMenuOpen ? 'd-block' : 'd-none'} d-lg-flex flex-column flex-lg-row`}>
                        <form className="d-flex ms-lg-3 p-3 p-lg-0">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Search events"
                                    aria-label="Search events"
                                />
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Your location"
                                    aria-label="Your location"
                                />
                                <button className="search btn" type="submit">
                                    <i className="bi bi-search text-secondary"></i>
                                </button>


                            </div>
                        </form>

                        <div className={`d-flex ${isMenuOpen ? 'justify-content-center' : 'ms-auto'} p-3 p-lg-0`}>
                            {user ? (

                                <>
                                    <button className="btn btn-create-group me-3">
                                        Create Group
                                    </button>

                                    {/* Show the logged-in user's profile and logout options */}
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-rounded dropdown-toggle"
                                            id="userDropdown"
                                            data-bs-toggle="dropdown"
                                            data-bs-boundary="viewport"
                                            aria-expanded="false"
                                        >
                                            {user.name[0].toUpperCase()}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                            <li>
                                                <Link href="/Profile" className="dropdown-item">Profile</Link>
                                            </li>
                                            <li>
                                                <Link href="/events" className="dropdown-item">Explore Events</Link>
                                            </li>
                                            <li>
                                                <button className="dropdown-item" onClick={handleLogout}>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                // Show Log in and Sign up buttons if the user is not logged in
                                <>
                                    <button
                                        className="btn btn-login me-3"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        Log in
                                    </button>
                                    <button
                                        className="btn btn-signup"
                                        onClick={() => setShowRegisterModal(true)}
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </nav>

            {showLoginModal && (
                <Login
                    show={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            )}

            {showRegisterModal && (
                <Register
                    show={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                    openLoginModal={() => {
                        setShowRegisterModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </>
    );
}
