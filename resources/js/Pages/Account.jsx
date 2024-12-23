import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { usePage } from '@inertiajs/react';

export default function Account() {
    const { props } = usePage();
    const user = props.auth.user;
    return (
        <>
            <Head title="Account" />
           
{/* Navbar */}
  <Navbar />
 
            {/* Main Content */}
            <div className="container py-4">
                {/* Rest of your existing content */}
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-4">
                        {/* Profile Card */}
                        <div className="card">
                            <div className="card-body p-0">
                                {/* Profile Photo Area */}
                                <div className="position-relative bg-teal-800" style={{ height: '200px' }}>
                                    <button className="btn btn-secondary btn-sm position-absolute top-2 end-2">
                                        🖊 Change profile photo
                                    </button>
                                </div>
 
                                {/* Profile Info */}
                                <div className="p-4 bg-teal-800 text-white">
                                <h3 className="mb-2">{user.name}</h3>
                                <p className="mb-2">{user.email} ℹ</p>
                                    <p className="mb-2">
                                        <span className="me-2">📍</span>
                                        Pabrade, LT
                                    </p>
                                    <p className="mb-0">
                                        <span className="me-2">📅</span>
                                        Joined Meetup on Dec 2024
                                    </p>
                                </div>
                            </div>
                        </div>
 
                        {/* Stats */}
                        <div className="d-flex justify-content-between text-center my-4">
                            <div>
                                <h5 className="mb-0">0</h5>
                                <small className="text-muted">Groups</small>
                            </div>
                            <div>
                                <h5 className="mb-0">3</h5>
                                <small className="text-muted">Interests</small>
                            </div>
                            <div>
                                <h5 className="mb-0">0</h5>
                                <small className="text-muted">RSVPs</small>
                            </div>
                        </div>
 
                        {/* About Section */}
                        <div className="mb-4">
                            <h5 className="mb-3">About me</h5>
                            <div className="d-flex align-items-center">
                                <span className="text-danger me-2">♥</span>
                                <span>New In Town</span>
                            </div>
                        </div>
 
                        {/* Edit Profile Section */}
                        <div className="card">
                            <div className="card-body d-flex align-items-center">
                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                                     style={{ width: '40px', height: '40px' }}>
                                    E
                                </div>
                                <div>
                                <div>{user.name}</div>
                                    <a href="#" className="text-primary text-decoration-none">Edit profile</a>
                                </div>
                            </div>
                        </div>
                    </div>
 
                    {/* Right Column */}
                    <div className="col-md-8">
                        {/* Interests Section */}
                        <h5 className="mb-3">My interests (3)</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <span className="px-3 py-2 bg-light rounded-pill">New In Town</span>
                            <span className="px-3 py-2 bg-light rounded-pill">Fun Times</span>
                            <span className="px-3 py-2 bg-light rounded-pill">Social Networking</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
                       <Footer />
        </>
    );
}