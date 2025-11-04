import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Plus,Search, ChevronUp, ChevronDown, Calendar, FileText, Eye, Trash2, Pencil, Edit } from 'lucide-react';
import { getPostImageUrl } from '@/Utils/imageHelper';
import { Button, message, Popconfirm } from 'antd';


export default function Index({ posts }) {
    const { props } = usePage();
    const { baseImagePath } = props;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Strip HTML tags for search
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return tmp.textContent || tmp.innerText || '';
    };

    // Filter and sort posts
    const filteredAndSortedPosts = useMemo(() => {
        let filtered = posts.filter((post) => {
            const searchLower = searchQuery.toLowerCase();
            const plainContent = stripHtml(post.theContent);
            const plainTranscript = stripHtml(post.transcript);
            
            return (
                post.title?.toLowerCase().includes(searchLower) ||
                plainContent.toLowerCase().includes(searchLower) ||
                plainTranscript.toLowerCase().includes(searchLower) ||
                post.catagory1?.toLowerCase().includes(searchLower) ||
                post.author1?.toLowerCase().includes(searchLower) ||
                post.status?.toLowerCase().includes(searchLower) ||
                post.postType?.toLowerCase().includes(searchLower)
            );
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[sortColumn] || '';
                let bVal = b[sortColumn] || '';

                if (sortColumn === 'created_on' || sortColumn === 'post_date') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [posts, searchQuery, sortColumn, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage);
    const paginatedPosts = filteredAndSortedPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleDelete = (id) => {
      
            router.delete(route('posts.destroy', id));
        
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        // Handle string dates from database
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadgeClass = (status) => {
        const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
        switch (status) {
            case 'published':
                return `${baseClass} bg-green-100 text-green-800`;
            case 'draft':
                return `${baseClass} bg-yellow-100 text-yellow-800`;
            case 'archived':
                return `${baseClass} bg-gray-100 text-gray-800`;
            default:
                return `${baseClass} bg-gray-100 text-gray-800`;
        }
    };

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
            <Head title="Posts Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <div>

                                    <h2 className="text-2xl font-bold text-gray-900 ">Posts Management</h2>
                                    <p>Manage your blog posts and articles</p>
                                </div>
                                <Link
                                    href={route('posts.create')}
                                    className="inline-flex items-center rounded-md bg-[#00895f] px-4 py-2 text-sm  text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#00895f] focus:ring-offset-2"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Post
                                </Link>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-6 flex justify-between items-center">
                                {/* Results count */}
                            <div className=" text-sm text-gray-600">
                                Showing {paginatedPosts.length} of {filteredAndSortedPosts.length} posts
                                {searchQuery && ` (filtered from ${posts.length} total)`}
                            </div>
                                <div className="relative w-full max-w-md">
                                  
                                    <input
                                        type="text"
                                        placeholder="Search posts by title, content, category, author..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 text-sm placeholder-gray-500 focus:border-[#00895f] focus:outline-none focus:ring-1 focus:ring-[#00895f]"
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FileText className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-blue-600">Total Posts</p>
                                            <p className="text-2xl font-bold text-blue-900">{posts.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-green-50 p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <i className="fa fa-check-circle text-3xl text-green-600"></i>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-green-600">Published</p>
                                            <p className="text-2xl font-bold text-green-900">
                                                {posts.filter(p => p.status === 'published' && p.isActive === '1').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-yellow-50 p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <i className="fa fa-edit text-3xl text-yellow-600"></i>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-yellow-600">Drafts</p>
                                            <p className="text-2xl font-bold text-yellow-900">
                                                {posts.filter(p => p.status === 'draft').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-purple-50 p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <i className="fa fa-star text-3xl text-purple-600"></i>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-purple-600">Featured</p>
                                            <p className="text-2xl font-bold text-purple-900">
                                                {posts.filter(p => p.isFeatured).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            

                            {/* Table */}
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="w-16">#</TableHead>
                                            <TableHead className="w-24">Image</TableHead>
                                            <SortableHeader column="title">Title</SortableHeader>
                                            <SortableHeader column="catagory1">Category</SortableHeader>
                                           
                                            <SortableHeader column="status">Status</SortableHeader>
                                            <SortableHeader column="postType">Type</SortableHeader>
                                          
                                            <SortableHeader column="publish_date">Published</SortableHeader>
                                            <TableHead className="w-32 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedPosts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FileText className="mb-4 h-12 w-12 text-gray-400" />
                                                        <p className="text-lg font-medium text-gray-900">No posts found</p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {searchQuery
                                                                ? 'Try adjusting your search terms'
                                                                : 'Get started by creating a new post'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedPosts.map((post, index) => (
                                                <TableRow key={post.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium text-gray-900">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {post.featuredThumbnail ? (
                                                            <img
                                                                src={getPostImageUrl(post.featuredThumbnail, baseImagePath)}
                                                                alt={post.alt_image || post.title}
                                                                className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                                <FileText className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-xs">
                                                            <div className="font-semibold text-gray-900 truncate">
                                                                {post.title}
                                                            </div>
                                                            {post.transcript && (
                                                                <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                                                                    {stripHtml(post.transcript)}
                                                                </div>
                                                            )}
                                                            {post.isFeatured ? (
                                                                <span className="mt-1 inline-flex items-center text-xs text-yellow-600">
                                                                    <i className="fa fa-star mr-1"></i>
                                                                    Featured
                                                                </span>
                                                            ) : null}
                                                            {post.videoLink && (
                                                                <span className="mt-1 ml-2 inline-flex items-center text-xs text-blue-600">
                                                                    <i className="fa fa-video-camera mr-1"></i>
                                                                    Video
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {post.catagory1 ? (
                                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                                {post.catagory1_title}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </TableCell>
                                                  
                                                    <TableCell>
                                                        <span className={getStatusBadgeClass(post.status)}>
                                                            {post.status}
                                                        </span>
                                                        {post.isActive === '0' && (
                                                            <span className="ml-1 text-xs text-red-600">(Inactive)</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {post.postType ? (
                                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                                {post.postType}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    
                                                    <TableCell className="text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            {formatDate(post.post_date)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link
                                                                href={route('posts.edit', post.articleID)}
                                                                title='Edit'
                                                                 className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-blue-600 hover:bg-blue-100"
                                                                >
                                                                    <Edit className="mr-1 h-4 w-4" />
                                                            </Link>
                                                            <Popconfirm
                                                                title="Delete the task"
                                                                description="Are you sure to delete this post?"
                                                                onConfirm={() => handleDelete(post.articleID)}
                                                                onCancel={()=>{}}
                                                                okText="Yes"
                                                                cancelText="No"
                                                                className="text-red-600 hover:text-red-800"
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
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Previous
                                        </Button>
                                        
                                        {/* Page Number Navigation */}
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
                                                        onClick={() => setCurrentPage(page)}
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
                                                    <span key={page} className="px-2 py-2 text-gray-500">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                        
                                        <Button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}