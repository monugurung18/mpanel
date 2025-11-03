import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Popconfirm } from 'antd';
import { CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import 'antd/dist/reset.css';

export default function CertificateVerificationIndex() {
    const { users, filter, pagination } = usePage().props;
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [certificateImage, setCertificateImage] = useState('');
    const [currentFilter, setCurrentFilter] = useState(filter || 'unverified');
    const [currentPage, setCurrentPage] = useState(pagination?.current_page || 1);
    const [perPage, setPerPage] = useState(pagination?.per_page || 10);

    // Update filter and pagination when they change
    useEffect(() => {
        setCurrentFilter(filter || 'unverified');
        setCurrentPage(pagination?.current_page || 1);
        setPerPage(pagination?.per_page || 10);
        // Close modal when navigating to a different page
        if (isModalOpen) {
            setIsModalOpen(false);
        }
    }, [filter, pagination, isModalOpen]);

    const handleFilterChange = (value) => {
        setCurrentFilter(value);
        setCurrentPage(1); // Reset to first page when filter changes
        setIsModalOpen(false); // Close modal when changing filter
        router.get(route('certificate-verification.index'), { 
            filter: value,
            page: 1,
            per_page: perPage
        });
    };

    const openCertificateModal = (imageUrl) => {
        setCertificateImage(`https://www.medtalks.in/uploads/reg_certificate/${imageUrl}`);
        setIsModalOpen(true);
    };

    const closeCertificateModal = () => {
        setIsModalOpen(false);
        setCertificateImage('');
    };

    const updateCertificateStatus = (userId, type) => {
        router.post(route('certificate-verification.update-status'), {
            uid: userId,
            type: type
        }, {
            onSuccess: () => {
                // Reload the page with current pagination and filter settings
                router.get(route('certificate-verification.index'), {
                    filter: currentFilter,
                    page: currentPage,
                    per_page: perPage
                });
            }
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setIsModalOpen(false); // Close modal when changing pages
        router.get(route('certificate-verification.index'), {
            filter: currentFilter,
            page: page,
            per_page: perPage
        });
    };

    const handlePerPageChange = (value) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing per page
        setIsModalOpen(false); // Close modal when changing per page
        router.get(route('certificate-verification.index'), {
            filter: currentFilter,
            page: 1,
            per_page: newPerPage
        });
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const totalPages = pagination?.last_page || 1;
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust startPage if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pageNumbers.push(
                <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className="h-8 w-8 p-0"
                >
                    1
                </Button>
            );
            
            if (startPage > 2) {
                pageNumbers.push(
                    <span key="start-ellipsis" className="px-2 text-muted-foreground">...</span>
                );
            }
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className="h-8 w-8 p-0"
                >
                    {i}
                </Button>
            );
        }
        
        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(
                    <span key="end-ellipsis" className="px-2 text-muted-foreground">...</span>
                );
            }
            
            pageNumbers.push(
                <Button
                    key={totalPages}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="h-8 w-8 p-0"
                >
                    {totalPages}
                </Button>
            );
        }
        
        return pageNumbers;
    };

    const getStatusBadge = (status) => {
        const statusClass = {
            'verified': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'unverified': 'bg-yellow-100 text-yellow-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Certificate Verification" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <Card className="mb-6 border-0 shadow-lg">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        User Certificate Verification
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Verify or reject user medical registration certificates
                                    </CardDescription>
                                </div>
                                <div className="w-48">
                                    <Select value={currentFilter} onValueChange={handleFilterChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unverified">Unverified</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Mobile</TableHead>
                                            <TableHead>Medical Reg No</TableHead>
                                            <TableHead>Medical Council</TableHead>
                                            <TableHead>Specialty</TableHead>
                                            <TableHead>Certificate Image</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users && users.length > 0 ? (
                                            users.map((user) => (
                                                <TableRow key={user.u_id}>
                                                    <TableCell className="font-medium">
                                                        {user.ft} {user.funame}
                                                    </TableCell>
                                                    <TableCell>{user.ue}</TableCell>
                                                    <TableCell>{user.fp}</TableCell>
                                                    <TableCell>{user.mregno}</TableCell>
                                                    <TableCell>{user.mb}</TableCell>
                                                    <TableCell>{user.ut}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openCertificateModal(user.fr)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(user.isVerifiedCertificate)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            {user.isVerifiedCertificate === 'unverified' && (
                                                                <>
                                                                    <Popconfirm
                                                                        title="Verify Certificate"
                                                                        description={`Are you sure you want to verify this certificate for ${user.ft} ${user.funame}?`}
                                                                        onConfirm={() => updateCertificateStatus(user.u_id, 'verified')}
                                                                        okText="Yes, Verify"
                                                                        cancelText="No, Cancel"
                                                                        placement="top"
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-green-600 hover:text-green-800 hover:bg-green-50 cursor-pointer"
                                                                        >
                                                                            <CheckCircle className="h-5 w-5" />
                                                                        </Button>
                                                                    </Popconfirm>
                                                                    <Popconfirm
                                                                        title="Reject Certificate"
                                                                        description={`Are you sure you want to reject this certificate for ${user.ft} ${user.funame}?`}
                                                                        onConfirm={() => updateCertificateStatus(user.u_id, 'rejected')}
                                                                        okText="Yes, Reject"
                                                                        cancelText="No, Cancel"
                                                                        placement="top"
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                                                                        >
                                                                            <XCircle className="h-5 w-5" />
                                                                        </Button>
                                                                    </Popconfirm>
                                                                </>
                                                            )}
                                                            {user.isVerifiedCertificate === 'verified' && (
                                                                <span className="text-green-600 text-sm">Verified</span>
                                                            )}
                                                            {user.isVerifiedCertificate === 'rejected' && (
                                                                <span className="text-red-600 text-sm">Rejected</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-24 text-center">
                                                    No users found with uploaded certificates.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="flex items-center justify-between border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, pagination.total)} of {pagination.total} users
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(1)}
                                                disabled={currentPage === 1}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                                <span className="sr-only">Go to first page</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="sr-only">Go to previous page</span>
                                            </Button>
                                            
                                            {renderPageNumbers()}
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === pagination.last_page}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="sr-only">Go to next page</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(pagination.last_page)}
                                                disabled={currentPage === pagination.last_page}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                                <span className="sr-only">Go to last page</span>
                                            </Button>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                                                <SelectTrigger className="h-8 w-[70px]">
                                                    <SelectValue placeholder={perPage} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="25">25</SelectItem>
                                                    <SelectItem value="50">50</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <span className="text-sm text-muted-foreground">per page</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Certificate Preview Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Certificate Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        {certificateImage && (
                            <img 
                                src={certificateImage} 
                                alt="Certificate" 
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                        )}
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={closeCertificateModal}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}