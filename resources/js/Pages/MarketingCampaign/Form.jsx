import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Select, Upload } from 'antd';
import { Button } from '@/Components/ui/button';
import { UploadOutlined } from '@ant-design/icons';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import './marketing-campaign.css';

export default function MarketingCampaignForm({
    businesses = [],
    business,
    campaign,
    courses = [],
    seminars = [],
    specialities = [],
    faqs = [],
    episodes = []
}) {

    const isEditing = !!campaign;
    const hasBusinesses = businesses && businesses.length > 0;

    // State for image previews
    const [squareBannerPreview, setSquareBannerPreview] = useState(
        campaign?.marketingBannerSquare ? `/uploads/marketing-campaign/${campaign.marketingBannerSquare}` : null
    );
    const [rectangleBannerPreview, setRectangleBannerPreview] = useState(
        campaign?.marketingBannerRectangle ? `/uploads/marketing-campaign/${campaign.marketingBannerRectangle}` : null
    );
    const [banner1Preview, setBanner1Preview] = useState(
        campaign?.marketingBanner1 ? `/uploads/marketing-campaign/${campaign.marketingBanner1}` : null
    );
    const [banner2Preview, setBanner2Preview] = useState(
        campaign?.marketingBanner2 ? `/uploads/marketing-campaign/${campaign.marketingBanner2}` : null
    );
    const [banner3Preview, setBanner3Preview] = useState(
        campaign?.marketingBanner3 ? `/uploads/marketing-campaign/${campaign.marketingBanner3}` : null
    );

    // State for dynamic campaign targets
    const [campaignTargets, setCampaignTargets] = useState([]);
    const [loadingTargets, setLoadingTargets] = useState(false);

    const { data, setData, post, put, errors, processing } = useForm({
        campaignID: campaign?.campaignID || '',
        businessID: campaign?.businessID || '',
        businessname: campaign?.business_Name || '',
        campaigntitle: campaign?.campaignTitle || '',
        campaign_type: campaign?.campaignType || 'none',
        campaignTargetID: campaign?.campaignTargetID || '',
        campaignmission: campaign?.campaignMission || 'interactions',
        promotionTimeSettings: campaign?.promotionTimeSettings || 'none',
        campaignStartTime: campaign?.campaignStartTime || '',
        campaignEndTime: campaign?.campaignEndTime || '',
        image: null,
        image1: null,
        image3: null,
        image4: null,
        image5: null,
        imagename: campaign?.marketingBannerSquare || '',
        image1name: campaign?.marketingBannerRectangle || '',
        image3name: campaign?.marketingBanner1 || '',
        image4name: campaign?.marketingBanner2 || '',
        image5name: campaign?.marketingBanner3 || '',
    });

    // Fetch campaign targets when campaign type changes
    useEffect(() => {
        if (!isEditing && data.campaign_type) {
            fetchCampaignTargets(data.campaign_type);
        }
    }, [data.campaign_type, isEditing]);

    // Handle business selection
    const handleBusinessChange = (value) => {
        const selectedBusiness = businesses.find(b => b.businessID == value);
        if (selectedBusiness) {
            setData({
                ...data,
                businessID: selectedBusiness.businessID,
                businessname: selectedBusiness.business_Name
            });
        }
    };

    // Handle campaign type change
    const handleCampaignTypeChange = (value) => {
        setData({
            ...data,
            campaign_type: value,
            campaignTargetID: '' // Reset target when type changes
        });
        fetchCampaignTargets(value)
    };

    // Fetch campaign targets based on campaign type
    const fetchCampaignTargets = async (campaignType) => {
        // Map form campaign types to API campaign types
        let apiCampaignType = '';
        switch (campaignType) {
            case 'sponseredCME':
                apiCampaignType = 'cme';
                break;
            case 'sponserSeminar':
                apiCampaignType = 'seminar';
                break;
            case 'sponsoredEpisode':
                apiCampaignType = 'episode';
                break;
            // For other campaign types that don't need API fetching, we'll use the props data
            case 'specialitySponsor':
            case 'sponsorMedtalks':
            case 'sponsoredFaq':
            default:
                setCampaignTargets([]);
                return;
        }

        setLoadingTargets(true);
        try {
            const response = await fetch(route('api.marketing-campaign-targets', { campaign_type: apiCampaignType }));
            const targets = await response.json();

            setCampaignTargets(targets);
            console.log(targets)
        } catch (error) {
            console.error('Error fetching campaign targets:', error);
            setCampaignTargets([]);
        } finally {
            setLoadingTargets(false);
        }
    };

    // Handle image change with preview
    const handleImageChange = (e, field, previewSetter, nameField) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Only JPG, JPEG, or PNG files are allowed.');
            e.target.value = '';
            return;
        }

        // Validate file size (1MB max)
        if (file.size > 1 * 1024 * 1024) {
            alert('File size must be less than 1MB.');
            e.target.value = '';
            return;
        }

        // Set the file in form data
        setData(field, file);
        setData(nameField, file.name);

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            previewSetter(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Remove image
    const removeImage = (field, previewSetter, nameField) => {
        setData(field, null);
        setData(nameField, '');
        previewSetter(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate that a business is selected when creating
        if (!isEditing && !data.businessID) {
            alert('Please select a business before creating a campaign.');
            return;
        }

        const formData = new FormData();

        // Append all form data
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        if (isEditing) {
            post(route('marketing-campaigns.updates', campaign.campaignID), {
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            post(route('marketing-campaign.store'), {
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
    };

    // Filter options based on campaign type
    const getCampaignTargetOptions = () => {
        // For editing mode, use the passed props
        if (isEditing) {
            switch (data.campaign_type) {
                case 'sponseredCME':
                    return courses.map(course => ({
                        value: course.course_id,
                        label: course.course_title
                    }));
                case 'sponserSeminar':
                    return seminars.map(seminar => ({
                        value: seminar.seminar_no,
                        label: seminar.seminar_title
                    }));
                case 'specialitySponsor':
                    return specialities.map(speciality => ({
                        value: speciality.no,
                        label: speciality.title
                    }));
                case 'sponsoredFaq':
                    return faqs.map(faq => ({
                        value: faq.articleID,
                        label: faq.title
                    }));
                case 'sponsoredEpisode':
                    return episodes.map(episode => ({
                        value: episode.id,
                        label: episode.title
                    }));
                default:
                    return [];
            }
        }

        // For create mode, use dynamically fetched targets for API-supported types
        switch (data.campaign_type) {
            case 'sponseredCME':
            case 'sponserSeminar':
            case 'sponsoredEpisode':
                return campaignTargets.map(target => ({
                    value: target.id,
                    label: target.title
                }));
            // For other types, use the props data (these should be passed in even in create mode)
            case 'specialitySponsor':
                return specialities.map(speciality => ({
                    value: speciality.no,
                    label: speciality.title
                }));
            case 'sponsoredFaq':
                return faqs.map(faq => ({
                    value: faq.articleID,
                    label: faq.title
                }));
            default:
                return [];
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Marketing Campaign' : 'Add Marketing Campaign'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {isEditing ? 'Edit Marketing Campaign' : 'Add Marketing Campaign'}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {isEditing
                                            ? 'Update the details of your marketing campaign'
                                            : 'Create a new marketing campaign'}
                                    </p>
                                </div>
                                <Link
                                    href={route('marketing-campaign.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Campaigns
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">



                                {/* Campaign Details Card */}

                                <Card>

                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4 pt-6">
                                            <div>
                                                <InputLabel htmlFor="business_selection" value="Business *" />
                                                <Select
                                                    id="business_selection"
                                                    placeholder="Select a business"
                                                    value={data.businessID}
                                                    options={business.map(b => ({
                                                        value: b.businessID,
                                                        label: b.business_Name
                                                    }))}
                                                    onChange={handleBusinessChange}
                                                    className='w-full mt-1 h-[36px]'
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                />

                                            </div>
                                            <div>
                                                <InputLabel htmlFor="business_name" value="Business Name" />
                                                <Input
                                                    id="business_name"
                                                    type="text"
                                                    value={data.businessname}
                                                    readOnly
                                                    className="bg-gray-100 py-1.5"
                                                />
                                                <input type="hidden" name="businessID" value={data.businessID} />
                                                {errors.businessname && <InputError message={errors.businessname} />}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <InputLabel htmlFor="campaign_title" value="Campaign Title *" />
                                                <Input
                                                    id="campaign_title"
                                                    type="text"
                                                    value={data.campaigntitle}
                                                    onChange={(e) => setData('campaigntitle', e.target.value)}
                                                    placeholder="Enter campaign title"
                                                    className="py-1.5"
                                                    required
                                                />
                                                {errors.campaigntitle && <InputError message={errors.campaigntitle} />}
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="campaign_type" value="Campaign Type *" />
                                                <Select
                                                    options={[
                                                        { value: 'none', label: 'Choose one' },
                                                        { value: 'sponseredCME', label: 'Sponsored CME' },
                                                        { value: 'sponserSeminar', label: 'Sponsor Seminar' },
                                                        { value: 'specialitySponsor', label: 'Speciality Sponsor' },
                                                        { value: 'sponsorMedtalks', label: 'Sponsor Medtalks' },
                                                        { value: 'sponsoredFaq', label: 'Sponsored FAQ' },
                                                        { value: 'sponsoredEpisode', label: 'Sponsored Episode' }
                                                    ]}
                                                    value={data.campaign_type}
                                                    onChange={handleCampaignTypeChange}
                                                    placeholder="Select campaign type"
                                                    className='w-full mt-1 h-[36px]'
                                                    required
                                                />
                                                {errors.campaign_type && <InputError message={errors.campaign_type} />}
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="campaignTargetID" value="Campaign Target *" />
                                                <Select
                                                    id="campaignTargetID"
                                                    value={data.campaignTargetID}
                                                    onChange={(value) => setData('campaignTargetID', value)}
                                                    options={campaignTargets.map(target => ({
                                                        value: target.id,
                                                        label: target.title
                                                    }))}
                                                    placeholder="Select campaign target"
                                                    showSearch
                                                    loading={loadingTargets}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    className='w-full mt-1 h-[36px]'
                                                    required
                                                />
                                                {errors.campaignTargetID && <InputError message={errors.campaignTargetID} />}
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="campaign_mission" value="Campaign Mission *" />
                                                <Select options={[
                                                    { value: 'clicks', label: 'Clicks' },
                                                    { value: 'impressions', label: 'Impressions' },
                                                    { value: 'subscriptions', label: 'Subscriptions' },
                                                    { value: 'followers', label: 'Followers' },
                                                    { value: 'interactions', label: 'Interactions' },
                                                    { value: 'accessCode', label: 'Access Code' }
                                                ]}

                                                    value={data.campaignmission}
                                                    onChange={(value) => setData('campaignmission', value)}
                                                    placeholder="Select campaign mission"
                                                    className='w-full mt-1 h-[36px]'
                                                    required
                                                />
                                                {errors.campaignmission && <InputError message={errors.campaignmission} />}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>


                                {/* Banner Images Card */}
                                {(business || data.businessID) && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Banner Images</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                Upload banner images for your campaign. Supported formats: JPG, JPEG, PNG (max 1MB each)
                                            </p>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            {/* Square and Rectangle Banners */}
                                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                                {/* Square Banner */}
                                                <div>
                                                    <InputLabel value="Square Banner Image" />
                                                    <Upload
                                                        name="image"
                                                        beforeUpload={(file) => {
                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
                                                            if (!isValidType) {
                                                                alert('Only JPG, JPEG, or PNG files are allowed.');
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                alert('File size must be less than 1MB.');
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Update form data
                                                            setData('image', file);
                                                            setData('imagename', file.name);

                                                            // Create preview
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                setSquareBannerPreview(event.target.result);
                                                            };
                                                            reader.readAsDataURL(file);

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('image', null);
                                                            setData('imagename', '');
                                                            setSquareBannerPreview(null);
                                                        }}
                                                        fileList={data.image ? [{
                                                            uid: '-1',
                                                            name: data.imagename,
                                                            status: 'done',
                                                            url: squareBannerPreview,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!squareBannerPreview ? (<>
                                                            <div class="flex items-center justify-between border rounded-lg p-2 bg-white shadow-sm w-full max-w-md mt-2  cursor-pointer">
                                                                <div class="flex items-center space-x-3">
                                                                    <button type='button' class="text-gray-400 hover:text-red-500 bg-gray-300 p-4 rounded-md">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                        </svg>

                                                                    </button>
                                                                    <div>
                                                                        <p><span class="text-sm text-gray-700 font-medium truncate">Upload Square Banner</span></p>
                                                                        <p className='text-xs text-gray-400'>Supported formats: JPG, JPEG, PNG (max 1MB each)</p>
                                                                    </div>                                                                    
                                                                </div>
                                                            </div>
                                                           
                                                        </>

                                                        ) : null}
                                                    </Upload>
                                                    {errors.image && <InputError message={errors.image} />}
                                                </div>

                                                {/* Rectangle Banner */}
                                                <div>
                                                    <InputLabel value="Rectangle Banner Image" />
                                                    <Upload
                                                        name="image1"
                                                        beforeUpload={(file) => {
                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
                                                            if (!isValidType) {
                                                                alert('Only JPG, JPEG, or PNG files are allowed.');
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                alert('File size must be less than 1MB.');
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Update form data
                                                            setData('image1', file);
                                                            setData('image1name', file.name);

                                                            // Create preview
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                setRectangleBannerPreview(event.target.result);
                                                            };
                                                            reader.readAsDataURL(file);

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('image1', null);
                                                            setData('image1name', '');
                                                            setRectangleBannerPreview(null);
                                                        }}
                                                        fileList={data.image1 ? [{
                                                            uid: '-1',
                                                            name: data.image1name,
                                                            status: 'done',
                                                            url: rectangleBannerPreview,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!rectangleBannerPreview ? (<>
                                                        <div class="flex items-center justify-between border rounded-lg p-2 bg-white shadow-sm w-full max-w-md mt-2 cursor-pointer">
                                                                <div class="flex items-center space-x-3">
                                                                    <button type='button' class="text-gray-400 hover:text-red-500 bg-gray-300 p-4 rounded-md">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                        </svg>

                                                                    </button>
                                                                    <div>
                                                                        <p><span class="text-sm text-gray-700 font-medium truncate">Upload Rectangle Banner</span></p>
                                                                        <p className='text-xs text-gray-400'>Supported formats: JPG, JPEG, PNG (max 1MB each)</p>
                                                                    </div>                                                                    
                                                                </div>
                                                            </div></>
                                                        ) : null}
                                                    </Upload>
                                                    {errors.image1 && <InputError message={errors.image1} />}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Actions */}
                                {(business || data.businessID) && (
                                    <div className="flex items-center justify-between gap-4">
                                        <Link
                                            href={route('marketing-campaign.index')}
                                        >
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <PrimaryButton
                                            processing={processing}
                                            className="px-6 py-2"
                                        >
                                            Save
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                        </PrimaryButton>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}