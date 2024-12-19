import React from 'react';
import { Head } from '@inertiajs/react';

export default function Account() {
    return (
        <div className="container py-5">
            <Head title="Account" />
            <h1 className="text-center mb-4">Welcome to Your Account Page</h1>
            <p className="text-muted text-center">
                This is the account management page where you can manage your profile.
            </p>
        </div>
    );
}
