import { useState } from 'react';
import axios from 'axios'; // Axios for HTTP requests
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError'; // Import InputError component
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { FcGoogle } from 'react-icons/fc';

export default function Register({ show, onClose, openLoginModal }) {
    // State to track form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // State to track validation errors
    const [errors, setErrors] = useState({});

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle regular form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors
        try {
            // Send POST request to /register
            await axios.post('/register', formData);
            onClose(); // Close the modal
            window.location.href = '/events'; // Redirect to Profile page
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); // Set validation errors
            } else {
                console.error('Unexpected error:', error); // Debugging message
            }
        }
    };

    // Handle Google registration
    const handleGoogleRegister = async () => {
        try {
            window.location.href = '/auth/google'; // Redirect to Laravel backend for Google OAuth
        } catch (error) {
            console.error('Google registration failed:', error);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
        >
            <GuestLayout>
                <form onSubmit={handleSubmit}>
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
                        <InputError message={errors.name && errors.name[0]} className="mt-2" />
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
                        <InputError message={errors.email && errors.email[0]} className="mt-2" />
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
                        <InputError message={errors.password && errors.password[0]} className="mt-2" />
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
                        <InputError
                            message={errors.password_confirmation && errors.password_confirmation[0]}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                openLoginModal();
                            }}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            Already registered?
                        </button>
                        <PrimaryButton type="submit" className="ms-4">
                            Register
                        </PrimaryButton>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
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
    );
}
