import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import axios from 'axios';

export default function VerifyEmail({ email }) {
    const [formData, setFormData] = useState({
        verification_code: '',
    });

    const [errors, setErrors] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(`Submitting code for email: ${email}`); // Debugging email

        try {
            const response = await axios.post('/verify', {
                email: email, // Include the email from props
                verification_code: formData.verification_code,
            });

            console.log(response.data.message); // Success message
            setIsVerified(true); // Mark the user as verified
            window.location.href = '/events'; // Redirect after verification
        } catch (error) {
            setIsVerified(false); // Mark the user as not verified
            if (error.response) {
                console.error('Error response data:', error.response.data); // Backend error details
                setErrors(error.response.data.errors || { verification_code: 'Unexpected error occurred.' });
            } else {
                console.error('Unexpected error:', error);
                setErrors({ verification_code: 'Failed to connect to the server.' });
            }
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await axios.post('/resend-verification-code', { email });
            setResendMessage('A new verification code has been sent to your email.');
            console.log(response.data.message); // Debugging success message
        } catch (error) {
            console.error('Failed to resend verification code:', error);
            setResendMessage('Failed to resend verification code. Please try again.');
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                Please enter the verification code sent to your email.
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <InputLabel htmlFor="verification_code" value="Verification Code" />
                    <TextInput
                        id="verification_code"
                        name="verification_code"
                        type="text"
                        value={formData.verification_code}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.verification_code} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton type="submit">
                        Verify Email
                    </PrimaryButton>

                    <button
                        type="button"
                        onClick={handleResendCode}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Resend Verification Code
                    </button>
                </div>
            </form>

            {resendMessage && (
                <div className="mt-4 text-sm text-green-600">
                    {resendMessage}
                </div>
            )}
        </GuestLayout>
    );
}
