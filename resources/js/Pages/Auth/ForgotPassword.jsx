import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function ForgotPassword({ show, onClose, status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => {
                onClose(); // Close modal after successful submission
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            {processing && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                    <div
                        className="spinner-border"
                        role="status"
                        style={{
                            width: '3rem',
                            height: '3rem',
                            color: '#B0AB8C',
                        }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <GuestLayout>
                <Head title="Forgot Password" />
                <div className="mb-4 text-sm text-gray-600">
                    Forgot your password? No problem. Just let us know your email address, and we will email you a password reset link.
                </div>
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
                <form onSubmit={submit}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                    <div className="mt-4 flex items-center justify-end">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            {processing ? 'Processing...' : 'Email Password Reset Link'}
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </Modal>
    );
}
