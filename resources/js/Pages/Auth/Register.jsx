import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { FcGoogle } from 'react-icons/fc';
import VerifyEmail from '@/Pages/Auth/VerifyEmail';
import axios from 'axios'; // Axios for API requests

export default function Register({ show, onClose, openLoginModal }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');

    useEffect(() => {
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true); // Show spinner

        try {
            // Step 1: Check if the user exists and is not verified
            const checkResponse = await axios.post('/check-user', { email: formData.email });

            if (checkResponse.data.requiresVerification) {
                // If user exists but is not verified, show verification flow
                setVerificationEmail(formData.email);
                setShowVerifyEmail(true);
                setLoading(false); // Hide spinner when modal is shown
                return; // Exit the function since no registration is needed
            }

            // Step 2: Register the user if not found or already verified
            const registerResponse = await axios.post('/register', formData);

            // Step 3: After successful registration, initiate verification flow
            setVerificationEmail(formData.email);
            setShowVerifyEmail(true);
        } catch (error) {
            // Handle errors gracefully
            if (error.response) {
                // Handle API-specific errors (e.g., validation errors)
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors); // Display specific error messages
                } else {
                    console.error('Server error:', error.response.data.message || 'Unknown error');
                }
            } else {
                // Handle unexpected errors (e.g., network issues)
                console.error('Unexpected error:', error.message);
            }
        } finally {
            setLoading(false); // Hide spinner regardless of success or failure
        }
    };


    const handleGoogleRegister = () => {
        window.location.href = '/auth/google';
    };

    return (
        <>
            {/* Verify Email Modal */}
            <Modal show={showVerifyEmail} onClose={() => setShowVerifyEmail(false)}>
                <VerifyEmail
                    show={showVerifyEmail}
                    onClose={() => setShowVerifyEmail(false)}
                    email={verificationEmail} // Pass email to VerifyEmail
                />
            </Modal>

            {/* Registration Form Modal */}
            <Modal show={show} onClose={onClose}>

                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700 z-50">
                        <div
                            className="spinner-border"
                            role="status"
                            style={{
                                width: '3rem',
                                height: '3rem',
                                color: '#B0AB8C', // Custom spinner color
                               
                            }}
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}



                <GuestLayout>
                    <form onSubmit={handleRegister}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="username"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={openLoginModal}
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                Already registered?
                            </button>
                            <PrimaryButton type="submit" className="ms-4">
                                Register
                            </PrimaryButton>
                        </div>

                        <hr />

                        <div className="flex items-center justify-between">
                            <SecondaryButton
                                type="button"
                                onClick={handleGoogleRegister}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <FcGoogle className="text-lg" />
                                Register using Google
                            </SecondaryButton>
                        </div>
                    </form>
                </GuestLayout>
            </Modal>
        </>
    );
}
