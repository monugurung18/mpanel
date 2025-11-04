import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import { Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown, Edit } from 'lucide-react';
import { Popconfirm, message } from 'antd';
import 'antd/dist/reset.css';

export default function Index({ specialties }) {
    console.log(specialties);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { baseImagePath } = usePage().props;

    const pageSize = 25;

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route('specialties.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                message.success('Specialty deleted successfully');
            },
            onError: () => {
                message.error('Failed to delete specialty');
            },
            onFinish: () => setLoading(false),
        });
    };

    // Handle sorting
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Filter and sort data
    const filteredAndSortedSpecialties = useMemo(() => {
        let filtered = specialties.filter((specialty) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                specialty.title?.toLowerCase().includes(searchLower) ||
                specialty.spec_desc?.toLowerCase().includes(searchLower)
            );
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn] || '';
                let bVal = b[sortColumn] || '';

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [specialties, searchQuery, sortColumn, sortDirection]);

    // Pagination
    const paginatedSpecialties = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedSpecialties.slice(start, end);
    }, [filteredAndSortedSpecialties, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedSpecialties.length / pageSize);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            on: 'bg-green-100 text-green-800 border-green-200',
            off: 'bg-red-100 text-red-800 border-red-200',
        };

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                {status === 'on' ? 'Active' : 'Inactive'}
            </span>
        );
    };

    // Sortable header component
    const SortableHeader = ({ column, children }) => (
        <TableHead
            className="cursor-pointer select-none hover:bg-muted/50"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center gap-2">
                {children}
                {sortColumn === column && (
                    sortDirection === 'asc' ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                )}
            </div>
        </TableHead>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Specialties
                </h2>
            }
        >
            <Head title="Specialties" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <Card className="mb-6 border-0 shadow-sm">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                        Speciality Management
                                    </CardTitle>
                                    <CardDescription >
                                        Manage your specialty categories and their associated content
                                    </CardDescription>
                                </div>
                                <Link href={route('specialties.create')}>
                                    <Button size="default" className="w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Add Speciality
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>

                        {/* Search */}
                        <div className="px-6 flex justify-between items-center">
                             <div className="text-sm text-muted-foreground">
                                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedSpecialties.length)} of {filteredAndSortedSpecialties.length} specialties
                                    </div>
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search specialties by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className=" py-2"
                                />
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted hover:bg-muted/50 rounded uppercase text-gray-500 text-xs">
                                            <SortableHeader column="title">Name</SortableHeader>
                                            <TableHead className="max-w-md">Description</TableHead>
                                            <TableHead>App Image</TableHead>
                                            <TableHead>App Banner</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-[100px] text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                                        <p className="mt-4 text-sm text-muted-foreground">Loading specialties...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedSpecialties.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                            <Plus className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground mb-2">
                                                            {searchQuery ? 'No specialities found' : 'No specialities yet'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mb-4 max-w-md">
                                                            {searchQuery
                                                                ? 'Try adjusting your search criteria'
                                                                : 'Get started by creating your first specialty'
                                                            }
                                                        </p>
                                                        {!searchQuery && (
                                                            <Link href={route('specialties.create')}>
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add Specialty
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedSpecialties.map((specialty) => (
                                                <TableRow
                                                    key={specialty.no}
                                                    className="hover:bg-muted/30 transition-colors"
                                                >

                                                    <TableCell className="font-medium max-w-xs truncate">
                                                        {specialty.title}
                                                    </TableCell>
                                                    <TableCell className="max-w-md">
                                                        <div
                                                            className="line-clamp-2 text-sm text-muted-foreground"
                                                            dangerouslySetInnerHTML={{
                                                                __html: specialty.spec_desc ? specialty.spec_desc.replace(/<[^>]*>/g, '').substring(0, 100) + (specialty.spec_desc.length > 100 ? '...' : '') : 'No description'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {specialty.mobileThumb ? (
                                                            <img
                                                                src={`/uploads/specialty/${specialty.mobileThumb}`}
                                                                alt={specialty.title}
                                                                className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="  flex items-center justify-center">-
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {specialty.thumbnail_img ? (
                                                            <img
                                                                src={`/uploads/specialty/${specialty.thumbnail_img}`}
                                                                alt={specialty.title}
                                                                className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className=" flex items-center justify-center ">
                                                                -                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={specialty.status} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">

                                                            <Link
                                                                href={route('specialties.edit', specialty.no)}
                                                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <Popconfirm
                                                                title="Delete Specialty"
                                                                description="Are you sure you want to delete this specialty? This action cannot be undone."
                                                                onConfirm={() => handleDelete(specialty.no)}
                                                                okText="Yes, Delete"
                                                                cancelText="Cancel"
                                                                okButtonProps={{
                                                                    danger: true,
                                                                    loading: loading
                                                                }}
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
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedSpecialties.length)} of {filteredAndSortedSpecialties.length} specialties
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={currentPage === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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