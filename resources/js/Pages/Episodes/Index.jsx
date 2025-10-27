import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Film, Pencil, Trash2 } from 'lucide-react';

export default function Index({ episodes }) {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { baseImagePath } = usePage().props;
    
    const pageSize = 25;

    const handleDelete = (id) => {
        if (confirm('Are you sure to delete this episode?')) {
            setLoading(true);
            router.delete(route('episodes.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Episode deleted successfully');
                },
                onFinish: () => setLoading(false),
            });
        }
    };

    // Status color mapping
    const getStatusColor = (status) => {
        const colorMap = {
            'live': 'success',
            'schedule': 'warning',
            'archive': 'default',
            'new': 'processing',
        };
        return colorMap[status] || 'default';
    };

    // Define table columns
    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'feature_image_banner',
            key: 'thumbnail',
            width: 120,
            render: (image, record) => (
                image ? (
                    <img
                        src={getEpisodeImageUrl(image, baseImagePath)}
                        alt={record.title}
                        className="h-16 w-24 rounded-lg object-cover shadow-sm border border-gray-200"
                    />
                ) : (
                    <div className="h-16 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className="fa fa-image text-gray-400 text-2xl"></i>
                    </div>
                )
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            render: (title) => (
                <div className="text-sm font-medium text-gray-900">{title}</div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
            ellipsis: true,
            render: (desc) => (
                <div className="max-w-md text-sm text-gray-500">
                    {desc?.substring(0, 100)}
                    {desc?.length > 100 ? '...' : ''}
                </div>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'date_time',
            key: 'date_time',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'video_status',
            key: 'status',
            render: (status) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        status === 'live'
                            ? 'bg-green-100 text-green-800'
                            : status === 'archive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                    {status}
                </span>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type_display',
            key: 'type',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '100px',
            align: 'center',
            render: (_, record) => (
                <div className="flex items-center justify-center gap-3">
                    <Link href={route('episodes.edit', record.id)}>
                        <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },

    ];

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
                                    <CardDescription className="mt-2">
                                        Manage your episode content and broadcasts
                                    </CardDescription>
                                </div>
                                <Link href={route('episodes.create')}>
                                    <Button size="lg">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Episode
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Table Card */}
                    <Card className="overflow-hidden border-0 shadow-md">
                        <CardContent className="p-6">
                            <Table
                                columns={columns}
                                dataSource={episodes}
                                loading={loading}
                                bordered
                                showSearch={true}
                                searchPlaceholder="Search episodes by title, description..."
                                searchableColumns={['title', 'desc', 'episode_type']}
                                showExport={true}
                                exportFileName="episodes"
                                filters={{
                                    video_status: ['live', 'schedule', 'archive', 'new'],
                                    episode_type: [],
                                }}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: episodes.length,
                                    onChange: (page) => setCurrentPage(page),
                                }}
                                emptyText="No episodes found."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
