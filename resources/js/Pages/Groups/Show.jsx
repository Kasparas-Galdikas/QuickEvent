import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Show() {
    const { group } = usePage().props;
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        // Čia pridėsite file upload logiką
        console.log('Selected file:', file);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head title={group.name} />
            <Navbar />

            <div className="container">
                <div className="mt-5">
                    {/* Hero Section */}
                    <div className="card custom-card mb-4">
                        <div className="card-body">
                            <div className="row">
                                {/* Left Column - Image with upload button */}
                                <div className="col-md-7 position-relative">
                                    <img 
                                        src={group.image_path || "https://via.placeholder.com/600x400"}
                                        className="rounded w-100 h-100 object-fit-cover"
                                        alt={group.name}
                                    />
                                    <button 
                                        className="btn custom-btn position-absolute top-0 start-0 m-3"
                                        onClick={() => setShowUploadModal(true)}
                                    >
                                        <i className="fas fa-camera me-2"></i>
                                        Upload Photo
                                    </button>
                                </div>

                                {/* Right Column - Group Info */}
                                <div className="col-md-5">
                                    <h1 className="fs-2 mb-4">{group.name}</h1>
                                    
                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            <span>{group.location}</span>
                                        </div>
                                        
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-user-friends me-2"></i>
                                            <span>1 narys · Vieša grupė</span>
                                        </div>
                                        
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar me-2"></i>
                                            <span>Organizuoja <strong>{group.user?.name}</strong></span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button className="btn custom-btn">
                                            <i className="fas fa-comment me-2"></i>
                                            Susisiekti su nariais
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="card custom-card mb-4">
                        <div className="card-body">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a className="nav-link active" href="#about">Apie</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#events">Renginiai</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#members">Nariai</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#photos">Nuotraukos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#discussions">Diskusijos</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-8">
                            <div className="card custom-card mb-4">
                                <div className="card-body">
                                    <h2 className="fs-4 mb-4">Apie mus</h2>
                                    <p>{group.description}</p>
                                </div>
                            </div>

                            <div className="card custom-card">
                                <div className="card-body">
                                    <h2 className="fs-4 mb-4">Artėjantys renginiai</h2>
                                    <div className="text-center py-4">
                                        <p>Kada kitas renginys?</p>
                                        <p>Nariai domisi, bet nieko nesuplanuota.</p>
                                        <a href="#" className="text-primary">Pradėti diskusiją</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-md-4">
                            {/* Organizatoriaus kortelė */}
                            <div className="card custom-card mb-4">
                                <div className="card-body">
                                    <h2 className="fs-4 mb-4">Organizatorius</h2>
                                    <div className="d-flex items-center gap-3">
                                        <div className="rounded-circle bg-secondary" style={{ width: '64px', height: '64px' }}></div>
                                        <div>
                                            <p className="fw-bold mb-1">{group.user?.name}</p>
                                            <button className="btn btn-link p-0">
                                                <i className="fas fa-comment me-1"></i>
                                                Žinutė
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Narių kortelė */}
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="fs-4 m-0">Nariai (1)</h2>
                                        <a href="#" className="text-primary">Visi</a>
                                    </div>
                                    
                                    {/* Organizatoriaus įrašas narių sąraše */}
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="rounded-circle bg-secondary" style={{ width: '48px', height: '48px' }}></div>
                                        <div className="ms-3">
                                            <p className="mb-0 fw-semibold">{group.user?.name}</p>
                                            <small className="text-muted">Organizatorius</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload Photo</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowUploadModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="photo-upload" className="form-label">
                                        Choose a photo for your group
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="photo-upload"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                                <small className="text-muted">
                                    Recommended size: 600x400 pixels. Maximum file size: 5MB.
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowUploadModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn custom-btn">
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}