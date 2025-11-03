import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Select } from 'antd';

export default function PageViews({ type, specId, specialties = [], data = [], pagination = {} }) {
    const { props } = usePage();
    const [localData, setLocalData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(type || 'faq');
    const [selectedSpecId, setSelectedSpecId] = useState(specId || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    
    // Update local data when props.data changes
    useEffect(() => {
        if (props.data) {
            setLocalData(props.data);
        } else if (data) {
            setLocalData(data);
        }
        
        // Update pagination state
        if (props.pagination) {
            setCurrentPage(props.pagination.current_page || 1);
            setPerPage(props.pagination.per_page || 10);
        }
    }, [props.data, data, props.pagination]);
    
    // Ensure specialties is always an array
    const localSpecialties = (props.specialties || specialties || []);
    
    // Get pagination data
    const paginationData = props.pagination || pagination || {};
    const totalPages = paginationData.last_page || Math.ceil((paginationData.total || 0) / perPage);
    
    const fetchData = (page = currentPage, pageSize = perPage) => {
        setLoading(true);
        
        // Build query parameters
        const params = { 
            type: selectedType,
            page: page,
            per_page: pageSize
        };
        if (selectedSpecId) {
            params.spec_id = selectedSpecId;
        }
        
        router.get(route('page-views.data'), params, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                // Data is now in page.props.data
                if (page.props.data) {
                    setLocalData(page.props.data);
                }
                // Update pagination
                if (page.props.pagination) {
                    setCurrentPage(page.props.pagination.current_page || 1);
                    setPerPage(page.props.pagination.per_page || 10);
                }
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };
    
    const handleTypeChange = (value) => {
        setSelectedType(value);
        // Reset spec ID when changing type
        if (value !== 'faq' && value !== 'spec') {
            setSelectedSpecId('');
        }
        // Reset to first page when changing filters
        setCurrentPage(1);
    };
    
    const handleSpecChange = (value) => {
        setSelectedSpecId(value);
        // Reset to first page when changing filters
        setCurrentPage(1);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when submitting new filters
        fetchData(1);
    };
    
    const handleRefresh = () => {
        fetchData();
    };
    
    const handlePageChange = (page) => {
        console.log('Page changed to:', page);
        setCurrentPage(page);
        fetchData(page);
    };
    
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing page size
        fetchData(1, newPerPage);
    };
    
    const pageTitle = () => {
        switch(selectedType) {
            case 'faq': return 'VIEWED FAQS';
            case 'cme': return 'VIEWED CMES';
            case 'seminar': return 'VIEWED WEBINARS';
            case 'episodeafternoon': return 'VIEWED EPISODES (AFTERNOON)';
            case 'episodeevening': return 'VIEWED EPISODES (EVENING)';
            case 'spec': 
                if (!selectedSpecId) {
                    return 'VIEWED SPEC';
                } else {
                    const spec = localSpecialties.find(s => s.no == selectedSpecId);
                    return `VIEWED FAQS FOR ${spec ? spec.title.toUpperCase() : 'SPEC'}`;
                }
            default: return 'PAGE VIEWS ANALYTICS';
        }
    };
    
    // Pagination controls component - updated to show limited page numbers
    const PaginationControls = () => {
        if (!paginationData.total || paginationData.total <= 0) {
            return null;
        }
        
        // Generate page numbers to display with ellipsis
        const getPageNumbers = () => {
            const delta = 2; // Number of pages to show around current page
            const range = [];
            const rangeWithDots = [];
            
            // Always include first page
            rangeWithDots.push(1);
            
            // Calculate range around current page
            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                range.push(i);
            }
            
            // Add ellipsis if needed before range
            if (currentPage - delta > 2) {
                rangeWithDots.push('...');
            }
            
            // Add range
            rangeWithDots.push(...range);
            
            // Add ellipsis if needed after range
            if (currentPage + delta < totalPages - 1) {
                rangeWithDots.push('...');
            }
            
            // Always include last page if there's more than one page
            if (totalPages > 1) {
                rangeWithDots.push(totalPages);
            }
            
            return rangeWithDots;
        };
        
        return (
            <div className="flex items-center justify-between border-t px-6 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {paginationData.from || ((currentPage - 1) * perPage + 1)} to {paginationData.to || Math.min(currentPage * perPage, paginationData.total)} of {paginationData.total || 0} results
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="px-3 py-1 text-gray-500">...</span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className={currentPage === page ? "w-8 h-8 p-0" : "w-8 h-8 p-0"}
                                    >
                                        {page}
                                    </Button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    };
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Page Views Analytics
                </h2>
            }
        >
            <Head title="Page Views Analytics" />
            
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{pageTitle().toUpperCase()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Filter Section */}
                            <div className="mb-6 border-b border-gray-200 pb-6">
                                <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Content Type
                                        </label>
                                        <Select value={selectedType} onChange={handleTypeChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 h-9"
                                            options={[
                                                { value: '', label: '--SELECT--' },
                                                { value: 'faq', label: 'FAQ' },
                                                { value: 'cme', label: 'CME' },
                                                { value: 'seminar', label: 'WEBINAR' },
                                                { value: 'episodeevening', label: 'CHAT WITH DR KK AGARWAL 7PM SHOW' },
                                                { value: 'spec', label: 'SPEC' },
                                            ]}
                                            >
                                        </Select>
                                    </div>
                                    
                                    {/* Specialty filter for FAQ and SPEC types */}
                                    {(selectedType === 'faq' || selectedType === 'spec') && (
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Specialty
                                            </label>
                                            <Select value={selectedSpecId} onChange={handleSpecChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 h-9"
                                                options={[
                                                    { value: '', label: '--SELECT--' },
                                                    ...localSpecialties.map((spec) => ({
                                                        value: spec.no,
                                                        label: spec.title,
                                                    })),
                                                ]}
                                                >
                                            </Select>
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-2">
                                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1">
                                            Submit
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={handleRefresh}
                                            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                        >
                                            Refresh
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            
                            {/* Per page selector - added to match Seminars implementation */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {paginationData.from || ((currentPage - 1) * perPage + 1)} to {paginationData.to || Math.min(currentPage * perPage, paginationData.total)} of {paginationData.total || 0} results
                                </div>
                                <div className="flex items-center">
                                    <label htmlFor="per-page" className="mr-2 text-sm text-muted-foreground">
                                        Per page:
                                    </label>
                                    <select
                                        id="per-page"
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Data Table */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-sm font-medium">Sr. No.</TableHead>
                                            <TableHead className="text-sm font-medium">Title</TableHead>
                                            <TableHead className="text-sm font-medium">Custom Url</TableHead>
                                            <TableHead className="text-sm font-medium">Date Time</TableHead>
                                            <TableHead className="text-sm font-medium">View Count</TableHead>
                                            <TableHead className="text-sm font-medium">View Count Details</TableHead>
                                            <TableHead className="text-sm font-medium">Subscribe Count</TableHead>
                                            {selectedType === 'spec' && !selectedSpecId && (
                                                <TableHead className="text-sm font-medium">Article View</TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={selectedType === 'spec' && !selectedSpecId ? 8 : 7} className="text-center py-8">
                                                    <div className="flex items-center justify-center">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
                                                        <span className="ml-3 text-gray-500">Loading...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : localData && localData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={selectedType === 'spec' && !selectedSpecId ? 8 : 7} className="text-center py-8 text-gray-500">
                                                    No data available
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            localData && localData.map((item, index) => (
                                                <TableRow key={item.id || index} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium">
                                                        {paginationData.from ? paginationData.from + index : index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.title}</TableCell>
                                                    <TableCell>
                                                        <a 
                                                            href={item.custom_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-emerald-600 hover:text-emerald-800 hover:underline"
                                                        >
                                                            {item.custom_url}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>{item.date_time}</TableCell>
                                                    <TableCell>{item.view_count_web}</TableCell>
                                                    <TableCell>{item.utm_details || '-'}</TableCell>
                                                    <TableCell>{item.subscribe_count}</TableCell>
                                                    {selectedType === 'spec' && !selectedSpecId && (
                                                        <TableCell>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedType('spec');
                                                                    setSelectedSpecId(item.id);
                                                                    setCurrentPage(1);
                                                                    fetchData(1);
                                                                }}
                                                                className="text-emerald-600 hover:text-emerald-800 hover:underline"
                                                            >
                                                                View
                                                            </button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {/* Pagination Controls */}
                            <PaginationControls />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}