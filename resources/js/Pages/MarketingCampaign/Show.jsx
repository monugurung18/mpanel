import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MarketingCampaignShow({ campaign }) {
    return (
        <AuthenticatedLayout>
            <Head title="Marketing Campaign Details" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Campaign Details: {campaign.campaignTitle}</h2>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('marketing-campaign.edit', campaign.campaignID)}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('marketing-campaign.index')}
                                        className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                    >
                                        Back to Campaigns
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Campaign ID</label>
                                            <p className="mt-1">{campaign.campaignID}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Campaign Title</label>
                                            <p className="mt-1">{campaign.campaignTitle}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Campaign Type</label>
                                            <p className="mt-1">{campaign.campaignType}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Campaign Mission</label>
                                            <p className="mt-1">{campaign.campaignMission}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Campaign Status</label>
                                            <p className="mt-1">{campaign.campaignStatus}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Target ID</label>
                                            <p className="mt-1">{campaign.campaignTargetID}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Views</label>
                                            <p className="mt-1">{campaign.campaignViews}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Subscriptions</label>
                                            <p className="mt-1">{campaign.campaignSubscritions}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Secret Code</label>
                                            <p className="mt-1">{campaign.camapignSecretCode || 'N/A'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Access Locked</label>
                                            <p className="mt-1">{campaign.lockAccess}</p>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold mt-6 mb-4">Dates</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Start Time</label>
                                            <p className="mt-1">{new Date(campaign.campaignStartTime).toLocaleString()}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">End Time</label>
                                            <p className="mt-1">{campaign.campaignEndTime}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                            <p className="mt-1">{new Date(campaign.lastupdated).toLocaleString()}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Created</label>
                                            <p className="mt-1">{new Date(campaign.created_on).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Banner Images</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {campaign.marketingBannerSquare && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Square Banner</label>
                                            <div className="mt-2">
                                                <img 
                                                    src={`/uploads/marketing-campaign/${campaign.marketingBannerSquare}`} 
                                                    alt="Square Banner" 
                                                    className="max-w-full h-auto rounded border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {campaign.marketingBannerRectangle && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Rectangle Banner</label>
                                            <div className="mt-2">
                                                <img 
                                                    src={`/uploads/marketing-campaign/${campaign.marketingBannerRectangle}`} 
                                                    alt="Rectangle Banner" 
                                                    className="max-w-full h-auto rounded border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {campaign.marketingBanner1 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Banner 1</label>
                                            <div className="mt-2">
                                                <img 
                                                    src={`/uploads/marketing-campaign/${campaign.marketingBanner1}`} 
                                                    alt="Banner 1" 
                                                    className="max-w-full h-auto rounded border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {campaign.marketingBanner2 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Banner 2</label>
                                            <div className="mt-2">
                                                <img 
                                                    src={`/uploads/marketing-campaign/${campaign.marketingBanner2}`} 
                                                    alt="Banner 2" 
                                                    className="max-w-full h-auto rounded border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {campaign.marketingBanner3 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Banner 3</label>
                                            <div className="mt-2">
                                                <img 
                                                    src={`/uploads/marketing-campaign/${campaign.marketingBanner3}`} 
                                                    alt="Banner 3" 
                                                    className="max-w-full h-auto rounded border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}