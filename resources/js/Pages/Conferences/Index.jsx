import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import { Plus, Users, Pencil, Trash2, Search, Play, Calendar, Edit } from 'lucide-react';
import { Popconfirm } from 'antd';

import 'antd/dist/reset.css';

export default function Index({ conferences }) {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 25;

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route('conferences.destroy', id), {
            preserveScroll: true,
            onSuccess: () => { },
            onFinish: () => setLoading(false),
        });
    };

    // Filter data
    const filteredConferences = useMemo(() => {
        return conferences.filter((conference) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                conference.title?.toLowerCase().includes(searchLower) ||
                conference.conference_name?.toLowerCase().includes(searchLower)
            );
        });
    }, [conferences, searchQuery]);

    // Pagination
    const paginatedConferences = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredConferences.slice(start, end);
    }, [filteredConferences, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredConferences.length / pageSize);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            live: 'bg-green-100 text-green-800 border-green-200',
            archive: 'bg-gray-100 text-gray-800 border-gray-200',
            schedule: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Conferences" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <Card className="mb-6 border-0 shadow-lg">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Conferences Management
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Manage your conference content and schedule
                                    </CardDescription>
                                </div>
                                <Link href={route('conferences.create')}>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Conference
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        {/* Search */}
                        <div className="px-6 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredConferences.length)} of {filteredConferences.length} conferences
                            </div>
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by title or conference name..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className=""
                                />
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Thumbnail</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Schedule Date / Time</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Subscribers</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-[100px] text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00895f] border-t-transparent"></div>
                                                        <p className="mt-4 text-sm text-gray-500">Loading conferences...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedConferences.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                            <Play className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground mb-2">
                                                            {searchQuery ? 'No conferences found' : 'No conferences yet'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            Get started by creating a new conference.
                                                        </p>
                                                        <Link href={route('conferences.create')}>
                                                            <Button>
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Add Conference
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedConferences.map((conference) => (
                                                <TableRow key={conference.id} className="hover:bg-muted/50">
                                                    <TableCell>
                                                        {conference.banner ? (
                                                            <img
                                                                src={`https://medtalks.in/conf_banner/${conference.banner}`}
                                                                alt={conference.title}
                                                                className="w-16 h-16 object-cover rounded-md border"
                                                                onError={(e) => {
                                                                    e.target.src = '/images/placeholder.png';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                                                <Play className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{conference.title}</div>
                                                        <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                            {conference.description?.substring(0, 100)}...
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            <span>{conference.schedule_date} / {conference.end_date}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {conference.start_time} / {conference.end_time}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span>{conference.subscribers || 0}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={conference.status} />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link
                                                                href={route('conferences.edit', conference.id)}
                                                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <Popconfirm
                                                                title="Delete Conference"
                                                                description="Are you sure you want to delete this conference?"
                                                                onConfirm={() => handleDelete(conference.id)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                                placement="left"
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </Popconfirm>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-2 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}