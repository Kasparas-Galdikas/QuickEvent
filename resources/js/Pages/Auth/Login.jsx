import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js'; // Import Ziggy's route helper
import Modal from '@/Components/Modal';

export default function Login({ show, onClose, status }) {
   
    const redirectToAccount = () => {
        window.location.href = '/account';
    };

    return (
        <Modal show={show} onClose={onClose}>
            <GuestLayout>
                <Head title="Log in" />
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            className="mt-1 block w-full"
                            autoComplete="username"
                        />
                        <InputError message="" className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                        />
                        <InputError message="" className="mt-2" />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox name="remember" />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>
                </form>

                <div className="mt-4 flex items-center justify-between">
                    <a
                        href={route('password.request')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Forgot your password?
                    </a>

                    <PrimaryButton
                        className="ms-4"
                        onClick={redirectToAccount} // Redirect using Ziggy route
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </GuestLayout>
        </Modal>
    );
}
