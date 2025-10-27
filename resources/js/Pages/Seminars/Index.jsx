import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Table, Space, Tag, Input, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Video, Pencil, Trash2 } from 'lucide-react';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';

export default function Index({ seminars }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { baseImagePath } = usePage().props;

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route('seminars.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {},
            onFinish: () => setLoading(false),
        });
    };

    // Get image URL helper
    const getSeminarImageUrl = (imageName) => {
        if (!imageName) return '';
        return `${baseImagePath}/${imageName}`;
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
            dataIndex: 'video_image',
            key: 'thumbnail',
            width: 120,
            render: (image, record) => (
                image ? (
                    <img
                        src={getSeminarImageUrl(image)}
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
            width: 250,
            sorter: (a, b) => a.title.localeCompare(b.title),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) => {
                // Strip HTML tags from description for search
                const plainDesc = record.desc?.replace(/<[^>]*>/g, '') || '';
                return (
                    record.title.toLowerCase().includes(value.toLowerCase()) ||
                    plainDesc.toLowerCase().includes(value.toLowerCase()) ||
                    record.type_display?.toLowerCase().includes(value.toLowerCase())
                );
            },
            render: (title, record) => (
                <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                        {(() => {
                            // Strip HTML tags and get plain text
                            const plainText = record.desc?.replace(/<[^>]*>/g, '') || '';
                            const truncated = plainText.substring(0, 80);
                            return truncated + (plainText.length > 80 ? '...' : '');
                        })()}
                    </div>
                </div>
            ),
        },
        {
            title: 'Schedule',
            dataIndex: 'schedule_timestamp',
            key: 'schedule_timestamp',
            width: 150,
            sorter: (a, b) => new Date(a.schedule_timestamp) - new Date(b.schedule_timestamp),
            render: (datetime) => (
                <div className="text-sm">
                    {datetime ? (
                        <div className="flex items-center text-gray-700">
                            <i className="fa fa-calendar mr-2 text-gray-400"></i>
                            {new Date(datetime).toLocaleString()}
                        </div>
                    ) : (
                        <span className="text-gray-400">Not scheduled</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'video_status',
            key: 'video_status',
            width: 100,
            filters: [
                { text: 'Live', value: 'live' },
                { text: 'Scheduled', value: 'schedule' },
                { text: 'Archive', value: 'archive' },
                { text: 'New', value: 'new' },
            ],
            onFilter: (value, record) => record.video_status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)} className="uppercase font-medium">
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type_display',
            key: 'type_display',
            width: 120,
            render: (type) => (
                <div className="text-sm text-gray-700">
                    <i className="fa fa-tag mr-2 text-gray-400"></i>
                    {type || 'Non-Sponsored'}
                </div>
            ),
        },
        {
            title: 'Featured',
            dataIndex: 'isFeatured',
            key: 'isFeatured',
            width: 80,
            align: 'center',
            render: (isFeatured) => (
                isFeatured ? (
                    <i className="fa fa-star text-yellow-500 text-lg"></i>
                ) : (
                    <i className="fa fa-star-o text-gray-300 text-lg"></i>
                )
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Link href={route('seminars.edit', record.id)}>
                        <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Delete Seminar"
                        description="Are you sure to delete this seminar?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
                                    <Button size="lg">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Seminar
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <Input
                            placeholder="Search by title, description, or type..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            size="large"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            className="max-w-md"
                        />
                    </div>

                    {/* Table Card */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-0">
                            <Table
                                columns={columns}
                                dataSource={seminars}
                                rowKey="id"
                                loading={loading}
                                pagination={{
                                    pageSize: 25,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} seminars`,
                                    pageSizeOptions: ['10', '25', '50', '100'],
                                }}
                                bordered
                                size="middle"
                                locale={{
                                    emptyText: (
                                        <div className="py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                                    <Video className="h-10 w-10 text-muted-foreground" />
                                                </div>
                                                <p className="text-lg font-semibold text-foreground mb-2">No seminars found</p>
                                                <p className="text-sm text-muted-foreground mb-4">Start by creating your first seminar</p>
                                                <Link href={route('seminars.create')}>
                                                    <Button>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Seminar
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ),
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
