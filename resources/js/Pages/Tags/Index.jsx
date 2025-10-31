import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function TagsIndex({ tags }) {
    const { props } = usePage();
    const { flash } = props;

    return (
        <AuthenticatedLayout>
            <Head title="Tags" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Tags Management</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage your content tags and their associated specialities
                                    </p>
                                </div>
                                <Link href={route('tags.create')}>
                                    <Button  
                                        
                                        className="flex items-center"
                                    >
                                        <PlusOutlined className="mr-2 h-4 w-4" />
                                        Add New Tag
                                    </Button>
                                </Link>
                            </div>

                            {flash?.success && (
                                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">
                                                {flash.success}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Display Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Tag Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Speciality 1
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Speciality 2
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Speciality 3
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {tags.length > 0 ? (
                                                tags.map((tag) => (
                                                    <tr key={tag.tagId} className="hover:bg-gray-50">
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">{tag.display_name}</div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm text-gray-900">{tag.tagString}</div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm text-gray-900">{tag.tagCategory1 || '-'}</div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm text-gray-900">{tag.tagCategory2 || '-'}</div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm text-gray-900">{tag.tagCategory3 || '-'}</div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Link
                                                                    href={route('tags.edit', tag.tagId)}
                                                                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-blue-600 hover:bg-blue-100"
                                                                >
                                                                    <EditOutlined className="mr-1 text-xs" />
                                                                    Edit
                                                                </Link>
                                                                <Link
                                                                    href={route('tags.destroy', tag.tagId)}
                                                                    method="delete"
                                                                    as="button"
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100"
                                                                >
                                                                    <DeleteOutlined className="mr-1 text-xs" />
                                                                    Delete
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Get started by creating a new tag.
                                                            </p>
                                                            <div className="mt-6">
                                                                <Link href={route('tags.create')}>
                                                                    <Button 
                                                                        type="primary" 
                                                                        icon={<PlusOutlined />}
                                                                    >
                                                                        Add New Tag
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}