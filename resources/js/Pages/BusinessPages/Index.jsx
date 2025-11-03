import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import InputLabel from '@/Components/InputLabel';
import { Plus, Building, Pencil, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Popconfirm } from 'antd';
import 'antd/dist/reset.css';

export default function Index({ businesses }) {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const pageSize = 10;

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route('business-pages.destroy', id), {
            preserveScroll: true,
            onSuccess: () => { },
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

    // Strip HTML tags helper
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

    // Filter and sort data
    const filteredAndSortedBusinesses = useMemo(() => {
        let filtered = businesses.filter((business) => {
            const searchLower = searchQuery.toLowerCase();
            const plainDesc = stripHtml(business.business_description);
            return (
                business.business_Name?.toLowerCase().includes(searchLower) ||
                plainDesc.toLowerCase().includes(searchLower) ||
                business.businessCategory?.toLowerCase().includes(searchLower) ||
                business.businessType?.toLowerCase().includes(searchLower) ||
                business.city?.toLowerCase().includes(searchLower)
            );
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn] || '';
                let bVal = b[sortColumn] || '';

                // Special handling for certain columns
                if (sortColumn === 'business_Name' || sortColumn === 'businessCategory' || sortColumn === 'businessType') {
                    aVal = aVal.toString().toLowerCase();
                    bVal = bVal.toString().toLowerCase();
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [businesses, searchQuery, sortColumn, sortDirection]);

    // Pagination
    const paginatedBusinesses = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedBusinesses.slice(start, end);
    }, [filteredAndSortedBusinesses, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedBusinesses.length / pageSize);

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
        <AuthenticatedLayout>
            <Head title="Business Pages" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <Card className="mb-6 border-0 shadow-lg">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Business Pages Management
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Manage your business pages and their information
                                    </CardDescription>
                                </div>
                                <Link href={route('business-pages.create')}>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Business
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        {/* Search */}
                        <div className="px-6 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedBusinesses.length)} of {filteredAndSortedBusinesses.length} businesses
                            </div>
                            <div className="relative w-full max-w-md">
                                <InputLabel for="search" value="Search" className="sr-only" />
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Search by name, category, type, or city..."
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
                                            <TableHead className="w-[150px]">Business Name</TableHead>
                                            <SortableHeader column="businessCategory">Category</SortableHeader>
                                            <SortableHeader column="businessType">Type</SortableHeader>
                                            <TableHead>Contact</TableHead>
                                            <SortableHeader column="city">Location</SortableHeader>
                                            <TableHead className="w-[100px] text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00895f] border-t-transparent"></div>
                                                        <p className="mt-4 text-sm text-gray-500">Loading businesses...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedBusinesses.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                            <Building className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground mb-2">
                                                            {searchQuery ? 'No businesses found' : 'No businesses yet'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            {searchQuery
                                                                ? 'Try adjusting your search criteria'
                                                                : 'Start by creating your first business page'
                                                            }
                                                        </p>
                                                        {!searchQuery && (
                                                            <Link href={route('business-pages.create')}>
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add Business
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedBusinesses.map((business) => (
                                                <TableRow key={business.businessID}>
                                                    <TableCell>
                                                        <div className="font-semibold text-gray-900 text-sm">
                                                            {business.business_Name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                                                            {stripHtml(business.business_description || '').substring(0, 60) || '-'}
                                                            {stripHtml(business.business_description || '').length > 60 ? '...' : ''}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {business.businessCategory || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {business.businessType || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {business.businessEmail && (
                                                                <div className="text-blue-600">{business.businessEmail}</div>
                                                            )}
                                                            {business.businessContactNumber && (
                                                                <div className="text-gray-600">{business.businessContactNumber}</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {business.city && business.state ? 
                                                            `${business.city}, ${business.state}` : 
                                                            business.city || business.state || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link 
                                                                href={route('business-pages.edit', business.businessID)}
                                                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            {/* <Popconfirm
                                                                title="Delete Business"
                                                                description="Are you sure you want to delete this business?"
                                                                onConfirm={() => handleDelete(business.businessID)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                                placement="topRight"
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </Popconfirm> */}
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
                                <div className="flex items-center justify-between border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedBusinesses.length)} of {filteredAndSortedBusinesses.length} businesses
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
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
                                            onClick={() => setCurrentPage(currentPage + 1)}
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