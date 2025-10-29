import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {  message, Popconfirm } from 'antd';
import { Plus, Film, Pencil, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function MarketingCampaignsIndex({ campaigns }) {
    const { auth } = usePage().props;
    
    const columns = [
        {
            header: 'ID',
            accessorKey: 'campaignID',
        },
        {
            header: 'Title',
            accessorKey: 'campaignTitle',
        },
        {
            header: 'Type',
            accessorKey: 'campaignType',
        },
        {
            header: 'Status',
            accessorKey: 'campaignStatus',
        },
        {
            header: 'Created',
            accessorKey: 'created_on',
            cell: ({ row }) => new Date(row.original.created_on).toLocaleDateString(),
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link
                        href={route('marketing-campaign.edit', row.original.campaignID)}
                        className="text-blue-600 hover:text-blue-900"
                    >
                        Edit
                    </Link>
                    <Link
                        href={route('marketing-campaign.show', row.original.campaignID)}
                        className="text-green-600 hover:text-green-900"
                    >
                        View
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Marketing Campaigns" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Marketing Campaigns</h2>
                                <Link
                                    href={route('marketing-campaign.create')}
                                    
                                >
                                     <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Campaign
                                    </Button>
                                    
                                </Link>
                            </div>

                            <Table
                                data={campaigns}
                                columns={columns}
                                searchableColumns={['campaignTitle', 'campaignType']}
                                filterableColumns={[
                                    {
                                        column: 'campaignStatus',
                                        title: 'Status',
                                        options: [
                                            { label: 'Live', value: 'live' },
                                            { label: 'Draft', value: 'draft' },
                                            { label: 'Suspended', value: 'suspended' },
                                            { label: 'Completed', value: 'completed' },
                                            { label: 'Archived', value: 'archived' },
                                            { label: 'Awaiting Moderation', value: 'awaitingModeration' },
                                        ],
                                    },
                                    {
                                        column: 'campaignType',
                                        title: 'Type',
                                        options: [
                                            { label: 'Sponsored CME', value: 'sponseredCME' },
                                            { label: 'Sponsor Seminar', value: 'sponserSeminar' },
                                            { label: 'Speciality Sponsor', value: 'specialitySponsor' },
                                            { label: 'Sponsor Medtalks', value: 'sponsorMedtalks' },
                                            { label: 'Sponsored FAQ', value: 'sponsoredFaq' },
                                            { label: 'Sponsored Episode', value: 'sponsoredEpisode' },
                                        ],
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}