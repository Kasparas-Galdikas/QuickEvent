import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

export default function Register({ show, onClose, openLoginModal }) {
    console.log('Register component rendered. show:', show); // Debugging message

    return (
        <Modal
            show={show}
            onClose={() => {
                console.log('Register modal closing'); // Debugging message
                onClose();
            }}
        >
            <GuestLayout>
                <form>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            className="mt-1 block w-full"
                            autoComplete="name"
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            className="mt-1 block w-full"
                            autoComplete="username"
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        {/* Switch to Login Modal */}
                        <button
                            type="button"
                            onClick={() => {
                                console.log('Register: Already registered clicked'); // Debugging message
                                onClose(); // Close Register modal
                                openLoginModal(); // Open Login modal
                            }}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            Already registered?
                        </button>
                        <PrimaryButton
                            type="button"
                            className="ms-4"
                            onClick={() => {
                                console.log('Register: Register button clicked'); // Debugging message
                                onClose(); // Close Register modal
                                openLoginModal(); // Open Login modal
                            }}
                        >
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </Modal>
    );
}
