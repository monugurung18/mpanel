import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';
import { Table, Button, Space, Tag, Input, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';

export default function Index({ episodes }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { baseImagePath } = usePage().props;

    const handleDelete = (id) => {
        setLoading(true);
        router.delete(route('episodes.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {},
            onFinish: () => setLoading(false),
        });
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
            width: 200,
            sorter: (a, b) => a.title.localeCompare(b.title),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) => {
                // Strip HTML tags from description for search
                const plainDesc = record.desc?.replace(/<[^>]*>/g, '') || '';
                return (
                    record.title.toLowerCase().includes(value.toLowerCase()) ||
                    plainDesc.toLowerCase().includes(value.toLowerCase()) ||
                    record.episode_type?.toLowerCase().includes(value.toLowerCase())
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
            title: 'Date & Time',
            dataIndex: 'date_time',
            key: 'date_time',
            width: 150,
            sorter: (a, b) => new Date(a.date_time) - new Date(b.date_time),
            render: (date) => (
                <div className="text-sm">
                    <div className="flex items-center text-gray-700">
                        <i className="fa fa-calendar mr-2 text-gray-400"></i>
                        {date}
                    </div>
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
            dataIndex: 'episode_type' ,
            key: 'episode_type',
            width: 100,
            render: (type) => (
                <div className="text-sm text-gray-700">
                    <i className="fa fa-tag mr-2 text-gray-400"></i>
                    {(type=='evening' || type=='afternoon')?'Non-Sponsored' :'Sponsored'}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Link
                        href={route('episodes.edit', record.id)}
                        className="text-[#00895f] hover:text-emerald-700 transition-colors"
                    >
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            className="hover:bg-emerald-50"
                        >
                            
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Delete Episode"
                        description="Are you sure to delete this episode?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            className="hover:bg-red-50"
                        >
                           
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Episodes" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Episodes</h1>
                           
                        </div>
                        <Link href={route('episodes.create')}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="small"
                                className="bg-[#00895f] hover:bg-emerald-700 px-3 py-2 h-10"
                            >
                                Add Episode
                            </Button>
                        </Link>
                    </div>

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

                    {/* Ant Design Table */}
                    <div className="bg-white rounded-lg shadow-sm p-2">
                        <Table
                            columns={columns}
                            dataSource={episodes}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                pageSize: 25,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} episodes`,
                                pageSizeOptions: ['10', '25', '50', '100'],
                            }}                           
                            size="middle"
                            locale={{
                                emptyText: (
                                    <div className="py-12 text-center">
                                        <i className="fa fa-video-camera text-5xl text-gray-300 mb-4"></i>
                                        <p className="text-gray-500 text-lg font-medium">No episodes found</p>
                                        <p className="text-gray-400 text-sm mt-2">Start by creating your first episode</p>
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
