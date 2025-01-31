import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react'; // Added router for SPA navigation
import '../../css/Navbar.css';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import axios from 'axios';
import SearchForm from './SearchForm';

export default function Navbar() {
    const { auth } = usePage().props;
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
            window.location.href = '/'; // Full page reload on logout
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-custom">
                <div className="container-fluid">
                    {/* Dynamically set the href based on whether the user is logged in */}
                    <Link 
                        href={user ? "/Home" : "/"} 
                        className="navbar-brand d-flex align-items-center"
                    >
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

                        <SearchForm />

                        <div className={`d-flex ${isMenuOpen ? 'justify-content-center' : 'ms-auto'} p-3 p-lg-0`}>
                            {user ? (
                                <>
                                    {/* SPA Navigation for Create Group */}
                                    <Link
                                        href={route('groups.create')}
                                        className="btn btn-create-group mt-1 me-3"
                                    >
                                        Create Group
                                    </Link>

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
                                                <Link
                                                    href={route('profile')}
                                                    className={`dropdown-item ${route().current('profile') ? 'active' : ''}`}
                                                >
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/Home"
                                                    className={`dropdown-item ${route().current('Home') ? 'active' : ''}`}
                                                >
                                                    Explore Events
                                                </Link>
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
