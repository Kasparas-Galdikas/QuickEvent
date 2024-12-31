import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center">
            {/* Logo Section */}
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-30 fill-current text-gray-600" /> {/* Bigger logo */}
                </Link>
            </div>

            {/* Content Section */}
            <div className="w-full bg-[#FAF3DD] px-6 py-4 shadow-lg sm:max-w-lg sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
