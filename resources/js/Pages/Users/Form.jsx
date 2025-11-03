import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Select, Switch } from 'antd';
import 'antd/dist/reset.css';
import { Textarea } from '@/Components/ui/textarea';

const { Option } = Select;

export default function UserForm({ user }) {
    const isEditing = !!user;
    
    const { data, setData, post, put, errors, processing } = useForm({
        title: user?.title || '',
        user_Fname: user?.user_Fname || '',
        user_Lname: user?.user_Lname || '',
        user_email: user?.user_email || '',
        user_phone: user?.user_phone || '',
        gender: user?.gender || 'male',
        userType: user?.userType || 'instructor',
        profession: user?.profession || '',
        custom_url: user?.custom_url || '',
        specialities: user?.specialities || '',
        userLocality: user?.userLocality || '',
        userCountry: user?.userCountry || '',
        userState: user?.userState || '',
        elivatorPitch: user?.elivatorPitch || '',
        user_img: user?.user_img || '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('users.update', user.user_no));
        } else {
            post(route('users.store'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Instructor" : "Create Instructor"} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    {isEditing ? "Edit Instructor" : "Create New Instructor"}
                                </h2>
                                <Link 
                                    href={route('users.index')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Instructors
                                </Link>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Title */}
                                        <div>
                                            <InputLabel for="title" value="Title" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                id="title"
                                                value={data.title}
                                                onChange={(value) => setData('title', value)}
                                                className="w-full mt-1"
                                                placeholder="Select Title"
                                            >
                                                <Option value="Dr.">Dr.</Option>
                                                <Option value="Mr.">Mr.</Option>
                                                <Option value="Mrs.">Mrs.</Option>
                                                <Option value="Miss.">Miss.</Option>
                                            </Select>
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        {/* First Name */}
                                        <div>
                                            <InputLabel for="user_Fname" value="First Name" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="user_Fname"
                                                type="text"
                                                placeholder="Enter first name"
                                                value={data.user_Fname}
                                                onChange={(e) => setData('user_Fname', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            <InputError message={errors.user_Fname} className="mt-2" />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <InputLabel for="user_Lname" value="Last Name" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="user_Lname"
                                                type="text"
                                                placeholder="Enter last name"
                                                value={data.user_Lname}
                                                onChange={(e) => setData('user_Lname', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            <InputError message={errors.user_Lname} className="mt-2" />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <InputLabel for="user_email" value="Email" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="user_email"
                                                type="email"
                                                placeholder="Enter email address"
                                                value={data.user_email}
                                                onChange={(e) => setData('user_email', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            <InputError message={errors.user_email} className="mt-2" />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <InputLabel for="user_phone" value="Phone" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="user_phone"
                                                type="text"
                                                placeholder="Enter phone number"
                                                value={data.user_phone}
                                                onChange={(e) => setData('user_phone', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.user_phone} className="mt-2" />
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <InputLabel for="gender" value="Gender" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                id="gender"
                                                value={data.gender}
                                                onChange={(value) => setData('gender', value)}
                                                className="w-full mt-1"
                                                placeholder="Select Gender"
                                            >
                                                <Option value="male">Male</Option>
                                                <Option value="female">Female</Option>
                                            </Select>
                                            <InputError message={errors.gender} className="mt-2" />
                                        </div>

                                        {/* User Type */}
                                        <div>
                                            <InputLabel for="userType" value="User Type" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                id="userType"
                                                value={data.userType}
                                                onChange={(value) => setData('userType', value)}
                                                className="w-full mt-1"
                                                placeholder="Select User Type"
                                            >
                                                <Option value="user">User</Option>
                                                <Option value="instructor">Instructor</Option>
                                            </Select>
                                            <InputError message={errors.userType} className="mt-2" />
                                        </div>

                                        {/* Profession */}
                                        <div>
                                            <InputLabel for="profession" value="Profession" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="profession"
                                                type="text"
                                                placeholder="Enter profession"
                                                value={data.profession}
                                                onChange={(e) => setData('profession', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.profession} className="mt-2" />
                                        </div>

                                        {/* Custom URL */}
                                        <div>
                                            <InputLabel for="custom_url" value="Custom URL" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                placeholder="Enter custom URL"
                                                value={data.custom_url}
                                                onChange={(e) => setData('custom_url', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.custom_url} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Specialities */}
                                        <div>
                                            <InputLabel for="specialities" value="Specialities" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="specialities"
                                                type="text"
                                                placeholder="Enter specialities"
                                                value={data.specialities}
                                                onChange={(e) => setData('specialities', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.specialities} className="mt-2" />
                                        </div>

                                        {/* Locality */}
                                        <div>
                                            <InputLabel for="userLocality" value="Locality" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="userLocality"
                                                type="text"
                                                placeholder="Enter locality"
                                                value={data.userLocality}
                                                onChange={(e) => setData('userLocality', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.userLocality} className="mt-2" />
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <InputLabel for="userCountry" value="Country" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="userCountry"
                                                type="text"
                                                placeholder="Enter country"
                                                value={data.userCountry}
                                                onChange={(e) => setData('userCountry', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.userCountry} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* State and Elevator Pitch */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* State */}
                                        <div>
                                            <InputLabel for="userState" value="State" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="userState"
                                                type="text"
                                                placeholder="Enter state"
                                                value={data.userState}
                                                onChange={(e) => setData('userState', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            <InputError message={errors.userState} className="mt-2" />
                                        </div>

                                        {/* Elevator Pitch */}
                                        <div>
                                            <InputLabel for="elivatorPitch" value="Elevator Pitch" className="text-sm font-medium text-gray-700" />
                                            <Textarea
                                                id="elivatorPitch"
                                                placeholder="Describe the user in 1 line"
                                                value={data.elivatorPitch}
                                                onChange={(e) => setData('elivatorPitch', e.target.value)}
                                                className="w-full mt-1 text-sm"
                                                rows={3}
                                            />
                                            <InputError message={errors.elivatorPitch} className="mt-2" />
                                        </div>
                                    </div>

                                    {Object.keys(errors).length > 0 && (
                                        <div className="mb-6">
                                            <div className="rounded-md bg-red-50 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800">
                                                            Validation Error
                                                        </h3>
                                                        <div className="mt-2 text-sm text-red-700">
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {Object.entries(errors).map(([key, value]) => (
                                                                    <li key={key}>{value}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-6">
                                        <Link href={route('users.index')}>
                                            <Button variant="outline" className="uppercase">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <PrimaryButton 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-[#00895f] hover:bg-[#007a52]"
                                        >
                                            {isEditing ? 'Update Instructor' : 'Create Instructor'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}