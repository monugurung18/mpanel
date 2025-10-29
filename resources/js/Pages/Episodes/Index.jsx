import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import { Plus, Film, Pencil, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import {  message, Popconfirm } from 'antd';

export default function Index({ episodes }) {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { baseImagePath } = usePage().props;
    
    const pageSize = 25;

    const handleDelete = (id) => {
       
            setLoading(true);
            router.delete(route('episodes.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Episode deleted successfully');
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
    const filteredAndSortedEpisodes = useMemo(() => {
        let filtered = episodes.filter((episode) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                episode.title?.toLowerCase().includes(searchLower) ||
                episode.desc?.toLowerCase().includes(searchLower) ||
                episode.type_display?.toLowerCase().includes(searchLower)
            );
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn] || '';
                let bVal = b[sortColumn] || '';
                
                if (sortColumn === 'date_time') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [episodes, searchQuery, sortColumn, sortDirection]);

    // Pagination
    const paginatedEpisodes = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedEpisodes.slice(start, end);
    }, [filteredAndSortedEpisodes, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedEpisodes.length / pageSize);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            live: 'bg-green-100 text-green-800 border-green-200',
            archive: 'bg-gray-100 text-gray-800 border-gray-200',
            schedule: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            new: 'bg-blue-100 text-blue-800 border-blue-200',
        };

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Episodes
                </h2>
            }
        >
            <Head title="Episodes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <Card className="mb-6 border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Film className="h-6 w-6 text-primary" />
                                        Episodes Management
                                    </CardTitle>
                                    
                                </div>
                                <Link href={route('episodes.create')}>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Episode
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
                                placeholder="Search episodes by title, description, or type..."
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
                                            <SortableHeader column="title">Title</SortableHeader>
                                            <TableHead className="max-w-md">Description</TableHead>
                                            <SortableHeader column="date_time">Date</SortableHeader>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="w-[100px] text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00895f] border-t-transparent"></div>
                                                        <p className="mt-4 text-sm text-gray-500">Loading episodes...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedEpisodes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                            <Film className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground mb-2">
                                                            {searchQuery ? 'No episodes found' : 'No episodes yet'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            {searchQuery 
                                                                ? 'Try adjusting your search criteria' 
                                                                : 'Start by creating your first episode'
                                                            }
                                                        </p>
                                                        {!searchQuery && (
                                                            <Link href={route('episodes.create')}>
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add Episode
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedEpisodes.map((episode) => (
                                                <TableRow key={episode.id}>
                                                    <TableCell>
                                                        {episode.feature_image_banner ? (
                                                            <img
                                                                src={getEpisodeImageUrl(episode.feature_image_banner, baseImagePath)}
                                                                alt={episode.title}
                                                                className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                                <Film className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {episode.title}
                                                    </TableCell>
                                                    <TableCell className="max-w-md">
                                                        <div className="line-clamp-2 text-sm text-muted-foreground">
                                                            <div contentEditable='true' dangerouslySetInnerHTML={{ __html: episode.desc || '' }}></div>
 
                                                            
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {episode.date_time || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={episode.video_status} />
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {episode.type_display || 'Non-Sponsored'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link href={route('episodes.edit', episode.id)}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Popconfirm
                                                                title="Delete the task"
                                                                description="Are you sure to delete this episode?"
                                                                onConfirm={() => handleDelete(episode.id)}
                                                                onCancel={() => {}}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                               
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                              
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
                                <div className="flex items-center justify-between border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedEpisodes.length)} of {filteredAndSortedEpisodes.length} episodes
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
