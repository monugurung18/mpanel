import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/" className="flex justify-center">
                    <ApplicationLogo className="w-32 fill-current text-indigo-600 hover:text-indigo-700 transition-colors duration-200" />
                </Link>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100 backdrop-blur-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
