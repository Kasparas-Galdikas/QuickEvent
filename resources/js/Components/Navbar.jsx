import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import '../../css/Navbar.css';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import axios from 'axios';

export default function Navbar() {
    const { auth, currentRoute } = usePage().props;
    const user = auth?.user || null;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid">
                    <Link href="/Home" className="navbar-brand d-flex align-items-center">
                        <ApplicationLogo alt="QuickEvent Logo" />
                    </Link>

                    <button
                        className="navbar-toggler"
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
                                    <button
                                        onClick={() => window.location.href = route('groups.create')}
                                        className="btn btn-create-group me-3"
                                    >
                                        Create Group
                                    </button>

                                    <div className="dropdown">
                                        <button
                                            className="btn btn-rounded dropdown-toggle"
                                            id="userDropdown"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {user.name[0].toUpperCase()}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <Link href={route('profile')} className="dropdown-item">Profile</Link>
                                            </li>
                                            <li>
                                                <Link href="/Home" className="dropdown-item">Explore Events</Link>
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
