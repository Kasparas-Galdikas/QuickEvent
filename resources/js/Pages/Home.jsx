import React from 'react';
import { Head } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Home() {
    return (
        <div className=" d-flex flex-column min-vh-100">
            <Head title="Home - QuickEvent" />

            {/* Navbar */}
            <Navbar />

            {/* header Section */}
            <header className="header py-5">
                <div className="container d-flex align-items-center">
                    <div className="row w-100">
                        <div className="col-lg-6 d-flex flex-column justify-content-center">
                            <h1
                                className="mt-3 fw-bold text-start"
                                style={{
                                    fontSize: 'calc(1.45rem + 1vw)',
                                    lineHeight: '1.2',
                                }}
                            >
                                The people platform—Where interests become friendships
                            </h1>
                            <p
                                className="lead mt-3 text-justify"
                                style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                }}
                            >
                                Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on QuickEvent.
                            </p>
                            <a
                                href="/register"
                                className=" custom-btn btn btn-outline-primary fw-bold mt-4"
                                style={{
                                    alignSelf: 'flex-start',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    borderColor: '#8d9440',
                                }}
                            >
                                Join QuickEvent
                            </a>
                        </div>
                        <div className="col-lg-6 text-center">
                            <img
                                src="https://secure.meetupstatic.com/next/images/indexPage/irl_event.svg?w=828"
                                alt="People riding a tandem bike"
                                className="img-fluid rounded"
                                style={{ maxHeight: '500px' }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Upcoming Events Section */}
            <section className="events py-5">
                <div className="container">
                    <h2 className="mb-4 fw-bold">Upcoming Online Events</h2>

                    <div className="row">
                        {[1, 2, 3, 4].map((event) => (
                            <div className="col-md-3 mb-4" key={event}>
                                <div className="card event-card">
                                    <img
                                        src={`https://via.placeholder.com/300x200?text=Event+${event}`}
                                        className="card-img-top"
                                        alt={`Event ${event}`}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">Event {event} Title</h5>
                                        <p className="card-text">Tue, Dec 24 - 4:00 PM EET</p>
                                        <a href="/events/1" className=" custom-btn btn btn-outline-primary btn-sm">
                                            See Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join QuickEvent Section */}
            <section className="py-5 text-center">
                <div className="container">
                    <h2 className="mb-3 fw-bold">Join QuickEvent</h2>
                    <p className="lead">
                        People use QuickEvent to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.
                    </p>
                    <a href="/register" className=" custom-btn btn btn-primary btn-lg">Sign up</a>
                </div>
            </section>

            {/* Explore Categories Section */}
            <section className="categories py-5">
                <div className="row justify-content-center">
                    {[
                        { name: "Travel and Outdoor", icon: "bi bi-tree", link: "/travel-outdoor" },
                        { name: "Social Activities", icon: "bi bi-people", link: "/social-activities" },
                        { name: "Hobbies and Passions", icon: "bi bi-heart", link: "/hobbies-passions" },
                        { name: "Sports and Fitness", icon: "bi bi-bicycle", link: "/sports-fitness" },
                        { name: "Health and Wellbeing", icon: "bi bi-heart-pulse", link: "/health-wellbeing" },
                        { name: "Technology", icon: "bi bi-laptop", link: "/technology" },
                        { name: "Art and Culture", icon: "bi bi-palette", link: "/art-culture" },
                        { name: "Games", icon: "bi bi-controller", link: "/games" },
                    ].map((category) => (
                        <div className="col-auto mb-3" key={category.name}>
                            <a href={category.link} className="text-decoration-none">
                                <div className="category-cube">
                                    <i className={`${category.icon} mb-2`}></i>
                                    <h6 className="card-title mt-1">{category.name}</h6>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>


            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
