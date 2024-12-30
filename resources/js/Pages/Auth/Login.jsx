import { useState } from 'react';
import axios from 'axios';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import Modal from '@/Components/Modal';
import ForgotPassword from '@/Pages/Auth/ForgotPassword';
import { Head } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import { FcGoogle } from 'react-icons/fc';
import VerifyEmail from '@/Pages/Auth/VerifyEmail';

export default function Login({ show, onClose, status }) {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState({});
    const [showForgotPassword, setShowForgotPassword] = useState(false); // Forgot Password modal state

    // Missing state variables
    const [showVerifyEmail, setShowVerifyEmail] = useState(false); // Verify Email modal state
    const [verifyEmail, setVerifyEmail] = useState(''); // Store email for VerifyEmail modal

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            const response = await axios.post('/login', formData);

            if (response.data.status === 'unverified') {
                setVerifyEmail(response.data.email); // Pass email to VerifyEmail component
                setShowVerifyEmail(true); // Show the VerifyEmail modal
            } else {
                onClose(); // Close the Login modal on success
                window.location.href = '/events'; // Redirect to events
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation errors:', error.response.data.errors);
                setErrors(error.response.data.errors); // Display validation errors
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true); // Open Forgot Password modal
    };

    return (
        <>
            {/* Login Modal */}
            <Modal show={show && !showForgotPassword} onClose={onClose}>
                <GuestLayout>
                    <Head title="Log in" />
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div>
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
                                autoComplete="current-password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleForgotPasswordClick}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Forgot your password?
                            </button>

                            <PrimaryButton type="submit" className="ms-4">
                                Log in
                            </PrimaryButton>
                        </div>

                        <hr />

                        <div className="flex items-center justify-between">
                            <SecondaryButton
                                type="button"
                                onClick={() => {
                                    window.location.href = '/auth/google'; // Redirect to Laravel's Google login route
                                }}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <FcGoogle className="text-lg" />
                                Login using Google
                            </SecondaryButton>

                        </div>
                    </form>
                </GuestLayout>
            </Modal>

            {/* Verify Email Modal */}
            <Modal show={showVerifyEmail} onClose={() => setShowVerifyEmail(false)}>
                <VerifyEmail email={verifyEmail} />
            </Modal>

            {/* Forgot Password Modal */}
            <ForgotPassword
                show={showForgotPassword}
                onClose={() => setShowForgotPassword(false)} // Close Forgot Password modal
            />
        </>
    );
}
