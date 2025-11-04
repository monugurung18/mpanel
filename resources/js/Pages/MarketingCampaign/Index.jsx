import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import { Plus, Pencil, Trash2, Search, Edit } from 'lucide-react';
import { Popconfirm } from 'antd';
import { Pagination } from 'antd';
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
        // Display the actual target title if available, otherwise fallback to generic reference
        if (campaign.targetTitle) {
            return campaign.targetTitle;
        }
        
        // Fallback to generic reference based on campaign type
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
                    <Card className="shadow-sm">
                        <CardHeader className="border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Marketing Campaigns</CardTitle>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage your marketing campaigns
                                    </p>
                                </div>
                                <Link
                                    href={route('marketing-campaign.create')}
                                >
                                    <Button className="mt-4 sm:mt-0">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Campaign
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Search and Filters */}
                            <div className="mb-6 space-y-4 flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    {meta && (
                                        <>Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} campaigns</>
                                    )}
                                </div>
                                <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row max-w-md w-full">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search campaigns..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="sm:w-auto text-xs py-2">
                                        Search
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="sm:w-auto py-2"
                                    >
                                        Reset
                                    </Button>
                                </form>                              
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
                                                <TableCell colSpan={4} className="text-center py-8">
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
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-4 mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} campaigns
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (meta.current_page > 1) {
                                                    router.get(route('marketing-campaign.index'), {
                                                        ...filters,
                                                        page: meta.current_page - 1
                                                    }, {
                                                        preserveState: true,
                                                        replace: true
                                                    });
                                                }
                                            }}
                                            disabled={meta.current_page === 1}
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                                                let pageNum;
                                                if (meta.last_page <= 5) {
                                                    pageNum = i + 1;
                                                } else if (meta.current_page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (meta.current_page >= meta.last_page - 2) {
                                                    pageNum = meta.last_page - 4 + i;
                                                } else {
                                                    pageNum = meta.current_page - 2 + i;
                                                }

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={meta.current_page === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            router.get(route('marketing-campaign.index'), {
                                                                ...filters,
                                                                page: pageNum
                                                            }, {
                                                                preserveState: true,
                                                                replace: true
                                                            });
                                                        }}
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
                                            onClick={() => {
                                                if (meta.current_page < meta.last_page) {
                                                    router.get(route('marketing-campaign.index'), {
                                                        ...filters,
                                                        page: meta.current_page + 1
                                                    }, {
                                                        preserveState: true,
                                                        replace: true
                                                    });
                                                }
                                            }}
                                            disabled={meta.current_page === meta.last_page}
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