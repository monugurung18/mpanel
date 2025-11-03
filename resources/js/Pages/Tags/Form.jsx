import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Select } from 'antd';
import 'antd/dist/reset.css';

export default function TagForm({ tag, specialities }) {
    const [tagError, setTagError] = useState('');
    const [displayNameError, setDisplayNameError] = useState('');
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        display_name: tag?.display_name || '',
        tagString: tag?.tagString || '',
        tagCategory1: tag?.tagCategory1 || undefined,
        tagCategory2: tag?.tagCategory2 || undefined,
        tagCategory3: tag?.tagCategory3 || undefined,
    });

    const isEditing = !!tag;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare data for submission
        const formData = {
            display_name: data.display_name,
            tagString: data.tagString,
            tagCategory1: data.tagCategory1 || null,
            tagCategory2: data.tagCategory2 || null,
            tagCategory3: data.tagCategory3 || null,
        };

        if (isEditing) {
            put(route('tags.update', tag.tagId), formData);
        } else {
            post(route('tags.store'), formData);
        }
    };

    const checkTagExists = async (tagValue, fieldName) => {
        if (!tagValue) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Using Inertia's visit method with replace to avoid page navigation
            const params = {
                [fieldName]: tagValue,
                tag_id: isEditing && tag?.tagId ? tag.tagId : ''
            };
            
            // We'll make a direct axios request to avoid Inertia's full page visit
            // but still leverage Laravel's CSRF protection
            window.axios.post(route('tags.check'), params)
                .then(response => {
                    const result = response.data;
                    
                    if (result === '1') {
                        if (fieldName === 'tag') {
                            setTagError('Tag already exists');
                        } else if (fieldName === 'dname') {
                            setDisplayNameError('Display name already exists');
                        }
                        reject('Already exists');
                    } else {
                        if (fieldName === 'tag') {
                            setTagError('');
                        } else if (fieldName === 'dname') {
                            setDisplayNameError('');
                        }
                        resolve();
                    }
                })
                .catch(error => {
                    console.error('Error checking tag:', error);
                    reject('Error checking tag');
                });
        });
    };

    // Format specialities for Ant Design Select
    const formattedSpecialities = specialities.map(spec => ({
        value: spec.value,
        label: spec.label
    }));

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Tag" : "Create Tag"} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex justify-between items-center">
                               
                                <h2 className="mt-2 text-2xl font-bold text-gray-900 ">
                                    {isEditing ? "Edit Tag" : "Create New Tag"}
                                </h2>
                                 <Link 
                                    href={route('tags.index')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Tags
                                </Link>
                               
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel for="tagString" value="Tag Name" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="tagString"
                                                type="text"
                                                placeholder="Enter tag name"
                                                value={data.tagString}
                                                onChange={(e) => setData('tagString', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            {tagError && <InputError message={tagError} className="mt-2" />}
                                        </div>
                                        
                                        <div>
                                            <InputLabel for="display_name" value="Display Name" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="display_name"
                                                type="text"
                                                placeholder="Enter display name"
                                                value={data.display_name}
                                                onChange={(e) => setData('display_name', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            {displayNameError && <InputError message={displayNameError} className="mt-2" />}
                                        </div>
                                    </div>
                                   
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <InputLabel for="tagCategory1" value="Speciality 1" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                id="tagCategory1"
                                                placeholder="Select speciality"
                                                value={data.tagCategory1}
                                                onChange={(value) => setData('tagCategory1', value)}
                                                options={formattedSpecialities}
                                                showSearch
                                                optionFilterProp="label"
                                                allowClear
                                                className="w-full mt-1"
                                            />
                                            {errors.tagCategory1 && <InputError message={errors.tagCategory1} className="mt-2" />}
                                        </div>
                                        
                                        <div>
                                            <InputLabel for="tagCategory2" value="Speciality 2" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                id="tagCategory2"
                                                placeholder="Select speciality"
                                                value={data.tagCategory2}
                                                onChange={(value) => setData('tagCategory2', value)}
                                                options={formattedSpecialities}
                                                showSearch
                                                optionFilterProp="label"
                                                allowClear
                                                className="w-full mt-1"
                                            />   
                                            {errors.tagCategory2 && <InputError message={errors.tagCategory2} className="mt-2" />}                           
                                        </div>
                                        
                                        <div>
                                            <InputLabel for="tagCategory3" value="Speciality 3" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                id="tagCategory3"
                                                placeholder="Select speciality"
                                                value={data.tagCategory3}
                                                onChange={(value) => setData('tagCategory3', value)}
                                                options={formattedSpecialities}
                                                showSearch
                                                optionFilterProp="label"
                                                allowClear
                                                className="w-full mt-1"
                                            />
                                            {errors.tagCategory3 && <InputError message={errors.tagCategory3} className="mt-2" />}
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
                                        <Link href={route('tags.index')}>
                                            <Button variant="outline" className="uppercase">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <PrimaryButton type="submit" disabled={processing}>
                                            Save
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
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