import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Plus, Pencil, Trash2, Search, Edit } from 'lucide-react';
import { Popconfirm } from 'antd';


import { Pagination } from 'antd';
import { Input } from 'antd';
import './marketing-campaign.css';

export default function MarketingCampaignsIndex({ campaigns, filters }) {
    const { data, links, meta } = campaigns;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [loading, setLoading] = useState(false);

    // Filter campaigns based on search term
    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = {
            ...filters,
            search: searchTerm,
            page: 1
        };

        router.get(route('marketing-campaign.index'), queryParams, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (campaignID) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            router.delete(route('marketing-campaign.destroy', campaignID));
        }
    };

    const handleFilterChange = (filterName, value) => {
        const queryParams = {
            ...filters,
            [filterName]: value || undefined,
            page: 1
        };

        router.get(route('marketing-campaign.index'), queryParams, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        router.get(route('marketing-campaign.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const getCampaignReference = (campaign) => {
        // This would be enhanced to show actual reference based on campaign type
        switch (campaign.campaignType) {
            case 'sponseredCME':
                return 'CME Course';
            case 'sponserSeminar':
                return 'Seminar';
            case 'specialitySponsor':
                return 'Speciality';
            case 'sponsoredFaq':
                return 'FAQ';
            case 'sponsoredEpisode':
                return 'Episode';
            default:
                return 'N/A';
        }
    };

    const getCampaignTypeLabel = (type) => {
        const types = {
            'sponseredCME': 'Sponsored CME',
            'sponserSeminar': 'Sponsor Seminar',
            'specialitySponsor': 'Speciality Sponsor',
            'sponsorMedtalks': 'Sponsor Medtalks',
            'sponsoredFaq': 'Sponsored FAQ',
            'sponsoredEpisode': 'Sponsored Episode',
            'none': 'None'
        };
        return types[type] || type;
    };

    const getCampaignMissionLabel = (mission) => {
        const missions = {
            'clicks': 'Clicks',
            'impressions': 'Impressions',
            'subscriptions': 'Subscriptions',
            'followers': 'Followers',
            'interactions': 'Interactions',
            'accessCode': 'Access Code'
        };
        return missions[mission] || mission;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Marketing Campaigns" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage your marketing campaigns
                                    </p>
                                </div>
                                <Link
                                    href={route('marketing-campaign.create')}
                                >
                                    <Button className="mt-4 sm:mt-0">
                                        <Plus className="h-4 w-4" />
                                        Create Campaign
                                    </Button>
                                </Link>
                            </div>

                            {/* Search and Filters */}
                            <div className="mb-6 space-y-4">
                                <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex-grow">
                                        <Input
                                            placeholder="Search campaigns..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            prefix={<Search className="h-4 w-4 text-gray-400" />}
                                        />
                                    </div>
                                    <Button type="submit" className="sm:w-auto">
                                        Search
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="sm:w-auto"
                                    >
                                        Reset
                                    </Button>
                                </form>

                                {/* Additional Filters */}
                                <div className="flex flex-wrap gap-4">
                                    <select
                                        value={filters.campaignType || ''}
                                        onChange={(e) => handleFilterChange('campaignType', e.target.value)}
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">All Campaign Types</option>
                                        <option value="sponseredCME">Sponsored CME</option>
                                        <option value="sponserSeminar">Sponsor Seminar</option>
                                        <option value="specialitySponsor">Speciality Sponsor</option>
                                        <option value="sponsorMedtalks">Sponsor Medtalks</option>
                                        <option value="sponsoredFaq">Sponsored FAQ</option>
                                        <option value="sponsoredEpisode">Sponsored Episode</option>
                                    </select>

                                    <select
                                        value={filters.campaignStatus || ''}
                                        onChange={(e) => handleFilterChange('campaignStatus', e.target.value)}
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="live">Live</option>
                                        <option value="draft">Draft</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
                                        <option value="awaitingModeration">Awaiting Moderation</option>
                                    </select>
                                </div>
                            </div>

                            {/* Campaigns Table */}
                            <div className="rounded-md border campaign-table">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campaign Title</TableHead>
                                            <TableHead>Campaign Type</TableHead>
                                            <TableHead>Campaign Reference</TableHead>


                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <p className="text-gray-500">No campaigns found</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            data.map((campaign) => (
                                                <TableRow key={campaign.campaignID}>
                                                    <TableCell className="font-medium">
                                                        {campaign.campaignTitle}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                            {getCampaignTypeLabel(campaign.campaignType)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getCampaignReference(campaign)}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">

                                                            <Link
                                                                href={route('marketing-campaign.edit', campaign.campaignID)}
                                                                 className="inline-flex items-center rounded-md bg-blue-50 px-2 py-2 text-blue-600 hover:bg-blue-100"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            
                                                            <Popconfirm
                                                                title="Delete Campaign"
                                                                description="Are you sure you want to delete this campaign? This action cannot be undone."
                                                                onConfirm={() => handleDelete(campaign.campaignID)}
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
                            {meta && meta.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <Pagination
                                        current={meta.current_page}
                                        total={meta.total}
                                        pageSize={meta.per_page}
                                        onChange={(page) => {
                                            router.get(route('marketing-campaign.index'), {
                                                ...filters,
                                                page
                                            }, {
                                                preserveState: true,
                                                replace: true
                                            });
                                        }}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}