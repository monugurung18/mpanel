import Table from '@/Components/Table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Example: Users List Page using Table Component
 * This demonstrates how to use the Table component with pagination and actions
 */
export default function UsersList({ users, pagination }) {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(pagination?.current || 1);

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
        router.get(
            route('users.index'),
            { page },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setLoading(true);
            router.delete(route('users.destroy', userId), {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleToggleStatus = (userId) => {
        setLoading(true);
        router.post(
            route('users.toggle-status', userId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    // Define columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '80px',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: '80px',
            render: (avatar, record) => (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    {record.name?.charAt(0).toUpperCase() || 'U'}
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (name, record) => (
                <div>
                    <div className="font-medium text-gray-900">{name}</div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {role}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '120px',
            render: (status, record) => (
                <button
                    onClick={() => handleToggleStatus(record.id)}
                    className={`inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${
                        status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                >
                    {status}
                </button>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: true,
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '150px',
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <div className="flex items-center justify-center gap-2">
                    <Link
                        href={route('users.show', record.id)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        title="View"
                    >
                        <i className="fa fa-eye"></i>
                    </Link>
                    <Link
                        href={route('users.edit', record.id)}
                        className="rounded p-1 text-indigo-600 hover:bg-indigo-50"
                        title="Edit"
                    >
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button
                        onClick={() => handleDelete(record.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        title="Delete"
                    >
                        <i className="fa fa-trash-o"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Users</h2>
                    <Link
                        href={route('users.create')}
                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <i className="fa fa-plus mr-2"></i>
                        Add User
                    </Link>
                </div>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Table
                                columns={columns}
                                dataSource={users}
                                loading={loading}
                                bordered
                                striped
                                pagination={{
                                    current: currentPage,
                                    pageSize: pagination?.pageSize || 10,
                                    total: pagination?.total || users.length,
                                    onChange: handlePageChange,
                                }}
                                emptyText="No users found."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
