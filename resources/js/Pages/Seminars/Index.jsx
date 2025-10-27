import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import { Plus, Video, Pencil, Trash2, Search, ChevronUp, ChevronDown, Calendar } from 'lucide-react';
import { getSeminarImageUrl } from '@/Utils/imageHelper';

export default function Index({ seminars }) {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { baseImagePath } = usePage().props;
    
    const pageSize = 25;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this seminar?')) {
            setLoading(true);
            router.delete(route('seminars.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {},
                onFinish: () => setLoading(false),
            });
        }
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
    const filteredAndSortedSeminars = useMemo(() => {
        let filtered = seminars.filter((seminar) => {
            const searchLower = searchQuery.toLowerCase();
            const plainDesc = stripHtml(seminar.desc);
            return (
                seminar.title?.toLowerCase().includes(searchLower) ||
                plainDesc.toLowerCase().includes(searchLower) ||
                seminar.type_display?.toLowerCase().includes(searchLower)
            );
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn] || '';
                let bVal = b[sortColumn] || '';
                
                if (sortColumn === 'schedule_timestamp') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [seminars, searchQuery, sortColumn, sortDirection]);

    // Pagination
    const paginatedSeminars = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedSeminars.slice(start, end);
    }, [filteredAndSortedSeminars, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedSeminars.length / pageSize);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            live: 'bg-green-100 text-green-800 border-green-200',
            archive: 'bg-gray-100 text-gray-800 border-gray-200',
            schedule: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            new: 'bg-blue-100 text-blue-800 border-blue-200',
        };

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${
                styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
                {status}
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
        <AuthenticatedLayout>
            <Head title="Seminars" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <Card className="mb-6 border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Video className="h-6 w-6 text-primary" />
                                        Seminars Management
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Manage your seminar content and schedule
                                    </CardDescription>
                                </div>
                                <Link href={route('seminars.create')}>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Seminar
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by title, description, or type..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Table Card */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[120px]">Thumbnail</TableHead>
                                            <SortableHeader column="title">Title & Description</SortableHeader>
                                            <SortableHeader column="schedule_timestamp">Schedule</SortableHeader>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="w-[100px] text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00895f] border-t-transparent"></div>
                                                        <p className="mt-4 text-sm text-gray-500">Loading seminars...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedSeminars.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                            <Video className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground mb-2">
                                                            {searchQuery ? 'No seminars found' : 'No seminars yet'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            {searchQuery 
                                                                ? 'Try adjusting your search criteria' 
                                                                : 'Start by creating your first seminar'
                                                            }
                                                        </p>
                                                        {!searchQuery && (
                                                            <Link href={route('seminars.create')}>
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add Seminar
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedSeminars.map((seminar) => (
                                                <TableRow key={seminar.id}>
                                                    <TableCell>
                                                        {seminar.video_image ? (
                                                            <img
                                                                src={getSeminarImageUrl(seminar.video_image, baseImagePath)}
                                                                alt={seminar.title}
                                                                className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                                <Video className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-md">
                                                            <div className="font-semibold text-gray-900 text-sm mb-1">
                                                                {seminar.title}
                                                            </div>
                                                            <div className="text-xs text-gray-500 line-clamp-2">
                                                                {stripHtml(seminar.desc).substring(0, 80)}
                                                                {stripHtml(seminar.desc).length > 80 ? '...' : ''}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {seminar.schedule_timestamp ? (
                                                            <div className="flex items-center text-sm text-gray-700">
                                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                                <div>
                                                                    <div>{new Date(seminar.schedule_timestamp).toLocaleDateString()}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {new Date(seminar.schedule_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Not scheduled</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={seminar.video_status} />
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {seminar.type_display || 'Non-Sponsored'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link href={route('seminars.edit', seminar.id)}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(seminar.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
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
                                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedSeminars.length)} of {filteredAndSortedSeminars.length} seminars
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
