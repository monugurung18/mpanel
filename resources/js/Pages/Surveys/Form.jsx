import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@/Components/ui/textarea';

export default function SurveyForm({ survey }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: survey?.title || '',
        custom_url: survey?.custom_url || '',
        emb_url: survey?.emb_url || '',
        desp: survey?.desp || '',
    });

    const isEditing = !!survey;

    // Auto-generate custom URL from title
    useEffect(() => {
        if (!isEditing && data.title) {
            const slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setData('custom_url', slug);
        }
    }, [data.title]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('surveys.update', survey.id), data);
        } else {
            post(route('surveys.store'), data);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Survey" : "Create Survey"} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="mt-2 text-2xl font-bold text-gray-900 ">
                                    {isEditing ? "Edit Survey" : "Create New Survey"}
                                </h2>
                                <Link 
                                    href={route('surveys.index')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Surveys
                                </Link>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel for="title" value="Title" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="title"
                                                type="text"
                                                placeholder="Enter survey title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            {errors.title && <InputError message={errors.title} className="mt-2" />}
                                        </div>
                                        
                                        <div>
                                            <InputLabel for="custom_url" value="Custom URL" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                placeholder="Enter custom URL"
                                                value={data.custom_url}
                                                onChange={(e) => setData('custom_url', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            {errors.custom_url && <InputError message={errors.custom_url} className="mt-2" />}
                                        </div>
                                    </div>
                                   
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <InputLabel for="emb_url" value="Embed Link" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="emb_url"
                                                type="text"
                                                placeholder="Enter embed link"
                                                value={data.emb_url}
                                                onChange={(e) => setData('emb_url', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                            {errors.emb_url && <InputError message={errors.emb_url} className="mt-2" />}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <InputLabel for="desp" value="Description" className="text-sm font-medium text-gray-700" />
                                            <Textarea
                                                id="desp"
                                                placeholder="Enter survey description"
                                                value={data.desp}
                                                onChange={(e) => setData('desp', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm min-h-[100px]"
                                            />
                                            {errors.desp && <InputError message={errors.desp} className="mt-2" />}
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
                                        <Link href={route('surveys.index')}>
                                            <Button variant="outline" className="uppercase">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <PrimaryButton type="submit" disabled={processing}>
                                            {isEditing ? 'Update Survey' : 'Create Survey'}
                                            <i className="fa fa-arrow-right ml-2"></i>
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