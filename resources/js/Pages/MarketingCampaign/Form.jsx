import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Select } from 'antd';

export default function MarketingCampaignForm({ 
    business, 
    campaign, 
    courses = [], 
    seminars = [], 
    specialities = [], 
    faqs = [],
    episodes = []
}) {
    const isEditing = !!campaign;
    
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

    const { data, setData, post, put, errors, processing } = useForm({
        campaignID: campaign?.campaignID || '',
        businessID: business?.businessID || '',
        businessname: business?.business_Name || '',
        campaigntitle: campaign?.campaignTitle || '',
        campaign_type: campaign?.campaignType || 'none',
        campaignTargetID: campaign?.campaignTargetID || '',
        campaignmission: campaign?.campaignMission || 'interactions',
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

    // Handle campaign type change
    const handleCampaignTypeChange = (value) => {
        setData({
            ...data,
            campaign_type: value,
            campaignTargetID: '' // Reset target when type changes
        });
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
        
        const formData = new FormData();
        
        // Append all form data
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        if (isEditing) {
            put(route('marketing-campaign.update', campaign.campaignID), {
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
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Marketing Campaign' : 'Add Marketing Campaign'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold">
                                    {isEditing ? 'EDIT MARKETING CAMPAIGN' : 'ADD NEW MARKETING CAMPAIGN'}
                                </h4>
                                <Link
                                    href={route('marketing-campaign.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Campaigns
                                </Link>
                            </div>

                            <hr className="my-4" />

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Business Information */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="business_name" value="Business Name" />
                                        <Input
                                            id="business_name"
                                            type="text"
                                            value={data.businessname}
                                            readOnly
                                            className="bg-gray-100"
                                        />
                                        <input type="hidden" name="businessID" value={data.businessID} />
                                        {errors.businessname && <InputError message={errors.businessname} />}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="campaign_title" value="Campaign Title *" />
                                        <Input
                                            id="campaign_title"
                                            type="text"
                                            value={data.campaigntitle}
                                            onChange={(e) => setData('campaigntitle', e.target.value)}
                                            placeholder="Enter campaign title"
                                        />
                                        {errors.campaigntitle && <InputError message={errors.campaigntitle} />}
                                    </div>
                                </div>

                                {/* Campaign Type */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="campaign_type" value="Campaign Type *" />
                                        <Dropdown
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
                                        />
                                        {errors.campaign_type && <InputError message={errors.campaign_type} />}
                                    </div>

                                    {/* Campaign Target */}
                                    <div>
                                        <InputLabel htmlFor="campaignTargetID" value="Campaign Target *" />
                                        <Select
                                            id="campaignTargetID"
                                            value={data.campaignTargetID}
                                            onChange={(value) => setData('campaignTargetID', value)}
                                            options={getCampaignTargetOptions()}
                                            placeholder="Select campaign target"
                                            className="w-full"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        />
                                        {errors.campaignTargetID && <InputError message={errors.campaignTargetID} />}
                                    </div>
                                </div>

                                {/* Campaign Mission */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="campaign_mission" value="Campaign Mission *" />
                                        <Dropdown
                                            options={[
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
                                        />
                                        {errors.campaignmission && <InputError message={errors.campaignmission} />}
                                    </div>
                                </div>

                                {/* Banner Images */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Banner Images</h3>
                                    <hr className="my-4" />

                                    {/* Square Banner */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <InputLabel value="Square Banner Image" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!squareBannerPreview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Square Banner Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, JPEG, or PNG files only
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".jpg,.jpeg,.png"
                                                                onChange={(e) => handleImageChange(e, 'image', setSquareBannerPreview, 'imagename')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={squareBannerPreview}
                                                            alt="Square Banner Preview"
                                                            className="mx-auto max-h-48 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage('image', setSquareBannerPreview, 'imagename')}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.image && <InputError message={errors.image} />}
                                        </div>

                                        {/* Rectangle Banner */}
                                        <div>
                                            <InputLabel value="Rectangle Banner Image" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!rectangleBannerPreview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Rectangle Banner Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, JPEG, or PNG files only
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".jpg,.jpeg,.png"
                                                                onChange={(e) => handleImageChange(e, 'image1', setRectangleBannerPreview, 'image1name')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={rectangleBannerPreview}
                                                            alt="Rectangle Banner Preview"
                                                            className="mx-auto max-h-48 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage('image1', setRectangleBannerPreview, 'image1name')}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.image1 && <InputError message={errors.image1} />}
                                        </div>
                                    </div>

                                    {/* Additional Banners */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* Banner 1 */}
                                        <div>
                                            <InputLabel value="Banner Image 1" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!banner1Preview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Banner Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, JPEG, or PNG files only
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".jpg,.jpeg,.png"
                                                                onChange={(e) => handleImageChange(e, 'image3', setBanner1Preview, 'image3name')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={banner1Preview}
                                                            alt="Banner 1 Preview"
                                                            className="mx-auto max-h-48 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage('image3', setBanner1Preview, 'image3name')}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.image3 && <InputError message={errors.image3} />}
                                        </div>

                                        {/* Banner 2 */}
                                        <div>
                                            <InputLabel value="Banner Image 2" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!banner2Preview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Banner Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, JPEG, or PNG files only
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".jpg,.jpeg,.png"
                                                                onChange={(e) => handleImageChange(e, 'image4', setBanner2Preview, 'image4name')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={banner2Preview}
                                                            alt="Banner 2 Preview"
                                                            className="mx-auto max-h-48 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage('image4', setBanner2Preview, 'image4name')}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.image4 && <InputError message={errors.image4} />}
                                        </div>

                                        {/* Banner 3 */}
                                        <div>
                                            <InputLabel value="Banner Image 3" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!banner3Preview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Banner Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, JPEG, or PNG files only
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".jpg,.jpeg,.png"
                                                                onChange={(e) => handleImageChange(e, 'image5', setBanner3Preview, 'image5name')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={banner3Preview}
                                                            alt="Banner 3 Preview"
                                                            className="mx-auto max-h-48 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage('image5', setBanner3Preview, 'image5name')}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.image5 && <InputError message={errors.image5} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t pt-4">
                                    <Link
                                        href={route('marketing-campaign.index')}
                                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton processing={processing}>
                                        {isEditing ? 'Update Campaign' : 'Create Campaign'}
                                        <i className="fa fa-arrow-right ml-2"></i>
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}