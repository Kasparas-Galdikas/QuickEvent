import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import '../../css/Navbar.css';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false); // State for Login modal
    const [showRegisterModal, setShowRegisterModal] = useState(false); // State for Register modal

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                                <button className="btn btn-danger" type="submit">
                                    <i className="bi bi-search text-white"></i>
                                </button>
                            </div>
                        </form>
                        <div className={`d-flex ${isMenuOpen ? 'justify-content-center' : 'ms-auto'} p-3 p-lg-0`}>
                            {/* Log In Button */}
                            <button
                                className="btn btn-login me-3"
                                onClick={() => {
                                    setShowLoginModal(true);
                                }}
                            >
                                Log in
                            </button>
                            {/* Sign Up Button */}
                            <button
                                className="btn btn-signup"
                                onClick={() => {
                                    setShowRegisterModal(true);
                                }}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            {showLoginModal && (
                <Login
                    show={showLoginModal}
                    onClose={() => {
                        setShowLoginModal(false);
                    }}
                />
            )}

            {/* Register Modal */}
            {showRegisterModal && (
                <Register
                    show={showRegisterModal}
                    onClose={() => {
                        setShowRegisterModal(false);
                    }}
                    openLoginModal={() => {
                        setShowRegisterModal(false); // Close Register modal
                        setShowLoginModal(true); // Open Login modal
                    }}
                />
            )}
        </>
    );
}
