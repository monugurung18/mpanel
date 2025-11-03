import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Popconfirm, message } from 'antd';
import 'antd/dist/reset.css';

export default function UsersIndex({ users }) {
    const { props } = usePage();
    const { flash } = props;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users.data;
        const term = searchTerm.toLowerCase();
        return users.data.filter(user =>
            (user.user_FullName && user.user_FullName.toLowerCase().includes(term)) ||
            (user.user_email && user.user_email.toLowerCase().includes(term)) ||
            (user.profession && user.profession.toLowerCase().includes(term))
        );
    }, [users.data, searchTerm]);

    // Pagination
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const handleDelete = (userId) => {
        router.delete(route('users.destroy', userId), {
            onSuccess: () => {
                message.success('User deleted successfully!');
            },
            onError: () => {
                message.error('Failed to delete user.');
            },
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Instructors" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="mb-6 border-0 shadow-sm">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 ">
                                        Instructors Management
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        Manage instructor profiles and accounts
                                    </CardDescription>
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
                                <Link href={route('users.create')}>
                                    <Button size="default" className="w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Add Instructor
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="px-6">
                                {/* Search Input */}
                                <div className="mb-6 flex justify-end">
                                    <div className="relative w-full max-w-md">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search by name, email, or profession..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="pl-10 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Shadcn UI Table */}
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted hover:bg-muted/50 rounded uppercase text-gray-500 text-xs">
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Profession</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedUsers.length > 0 ? (
                                                paginatedUsers.map((user) => (
                                                    <TableRow key={user.user_no} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">{user.title} {user.user_FullName}</TableCell>
                                                        <TableCell>{user.user_email}</TableCell>
                                                        <TableCell>{user.profession || '-'}</TableCell>
                                                        <TableCell>{user.user_phone || '-'}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Link
                                                                    href={route('users.edit', user.user_no)}
                                                                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-blue-600 hover:bg-blue-100"
                                                                >
                                                                    <Edit className="mr-1 h-4 w-4" />
                                                                </Link>
                                                                <Popconfirm
                                                                    title="Delete user"
                                                                    description="Are you sure you want to delete this user?"
                                                                    onConfirm={() => handleDelete(user.user_no)}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    okButtonProps={{ danger: true }}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100"
                                                                    >
                                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                                    </Button>
                                                                </Popconfirm>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No instructors found</h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {searchTerm ? 'No instructors match your search.' : 'Get started by creating a new instructor.'}
                                                            </p>
                                                            {!searchTerm && (
                                                                <div className="mt-6">
                                                                    <Link href={route('users.create')}>
                                                                        <Button>
                                                                            <Plus className="mr-2 h-4 w-4" />
                                                                            Add New Instructor
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} instructors
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Previous
                                            </Button>
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                // Show first, last, current, and nearby pages
                                                if (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <Button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="sm"
                                                        >
                                                            {page}
                                                        </Button>
                                                    );
                                                }
                                                // Show ellipsis for skipped pages
                                                if (page === currentPage - 2 || page === currentPage + 2) {
                                                    return (
                                                        <span key={page} className="px-2 py-1 text-gray-500">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}
                                            <Button
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}