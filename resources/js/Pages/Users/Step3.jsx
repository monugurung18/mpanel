import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { LeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UserStep3({ step1Data, step2Data }) {
    const { data, post, processing } = useForm({
        // We don't need form data here as we're just confirming
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store.step3'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Instructor - Step 3" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    Create New Instructor - Step 3 of 3
                                </h2>
                                <Link 
                                    href={route('users.create.step2')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Step 2
                                </Link>
                            </div>

                            {/* Progress Indicator */}
                            <div className="mb-8">
                                <div className="flex items-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                        1
                                    </div>
                                    <div className="h-1 w-16 bg-gray-200"></div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                        2
                                    </div>
                                    <div className="h-1 w-16 bg-[#00895f]"></div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00895f] text-white">
                                        3
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-between text-sm text-gray-500">
                                    <span>Basic Information</span>
                                    <span>Education & Work</span>
                                    <span>Finalize</span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Confirm User Registration</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Please review the information below before finalizing the user registration.
                                        </p>
                                    </div>

                                    {/* User Information Summary */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="text-md font-medium text-gray-900 mb-3">User Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="text-sm font-medium">{step1Data.title} {step1Data.user_Fname} {step1Data.user_Lname}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-sm font-medium">{step1Data.user_email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-sm font-medium">{step1Data.user_phone || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="text-sm font-medium">{step1Data.gender}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Profession</p>
                                                <p className="text-sm font-medium">{step1Data.profession || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">User Type</p>
                                                <p className="text-sm font-medium">{step1Data.userType}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Education Summary */}
                                    {step2Data && step2Data.education && step2Data.education.length > 0 && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Education</h4>
                                            <div className="space-y-3">
                                                {step2Data.education.map((edu, index) => (
                                                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                                        <p className="text-sm font-medium">{edu.degree} - {edu.university}</p>
                                                        <p className="text-sm text-gray-500">{edu.completed_in}</p>
                                                        {edu.speciality && <p className="text-sm text-gray-500">Speciality: {edu.speciality}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Work History Summary */}
                                    {step2Data && step2Data.workHistory && step2Data.workHistory.length > 0 && (
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Work History</h4>
                                            <div className="space-y-3">
                                                {step2Data.workHistory.map((work, index) => (
                                                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                                        <p className="text-sm font-medium">{work.clinic_name}</p>
                                                        <p className="text-sm text-gray-500">{work.clinic_locality}</p>
                                                        <p className="text-sm text-gray-500">Designation: {work.designation}</p>
                                                        {work.speciality && <p className="text-sm text-gray-500">Speciality: {work.speciality}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="flex items-center justify-between pt-6">
                                        <Link href={route('users.create.step2')}>
                                            <Button variant="outline" className="uppercase">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4 mr-2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                Back to Step 2
                                            </Button>
                                        </Link>
                                        <PrimaryButton 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-[#00895f] hover:bg-[#007a52]"
                                        >
                                            {processing ? 'Creating User...' : 'Finalize Registration'}
                                        </PrimaryButton>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}