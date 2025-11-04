import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import { Plus, Film, Pencil, Trash2, Search, ChevronUp, ChevronDown, Edit } from 'lucide-react';
import { Popconfirm, message } from 'antd';
import 'antd/dist/reset.css';

export default function Index({ episodes }) {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { baseImagePath } = usePage().props;

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route('episodes.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                message.success('Episode deleted successfully');
            },
            onError: () => {
                message.error('Failed to delete episode');
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

    // Get the actual data array from the paginated object
    const episodesData = episodes.data || [];

    // Filter and sort data
    const filteredAndSortedEpisodes = useMemo(() => {
        let filtered = episodesData.filter((episode) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                episode.title?.toLowerCase().includes(searchLower) ||
                episode.desc?.toLowerCase().includes(searchLower) ||
                episode.episode_type?.toLowerCase().includes(searchLower)
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
    }, [episodesData, searchQuery, sortColumn, sortDirection]);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            live: 'bg-green-100 text-green-800 border-green-200',
            archive: 'bg-gray-100 text-gray-800 border-gray-200',
            schedule: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            new: 'bg-blue-100 text-blue-800 border-blue-200',
        };

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
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
                    <Card className="mb-6 border-0 shadow-sm">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 ">
                                        Episodes Management
                                    </CardTitle>
                                    <CardDescription className="">
                                        Manage your video episodes and content
                                    </CardDescription>
                                </div>
                                <Link href={route('episodes.create')}>
                                    <Button size="default" className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Episode
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>

                        {/* Search */}
                        <div className="px-6 flex justify-between items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {episodes.from || 0} to {episodes.to || 0} of {episodes.total || 0} episodes
                            </div>
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search episodes by title, description, or type..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                    }}
                                    className="pl-10 py-2"
                                />
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50 rounded uppercase text-gray-500 text-xs">
                                            <TableHead className="w-[120px] rounded-t-md rounded-r-md">Thumbnail</TableHead>
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
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                                        <p className="mt-4 text-sm text-muted-foreground">Loading episodes...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredAndSortedEpisodes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                            <Film className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground mb-2">
                                                            {searchQuery ? 'No episodes found' : 'No episodes yet'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mb-4 max-w-md">
                                                            {searchQuery
                                                                ? 'Try adjusting your search criteria'
                                                                : 'Get started by creating your first episode'
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
                                            filteredAndSortedEpisodes.map((episode) => (
                                                <TableRow
                                                    key={episode.id}
                                                    className="hover:bg-muted/30 transition-colors"
                                                >
                                                    <TableCell>
                                                        {episode.feature_image_banner ? (
                                                            <img
                                                                src={getEpisodeImageUrl(episode.feature_image_banner, baseImagePath)}
                                                                alt={episode.title}
                                                                className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-24 bg-muted rounded-lg flex items-center justify-center border border-gray-200">
                                                                <Film className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium max-w-xs truncate">
                                                        {episode.title}
                                                    </TableCell>
                                                    <TableCell className="max-w-md">
                                                        <div
                                                            className="line-clamp-2 text-sm text-muted-foreground"
                                                            dangerouslySetInnerHTML={{
                                                                __html: episode.desc ? episode.desc.replace(/<[^>]*>/g, '').substring(0, 100) + (episode.desc.length > 100 ? '...' : '') : 'No description'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {episode.date_time ? new Date(episode.date_time).toLocaleDateString() : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={episode.video_status} />
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {episode.episode_type || 'Non-Sponsored'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link href={route('episodes.edit', episode.id)}>
                                                                <Button variant="ghost" size="sm" className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-blue-600 hover:bg-blue-100"
                                                                >
                                                                    <Edit className="mr-1 h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Popconfirm
                                                                title="Delete Episode"
                                                                description="Are you sure you want to delete this episode? This action cannot be undone."
                                                                onConfirm={() => handleDelete(episode.id)}
                                                                okText="Yes, Delete"
                                                                cancelText="Cancel"
                                                                okButtonProps={{
                                                                    danger: true,
                                                                    loading: loading
                                                                }}
                                                            >
                                                                <Button
                                                                    variant="ghost"
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
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {episodes.last_page > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {episodes.from || 0} to {episodes.to || 0} of {episodes.total || 0} episodes
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(episodes.prev_page_url)}
                                            disabled={!episodes.prev_page_url}
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, episodes.last_page) }, (_, i) => {
                                                let pageNum;
                                                if (episodes.last_page <= 5) {
                                                    pageNum = i + 1;
                                                } else if (episodes.current_page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (episodes.current_page >= episodes.last_page - 2) {
                                                    pageNum = episodes.last_page - 4 + i;
                                                } else {
                                                    pageNum = episodes.current_page - 2 + i;
                                                }

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={episodes.current_page === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => router.visit(`${window.location.pathname}?page=${pageNum}`)}
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
                                            onClick={() => router.visit(episodes.next_page_url)}
                                            disabled={!episodes.next_page_url}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Table Card */}
                    <Card className="border-0 shadow-sm">

                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}