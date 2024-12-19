import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import '../../css/Navbar.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="/images/logo.png" // Adjust the path to match the location of your logo image
                        alt="QuickEvent Logo"
                        style={{
                            height: '100px',
                            marginRight: '10px',
                        }}
                    />

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
                        <Link href="/account" className="btn btn-login me-3">Log in</Link>
                        <Link href="/account" className="btn btn-signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
