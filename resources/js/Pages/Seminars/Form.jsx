import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Select, Switch } from 'antd';
import { getSeminarImageUrl } from '@/Utils/imageHelper';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';

export default function Form({ seminar, sponsorPages, specialities, educationPartners }) {
    const { props } = usePage();
    const { baseImagePath } = props;
    const isEditing = !!seminar;
    const [currentStep, setCurrentStep] = useState(1);

    const [speakers, setSpeakers] = useState([]);
    const [loadingSpeakers, setLoadingSpeakers] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [appBannerError, setAppBannerError] = useState(null);
    const [appSquareError, setAppSquareError] = useState(null);
    const [inviteBannerError, setInviteBannerError] = useState(null);
    const [responsiveInviteBannerError, setResponsiveInviteBannerError] = useState(null);
    const [videoBannerError, setVideoBannerError] = useState(null);
    const [stripBannerError, setStripBannerError] = useState(null);
    const [adsBannerError, setAdsBannerError] = useState(null);
    const [timezoneBannerError, setTimezoneBannerError] = useState(null);
    const [responsiveTimezoneBannerError, setResponsiveTimezoneBannerError] = useState(null);
    const [certificateError, setCertificateError] = useState(null);

    // Parse html_json for Step 3 registration configuration
    const parseHtmlJson = (jsonString) => {
        try {
            return jsonString ? JSON.parse(jsonString) : {};
        } catch (e) {
            console.error('Error parsing html_json:', e);
            return {};
        }
    };

    const htmlJsonData = seminar?.html_json ? parseHtmlJson(seminar.html_json) : {};

    const { data, setData, post, put, errors, processing } = useForm({
        seminar_title: seminar?.seminar_title || '',
        custom_url: seminar?.custom_url || '',
        seminar_desc: seminar?.seminar_desc || '',
        stream_url: seminar?.stream_url || '',
        offline_url: seminar?.offline_url || '',
        video_status: seminar?.video_status || 'schedule',
        videoSource: seminar?.videoSource || 'youTube',
        schedule_timestamp: seminar?.schedule_timestamp || '',
        seminar_speciality: seminar?.seminar_speciality || '',
        speakerids: seminar?.speakerids ? (Array.isArray(seminar.speakerids) ? seminar.speakerids.map(id => String(id).trim()) : []) : [],
        sponsor_ids: seminar?.sponsor_ids || '',
        shorten_url: seminar?.shorten_url || '',
        video_button: seminar?.video_button ?? true,
        chatBox: seminar?.chatBox ?? '0',
        showArchive: seminar?.showArchive ?? '1',
        isFeatured: seminar?.isFeatured ?? '0',
        featured: seminar?.featured ?? 1,
        businessSponsered: seminar?.businessSponsered ?? '0',
        questionBox: seminar?.questionBox ?? '0',
        is_registered: seminar?.is_registered ?? false,
        education_partners: seminar?.education_partners ? (Array.isArray(seminar.education_partners) ? seminar.education_partners.map(id => String(id).trim()) : []) : [],
        hasMCQ: seminar?.hasMCQ || '',
        re_attempts: seminar?.re_attempts || 0,
        seminar_type: seminar?.seminar_type || '',
        poll_link: seminar?.poll_link || '',
        // Registration form configuration from html_json
        reg_title_enabled: htmlJsonData.reg_title_enabled ?? false,
        reg_title_required: htmlJsonData.reg_title_required ?? false,
        reg_title_options: htmlJsonData.reg_title_options || ['Dr.', 'Mr.', 'Miss.', 'Mrs.'],
        reg_first_name_enabled: htmlJsonData.reg_first_name_enabled ?? false,
        reg_first_name_required: htmlJsonData.reg_first_name_required ?? false,
        reg_last_name_enabled: htmlJsonData.reg_last_name_enabled ?? false,
        reg_last_name_required: htmlJsonData.reg_last_name_required ?? false,
        reg_email_enabled: htmlJsonData.reg_email_enabled ?? false,
        reg_email_required: htmlJsonData.reg_email_required ?? false,
        reg_mobile_enabled: htmlJsonData.reg_mobile_enabled ?? false,
        reg_mobile_required: htmlJsonData.reg_mobile_required ?? false,
        reg_city_enabled: htmlJsonData.reg_city_enabled ?? false,
        reg_city_required: htmlJsonData.reg_city_required ?? false,
        reg_state_enabled: htmlJsonData.reg_state_enabled ?? false,
        reg_state_required: htmlJsonData.reg_state_required ?? false,
        reg_specialty_enabled: htmlJsonData.reg_specialty_enabled ?? false,
        reg_specialty_required: htmlJsonData.reg_specialty_required ?? false,
        reg_specialty_options: htmlJsonData.reg_specialty_options || [],
        reg_medical_reg_enabled: htmlJsonData.reg_medical_reg_enabled ?? false,
        reg_medical_reg_required: htmlJsonData.reg_medical_reg_required ?? false,
        reg_medical_council_enabled: htmlJsonData.reg_medical_council_enabled ?? false,
        reg_medical_council_required: htmlJsonData.reg_medical_council_required ?? false,
        reg_profession_enabled: htmlJsonData.reg_profession_enabled ?? false,
        reg_profession_required: htmlJsonData.reg_profession_required ?? false,
        reg_drl_code_enabled: htmlJsonData.reg_drl_code_enabled ?? false,
        reg_drl_code_required: htmlJsonData.reg_drl_code_required ?? false,
        reg_country_enabled: htmlJsonData.reg_country_enabled ?? false,
        reg_country_required: htmlJsonData.reg_country_required ?? false,
        theme_color: htmlJsonData.theme_color || '#5d9cec',
        allowed_by: htmlJsonData.allowed_by || 'email',
        // Moderators, Panelists, Chief Guests, Speakers
        moderators_enabled: htmlJsonData.moderators_enabled ?? false,
        moderators_list: htmlJsonData.moderators_list || [],
        panelists_enabled: htmlJsonData.panelists_enabled ?? false,
        panelists_list: htmlJsonData.panelists_list || [],
        chief_guests_enabled: htmlJsonData.chief_guests_enabled ?? false,
        chief_guests_list: htmlJsonData.chief_guests_list || [],
        speakers_enabled: htmlJsonData.speakers_enabled ?? false,
        speakers_list: htmlJsonData.speakers_list || [],
        // Text fields
        note_text: htmlJsonData.note_text || '',
        left_text: htmlJsonData.left_text || '',
        // Banner images
        invite_banner: null,
        invite_banner_url: htmlJsonData.invite_banner_url || '',
        responsive_invite_banner: null,
        responsive_invite_banner_url: htmlJsonData.responsive_invite_banner_url || '',
        video_banner: null,
        video_banner_url: htmlJsonData.video_banner_url || '',
        strip_banner: null,
        strip_banner_url: htmlJsonData.strip_banner_url || '',
        ads_banner: null,
        ads_banner_url: htmlJsonData.ads_banner_url || '',
        timezone_banner: null,
        timezone_banner_url: htmlJsonData.timezone_banner_url || '',
        responsive_timezone_banner: null,
        responsive_timezone_banner_url: htmlJsonData.responsive_timezone_banner_url || '',
        certificate: null,
        certificate_url: htmlJsonData.certificate_url || '',
        image: null,
        s_image1: null,
        s_image2: null,
    });

    const [imagePreview, setImagePreview] = useState(
        seminar?.video_image ? getSeminarImageUrl(seminar.video_image, baseImagePath) : null
    );
    const [appBannerPreview, setAppBannerPreview] = useState(
        seminar?.s_image1 ? getSeminarImageUrl(seminar.s_image1, baseImagePath) : null
    );
    const [appSquarePreview, setAppSquarePreview] = useState(
        seminar?.s_image2 ? getSeminarImageUrl(seminar.s_image2, baseImagePath) : null
    );
    const [inviteBannerPreview, setInviteBannerPreview] = useState(null);
    const [responsiveInviteBannerPreview, setResponsiveInviteBannerPreview] = useState(null);
    const [videoBannerPreview, setVideoBannerPreview] = useState(null);
    const [stripBannerPreview, setStripBannerPreview] = useState(null);
    const [adsBannerPreview, setAdsBannerPreview] = useState(null);
    const [timezoneBannerPreview, setTimezoneBannerPreview] = useState(null);
    const [responsiveTimezoneBannerPreview, setResponsiveTimezoneBannerPreview] = useState(null);
    const [certificatePreview, setCertificatePreview] = useState(null);

    useEffect(() => {
        // Fetch speakers from API
        const fetchSpeakers = async () => {
            setLoadingSpeakers(true);
            try {
                const response = await fetch('/api/seminar-speakers');
                const data = await response.json();
                setSpeakers(data);
            } catch (error) {
                console.error('Error fetching speakers:', error);
            } finally {
                setLoadingSpeakers(false);
            }
        };

        fetchSpeakers();
    }, []);

    useEffect(() => {
        // Auto-generate custom URL from title
        if (data.seminar_title && !isEditing) {
            const slug = data.seminar_title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            setData('custom_url', slug);
        }
    }, [data.seminar_title]);

    const handleImageChange = (e, type = 'featured') => {
        const file = e.target.files[0];
        if (!file) return;

        // Define validation rules for each image type
        const validationRules = {
            featured: { width: 700, height: 393, label: 'Featured Image' },
            appBanner: { width: 640, height: 360, label: 'App Banner' },
            appSquare: { width: 400, height: 400, label: 'App Square' },
            inviteBanner: { width: 497, height: 572, label: 'Webinar Invite Banner' },
            responsiveInviteBanner: { width: 497, height: 572, label: 'Responsive Invite Banner' },
            videoBanner: { width: 700, height: 393, label: 'Video Banner' },
            stripBanner: { width: 1149, height: 70, label: 'Strip Banner' },
            adsBanner: { width: 427, height: 572, label: 'Ads Banner' },
            timezoneBanner: { width: 1149, height: 70, label: 'Timezone Desk Image' },
            responsiveTimezoneBanner: { width: 770, height: 100, label: 'Timezone Responsive Image' },
            certificate: { width: 1600, height: 1165, label: 'Certificate' },
        };

        const rules = validationRules[type];
        const setError = {
            featured: setImageError,
            appBanner: setAppBannerError,
            appSquare: setAppSquareError,
            inviteBanner: setInviteBannerError,
            responsiveInviteBanner: setResponsiveInviteBannerError,
            videoBanner: setVideoBannerError,
            stripBanner: setStripBannerError,
            adsBanner: setAdsBannerError,
            timezoneBanner: setTimezoneBannerError,
            responsiveTimezoneBanner: setResponsiveTimezoneBannerError,
            certificate: setCertificateError,
        }[type];

        const setPreview = {
            featured: setImagePreview,
            appBanner: setAppBannerPreview,
            appSquare: setAppSquarePreview,
            inviteBanner: setInviteBannerPreview,
            responsiveInviteBanner: setResponsiveInviteBannerPreview,
            videoBanner: setVideoBannerPreview,
            stripBanner: setStripBannerPreview,
            adsBanner: setAdsBannerPreview,
            timezoneBanner: setTimezoneBannerPreview,
            responsiveTimezoneBanner: setResponsiveTimezoneBannerPreview,
            certificate: setCertificatePreview,
        }[type];

        const setDataField = {
            featured: 'image',
            appBanner: 's_image1',
            appSquare: 's_image2',
            inviteBanner: 'invite_banner',
            responsiveInviteBanner: 'responsive_invite_banner',
            videoBanner: 'video_banner',
            stripBanner: 'strip_banner',
            adsBanner: 'ads_banner',
            timezoneBanner: 'timezone_banner',
            responsiveTimezoneBanner: 'responsive_timezone_banner',
            certificate: 'certificate',
        }[type];

        // Validate file size (max 1MB)
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('Image size must be less than 1MB');
            e.target.value = '';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed.');
            e.target.value = '';
            return;
        }

        // Validate image dimensions
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = function () {
            URL.revokeObjectURL(objectUrl);

            if (this.width !== rules.width || this.height !== rules.height) {
                setError(`${rules.label} dimensions must be exactly ${rules.width} x ${rules.height} pixels. Current: ${this.width} x ${this.height}`);
                e.target.value = '';
                return;
            }

            // All validations passed
            setError(null);
            setData(setDataField, file);
            setPreview(URL.createObjectURL(file));
        };

        img.onerror = function () {
            URL.revokeObjectURL(objectUrl);
            setError('Failed to load image. Please try another file.');
            e.target.value = '';
        };
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSaveAndContinue = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            speakerids: Array.isArray(data.speakerids) ? data.speakerids : [],
            education_partners: Array.isArray(data.education_partners) ? data.education_partners : [],
        };

        if (isEditing) {
            post(route('seminars.update', seminar.id), {
                ...formData,
                forceFormData: true,
                _method: 'PUT',
                preserveScroll: true,
                onSuccess: () => {
                    if (currentStep < 3) {
                        handleNext();
                    }
                },
            });
        } else {
            post(route('seminars.store'), {
                ...formData,
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    if (currentStep < 3) {
                        handleNext();
                    }
                },
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Build html_json from Step 3 registration configuration
        const htmlJsonConfig = {
            reg_title_enabled: data.reg_title_enabled,
            reg_title_required: data.reg_title_required,
            reg_title_options: data.reg_title_options,
            reg_first_name_enabled: data.reg_first_name_enabled,
            reg_first_name_required: data.reg_first_name_required,
            reg_last_name_enabled: data.reg_last_name_enabled,
            reg_last_name_required: data.reg_last_name_required,
            reg_email_enabled: data.reg_email_enabled,
            reg_email_required: data.reg_email_required,
            reg_mobile_enabled: data.reg_mobile_enabled,
            reg_mobile_required: data.reg_mobile_required,
            reg_city_enabled: data.reg_city_enabled,
            reg_city_required: data.reg_city_required,
            reg_state_enabled: data.reg_state_enabled,
            reg_state_required: data.reg_state_required,
            reg_specialty_enabled: data.reg_specialty_enabled,
            reg_specialty_required: data.reg_specialty_required,
            reg_specialty_options: data.reg_specialty_options,
            reg_medical_reg_enabled: data.reg_medical_reg_enabled,
            reg_medical_reg_required: data.reg_medical_reg_required,
            reg_medical_council_enabled: data.reg_medical_council_enabled,
            reg_medical_council_required: data.reg_medical_council_required,
            reg_profession_enabled: data.reg_profession_enabled,
            reg_profession_required: data.reg_profession_required,
            reg_drl_code_enabled: data.reg_drl_code_enabled,
            reg_drl_code_required: data.reg_drl_code_required,
            reg_country_enabled: data.reg_country_enabled,
            reg_country_required: data.reg_country_required,
            theme_color: data.theme_color,
            allowed_by: data.allowed_by,
            // Additional Step 3 data
            moderators_enabled: data.moderators_enabled,
            moderators_list: data.moderators_list,
            panelists_enabled: data.panelists_enabled,
            panelists_list: data.panelists_list,
            chief_guests_enabled: data.chief_guests_enabled,
            chief_guests_list: data.chief_guests_list,
            speakers_enabled: data.speakers_enabled,
            speakers_list: data.speakers_list,
            note_text: data.note_text,
            left_text: data.left_text,
            invite_banner_url: data.invite_banner_url,
            responsive_invite_banner_url: data.responsive_invite_banner_url,
            video_banner_url: data.video_banner_url,
            strip_banner_url: data.strip_banner_url,
            ads_banner_url: data.ads_banner_url,
            timezone_banner_url: data.timezone_banner_url,
            responsive_timezone_banner_url: data.responsive_timezone_banner_url,
            certificate_url: data.certificate_url,
        };

        const formData = {
            ...data,
            speakerids: Array.isArray(data.speakerids) ? data.speakerids : [],
            education_partners: Array.isArray(data.education_partners) ? data.education_partners : [],
            html_json: JSON.stringify(htmlJsonConfig),
        };

        if (isEditing) {
            post(route('seminars.update', seminar.id), {
                ...formData,
                forceFormData: true,
                _method: 'PUT',
            });
        } else {
            post(route('seminars.store'), {
                ...formData,
                forceFormData: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Seminar' : 'Add Seminar'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold">
                                    {isEditing ? 'EDIT SEMINAR' : 'ADD SEMINAR'}
                                </h4>
                                <Link
                                    href={route('seminars.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Seminars
                                </Link>
                            </div>

                            {/* Step Wizard Navigation */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex flex-1 items-center">
                                            <div className="flex flex-col items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => isEditing && setCurrentStep(step)}
                                                    disabled={!isEditing && step > currentStep}
                                                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${currentStep === step
                                                        ? 'border-[#00895f] bg-[#00895f] text-white'
                                                        : currentStep > step || isEditing
                                                            ? 'border-[#00895f] bg-white text-[#00895f] cursor-pointer hover:bg-gray-50'
                                                            : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <i className={`fa ${step === 1 ? 'fa-folder-open' :
                                                        step === 2 ? 'fa-users' :
                                                            'fa-list-alt'
                                                        } text-lg`}></i>
                                                </button>
                                                <span className="mt-2 text-xs font-medium text-gray-600">
                                                    Step {step}
                                                </span>
                                            </div>
                                            {step < 3 && (
                                                <div
                                                    className={`mx-4 h-1 flex-1 ${currentStep > step ? 'bg-[#00895f]' : 'bg-gray-300'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-4" />

                            <form onSubmit={currentStep === 3 ? handleSubmit : handleSaveAndContinue} className="space-y-6">
                                {/* Step 1: Basic Information */}
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                                        {/* Title */}
                                        <div>
                                            <InputLabel htmlFor="seminar_title" value="Seminar Title *" />
                                            <Input
                                                id="seminar_title"
                                                type="text"
                                                value={data.seminar_title}
                                                onChange={(e) => setData('seminar_title', e.target.value)}
                                                error={errors.seminar_title}
                                                icon="fa-heading"
                                                placeholder="Enter seminar title"
                                                size="lg"
                                            />
                                        </div>

                                        {/* Custom URL */}
                                        <div>
                                            <InputLabel htmlFor="custom_url" value="Custom URL *" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                value={data.custom_url}
                                                onChange={(e) => setData('custom_url', e.target.value.toLowerCase())}
                                                error={errors.custom_url}
                                                icon="fa-link"
                                                placeholder="custom-url-slug"
                                                size="lg"
                                            />
                                        </div>

                                        {/* Shorten URL */}
                                        <div>
                                            <InputLabel htmlFor="shorten_url" value="Shorten URL" />
                                            <Input
                                                id="shorten_url"
                                                type="text"
                                                value={data.shorten_url}
                                                onChange={(e) => setData('shorten_url', e.target.value)}
                                                error={errors.shorten_url}
                                                icon="fa-external-link"
                                                placeholder="https://short.url/abc"
                                                size="lg"
                                            />
                                        </div>

                                        {/* Video Status */}
                                        <div>
                                            <InputLabel htmlFor="video_status" value="Video Status *" />
                                            <Dropdown
                                                options={[
                                                    { value: 'live', label: 'Live' },
                                                    { value: 'schedule', label: 'Scheduled' },
                                                    { value: 'archive', label: 'Archive' },
                                                    { value: 'new', label: 'New' },
                                                ]}
                                                value={data.video_status}
                                                onChange={(value) => setData('video_status', value)}
                                                placeholder="Select status"
                                                icon="fa-circle"
                                                error={errors.video_status}
                                                size="lg"
                                            />
                                        </div>
                                        {/* Description */}
                                        <div className="col-span-2">
                                            <InputLabel value="Description *" />
                                            <RichTextEditor
                                                value={data.seminar_desc}
                                                onChange={(content) => setData('seminar_desc', content)}
                                                placeholder="Enter seminar description with rich formatting..."
                                                error={errors.seminar_desc}
                                                height={200}
                                            />
                                        </div>
                                        <div className="col-span-2 mt-8">
                                            <div className="grid grid-cols-2 gap-6">

                                                <div>
                                                    <InputLabel value="Featured Image (700 x 393, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!imagePreview ? (
                                                            <div className="text-center">
                                                                <div className="mb-4">
                                                                    <i className="fa fa-cloud-upload text-4xl text-gray-400"></i>
                                                                </div>
                                                                <p className="mb-2 text-sm font-medium text-gray-700">
                                                                    Seminar Featured Image
                                                                </p>
                                                                <p className="mb-1 text-xs text-gray-500">
                                                                    Dimensions: <span className="font-semibold">700 x 393 pixels</span>
                                                                </p>
                                                                <p className="mb-4 text-xs text-gray-500">
                                                                    Max Size: <span className="font-semibold">1MB</span>
                                                                </p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Upload Featured Image
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'featured')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="relative">
                                                                <img
                                                                    src={imagePreview}
                                                                    alt="Preview"
                                                                    className="mx-auto max-h-64 rounded-md"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('image', null);
                                                                        setImagePreview(null);
                                                                    }}
                                                                    className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                                >
                                                                    <i className="fa fa-trash mr-2"></i>
                                                                    Remove Image
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {imageError && (
                                                        <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                            <i className="fa fa-exclamation-circle"></i>
                                                            <span>{imageError}</span>
                                                        </div>
                                                    )}
                                                    <InputError message={errors.image} className="mt-2" />
                                                </div>

                                                <div>
                                                    {/* Live Stream URL */}
                                                    <div className=''>
                                                        <InputLabel htmlFor="stream_url" value="Live Stream URL" />
                                                        <Input
                                                            id="stream_url"
                                                            type="text"
                                                            value={data.stream_url}
                                                            onChange={(e) => setData('stream_url', e.target.value)}
                                                            error={errors.stream_url}
                                                            icon="fa-video-camera"
                                                            placeholder="https://youtube.com/live/..."
                                                            size="lg"
                                                        />
                                                    </div>

                                                    {/* Archive Video URL */}
                                                    <div className='mt-4'>
                                                        <InputLabel htmlFor="offline_url" value="Archive Video URL" />
                                                        <Input
                                                            id="offline_url"
                                                            type="text"
                                                            value={data.offline_url}
                                                            onChange={(e) => setData('offline_url', e.target.value)}
                                                            error={errors.offline_url}
                                                            icon="fa-archive"
                                                            placeholder="https://youtube.com/watch/..."
                                                            size="lg"
                                                        />
                                                    </div>



                                                    {/* Video Source */}
                                                    <div className='mt-4'>
                                                        <InputLabel htmlFor="videoSource" value="Video Source *" />
                                                        <Dropdown
                                                            options={[
                                                                { value: 'youTube', label: 'YouTube' },
                                                                { value: 'faceBook', label: 'Facebook' },
                                                                { value: 'mp4', label: 'MP4' },
                                                                { value: 'other', label: 'Other' },
                                                            ]}
                                                            value={data.videoSource}
                                                            onChange={(value) => setData('videoSource', value)}
                                                            placeholder="Select source"
                                                            icon="fa-play-circle"
                                                            error={errors.videoSource}
                                                            size="lg"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>





                                        {/* Schedule DateTime */}
                                        <div>
                                            <InputLabel htmlFor="schedule_timestamp" value="Schedule Date & Time *" />
                                            <Input
                                                id="schedule_timestamp"
                                                type="datetime-local"
                                                value={data.schedule_timestamp}
                                                onChange={(e) => setData('schedule_timestamp', e.target.value)}
                                                error={errors.schedule_timestamp}
                                                icon="fa-calendar"
                                                size="lg"
                                            />
                                        </div>

                                        {/* Speakers */}
                                        <div>
                                            <InputLabel value="Speakers" />
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                placeholder="Select speakers"
                                                value={data.speakerids}
                                                onChange={(value) => setData('speakerids', value)}
                                                loading={loadingSpeakers}
                                                options={speakers}
                                                className="w-full"
                                                style={{ width: '100%' }}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                }
                                                optionFilterProp="label"
                                                showSearch
                                            />
                                            <InputError message={errors.speakerids} />
                                        </div>

                                        {/* Speciality */}
                                        <div>
                                            <InputLabel htmlFor="seminar_speciality" value="Speciality" />
                                            <Dropdown
                                                options={specialities}
                                                value={data.seminar_speciality}
                                                onChange={(value) => setData('seminar_speciality', value)}
                                                placeholder="Select speciality"
                                                icon="fa-stethoscope"
                                                searchable
                                                error={errors.seminar_speciality}
                                                size="lg"
                                            />
                                        </div>

                                        {/* Education Partners */}
                                        <div>
                                            <InputLabel value="Education Partners" />
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                placeholder="Select education partners"
                                                value={data.education_partners}
                                                onChange={(value) => setData('education_partners', value)}
                                                options={educationPartners}
                                                className="w-full"
                                                style={{ width: '100%' }}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                }
                                                optionFilterProp="label"
                                                showSearch
                                            />
                                            <InputError message={errors.education_partners} />
                                        </div>






                                        {/* App Banner */}
                                        <div>
                                            <InputLabel value="App Banner (640 x 360, Max 1MB)" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                {!appBannerPreview ? (
                                                    <div className="text-center">
                                                        <p className="mb-2 text-xs text-gray-500">640 x 360 pixels</p>
                                                        <label className="cursor-pointer rounded-md bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700">
                                                            Upload
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'appBanner')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img src={appBannerPreview} alt="App Banner" className="mx-auto max-h-32 rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setData('s_image1', null);
                                                                setAppBannerPreview(null);
                                                            }}
                                                            className="mt-2 text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {appBannerError && <div className="mt-1 text-xs text-red-600">{appBannerError}</div>}
                                        </div>

                                        {/* App Square */}
                                        <div>
                                            <InputLabel value="App Square (400 x 400, Max 1MB)" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                {!appSquarePreview ? (
                                                    <div className="text-center">
                                                        <p className="mb-2 text-xs text-gray-500">400 x 400 pixels</p>
                                                        <label className="cursor-pointer rounded-md bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700">
                                                            Upload
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'appSquare')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img src={appSquarePreview} alt="App Square" className="mx-auto max-h-32 rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setData('s_image2', null);
                                                                setAppSquarePreview(null);
                                                            }}
                                                            className="mt-2 text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {appSquareError && <div className="mt-1 text-xs text-red-600">{appSquareError}</div>}
                                        </div>

                                    </div>

                                )}

                                {/* Step 2: Speakers, Sponsors & Speciality */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-800">Other Details</h3>
                                        <hr className="my-4" />

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {/* Speakers */}
                                            <div>
                                                <h4 className="mb-3 font-semibold text-gray-700">ADD Speakers</h4>
                                                <Select
                                                    mode="multiple"
                                                    size="large"
                                                    placeholder="Choose Speakers"
                                                    value={data.speakerids}
                                                    onChange={(value) => setData('speakerids', value)}
                                                    loading={loadingSpeakers}
                                                    options={speakers}
                                                    className="w-full"
                                                    style={{ width: '100%' }}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    optionFilterProp="label"
                                                    showSearch
                                                />
                                                <InputError message={errors.speakerids} />
                                            </div>

                                            {/* Speciality */}
                                            <div>
                                                <h4 className="mb-3 font-semibold text-gray-700">Add Speciality</h4>
                                                <Dropdown
                                                    options={specialities}
                                                    value={data.seminar_speciality}
                                                    onChange={(value) => setData('seminar_speciality', value)}
                                                    placeholder="Select Specialties"
                                                    icon="fa-stethoscope"
                                                    searchable
                                                    error={errors.seminar_speciality}
                                                    size="lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Registration Form Configuration */}
                                {currentStep === 3 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">Live Seminar Details Webcast</h3>
                                            <p className="mt-1 text-sm text-gray-600">Configure registration fields and webcast details</p>
                                            <hr className="my-4" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            {/* LEFT COLUMN - Registration Fields */}
                                            <div className="space-y-6">
                                                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                                                    <h4 className="text-md font-bold text-gray-800 flex items-center">
                                                        <i className="fa fa-list-alt mr-2 text-blue-600"></i>
                                                        Select Registration Fields
                                                    </h4>
                                                </div>

                                                {/* Title Field */}
                                                <div className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Switch
                                                                checked={data.reg_title_enabled}
                                                                onChange={(checked) => setData('reg_title_enabled', checked)}
                                                                style={{ backgroundColor: data.reg_title_enabled ? '#00895f' : undefined }}
                                                            />
                                                            <span className="text-sm font-semibold text-gray-700">Title</span>
                                                        </div>
                                                        {data.reg_title_enabled && (
                                                            <div className="ml-12 flex gap-2">
                                                                {['Dr.', 'Mr.', 'Miss.', 'Mrs.'].map(title => (
                                                                    <span key={title} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                                        {title}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="mb-2 block text-xs font-semibold text-gray-600">Required?</span>
                                                        <Switch
                                                            checked={data.reg_title_required}
                                                            onChange={(checked) => setData('reg_title_required', checked)}
                                                            disabled={!data.reg_title_enabled}
                                                            style={{ backgroundColor: data.reg_title_required ? '#00895f' : undefined }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* First Name */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_first_name_enabled}
                                                            onChange={(checked) => setData('reg_first_name_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_first_name_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">First Name</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_first_name_required}
                                                        onChange={(checked) => setData('reg_first_name_required', checked)}
                                                        disabled={!data.reg_first_name_enabled}
                                                        style={{ backgroundColor: data.reg_first_name_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Last Name */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_last_name_enabled}
                                                            onChange={(checked) => setData('reg_last_name_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_last_name_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Last Name</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_last_name_required}
                                                        onChange={(checked) => setData('reg_last_name_required', checked)}
                                                        disabled={!data.reg_last_name_enabled}
                                                        style={{ backgroundColor: data.reg_last_name_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_email_enabled}
                                                            onChange={(checked) => setData('reg_email_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_email_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Email</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_email_required}
                                                        onChange={(checked) => setData('reg_email_required', checked)}
                                                        disabled={!data.reg_email_enabled}
                                                        style={{ backgroundColor: data.reg_email_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Mobile */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_mobile_enabled}
                                                            onChange={(checked) => setData('reg_mobile_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_mobile_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Mobile</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_mobile_required}
                                                        onChange={(checked) => setData('reg_mobile_required', checked)}
                                                        disabled={!data.reg_mobile_enabled}
                                                        style={{ backgroundColor: data.reg_mobile_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* City */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_city_enabled}
                                                            onChange={(checked) => setData('reg_city_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_city_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">City</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_city_required}
                                                        onChange={(checked) => setData('reg_city_required', checked)}
                                                        disabled={!data.reg_city_enabled}
                                                        style={{ backgroundColor: data.reg_city_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* State */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_state_enabled}
                                                            onChange={(checked) => setData('reg_state_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_state_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">State</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_state_required}
                                                        onChange={(checked) => setData('reg_state_required', checked)}
                                                        disabled={!data.reg_state_enabled}
                                                        style={{ backgroundColor: data.reg_state_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Specialty */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <Switch
                                                                checked={data.reg_specialty_enabled}
                                                                onChange={(checked) => setData('reg_specialty_enabled', checked)}
                                                                style={{ backgroundColor: data.reg_specialty_enabled ? '#00895f' : undefined }}
                                                            />
                                                            <span className="text-sm font-semibold text-gray-700">Specialty</span>
                                                        </div>
                                                        <Switch
                                                            checked={data.reg_specialty_required}
                                                            onChange={(checked) => setData('reg_specialty_required', checked)}
                                                            disabled={!data.reg_specialty_enabled}
                                                            style={{ backgroundColor: data.reg_specialty_required ? '#00895f' : undefined }}
                                                        />
                                                    </div>
                                                    {data.reg_specialty_enabled && (
                                                        <div className="ml-12">
                                                            <Select
                                                                mode="multiple"
                                                                placeholder="Select specialties"
                                                                value={data.reg_specialty_options}
                                                                onChange={(value) => setData('reg_specialty_options', value)}
                                                                options={specialities}
                                                                className="w-full"
                                                                size="large"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Medical Registration No */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_medical_reg_enabled}
                                                            onChange={(checked) => setData('reg_medical_reg_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_medical_reg_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Medical Registration No</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_medical_reg_required}
                                                        onChange={(checked) => setData('reg_medical_reg_required', checked)}
                                                        disabled={!data.reg_medical_reg_enabled}
                                                        style={{ backgroundColor: data.reg_medical_reg_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Medical Council */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_medical_council_enabled}
                                                            onChange={(checked) => setData('reg_medical_council_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_medical_council_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Medical Council</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_medical_council_required}
                                                        onChange={(checked) => setData('reg_medical_council_required', checked)}
                                                        disabled={!data.reg_medical_council_enabled}
                                                        style={{ backgroundColor: data.reg_medical_council_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Profession */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_profession_enabled}
                                                            onChange={(checked) => setData('reg_profession_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_profession_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Profession</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_profession_required}
                                                        onChange={(checked) => setData('reg_profession_required', checked)}
                                                        disabled={!data.reg_profession_enabled}
                                                        style={{ backgroundColor: data.reg_profession_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* DRL Code */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_drl_code_enabled}
                                                            onChange={(checked) => setData('reg_drl_code_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_drl_code_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">DRL Code</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_drl_code_required}
                                                        onChange={(checked) => setData('reg_drl_code_required', checked)}
                                                        disabled={!data.reg_drl_code_enabled}
                                                        style={{ backgroundColor: data.reg_drl_code_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Country */}
                                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3">
                                                        <Switch
                                                            checked={data.reg_country_enabled}
                                                            onChange={(checked) => setData('reg_country_enabled', checked)}
                                                            style={{ backgroundColor: data.reg_country_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Country</span>
                                                    </div>
                                                    <Switch
                                                        checked={data.reg_country_required}
                                                        onChange={(checked) => setData('reg_country_required', checked)}
                                                        disabled={!data.reg_country_enabled}
                                                        style={{ backgroundColor: data.reg_country_required ? '#00895f' : undefined }}
                                                    />
                                                </div>

                                                {/* Theme Color */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel htmlFor="theme_color" value="Theme Color" />
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <input
                                                            type="color"
                                                            id="theme_color"
                                                            value={data.theme_color}
                                                            onChange={(e) => setData('theme_color', e.target.value)}
                                                            className="h-12 w-20 cursor-pointer rounded border border-gray-300"
                                                        />
                                                        <span className="text-sm text-gray-600">{data.theme_color}</span>
                                                    </div>
                                                </div>

                                                {/* Allow Registration With */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Allow Registration With" />
                                                    <div className="mt-3 space-y-3">
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="allowed_by"
                                                                value="email"
                                                                checked={data.allowed_by === 'email'}
                                                                onChange={(e) => setData('allowed_by', e.target.value)}
                                                                className="h-4 w-4 text-[#00895f] focus:ring-[#00895f]"
                                                            />
                                                            <span className="text-sm text-gray-700">Email</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="allowed_by"
                                                                value="mobile"
                                                                checked={data.allowed_by === 'mobile'}
                                                                onChange={(e) => setData('allowed_by', e.target.value)}
                                                                className="h-4 w-4 text-[#00895f] focus:ring-[#00895f]"
                                                            />
                                                            <span className="text-sm text-gray-700">Mobile</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="allowed_by"
                                                                value="both"
                                                                checked={data.allowed_by === 'both'}
                                                                onChange={(e) => setData('allowed_by', e.target.value)}
                                                                className="h-4 w-4 text-[#00895f] focus:ring-[#00895f]"
                                                            />
                                                            <span className="text-sm text-gray-700">Both (Email and Mobile)</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN - Webinar Banners & Participants */}
                                            <div className="space-y-6">
                                                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                                                    <h4 className="text-md font-bold text-gray-800 flex items-center">
                                                        <i className="fa fa-image mr-2 text-purple-600"></i>
                                                        Webinar Banners
                                                    </h4>
                                                </div>

                                                {/* Webinar Banners Info */}
                                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                                    <p className="text-sm text-blue-800">
                                                        <i className="fa fa-info-circle mr-2"></i>
                                                        Upload banners for invite, video, timezone displays and certificates.
                                                    </p>
                                                </div>

                                                {/* Invite Banner (497x572) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Webinar Banners Invite Image (497 x 572, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!inviteBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">497 x 572 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'inviteBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={inviteBannerPreview} alt="Invite Banner" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('invite_banner', null);
                                                                        setInviteBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {inviteBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{inviteBannerError}</div>}
                                                </div>

                                                {/* Responsive Invite Image (497x572) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Responsive Invite Image (497 x 572, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!responsiveInviteBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">497 x 572 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'responsiveInviteBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={responsiveInviteBannerPreview} alt="Responsive Invite" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('responsive_invite_banner', null);
                                                                        setResponsiveInviteBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {responsiveInviteBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{responsiveInviteBannerError}</div>}
                                                </div>

                                                {/* Video Image (700x393) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Video Image (700 x 393, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!videoBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">700 x 393 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'videoBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={videoBannerPreview} alt="Video Banner" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('video_banner', null);
                                                                        setVideoBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {videoBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{videoBannerError}</div>}
                                                </div>

                                                {/* Strip Image (1149x70) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Strip Image (1149 x 70, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!stripBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">1149 x 70 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'stripBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={stripBannerPreview} alt="Strip Banner" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('strip_banner', null);
                                                                        setStripBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {stripBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{stripBannerError}</div>}
                                                </div>

                                                {/* Ads Image (427x572) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Ads Image (427 x 572, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!adsBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">427 x 572 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'adsBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={adsBannerPreview} alt="Ads Banner" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('ads_banner', null);
                                                                        setAdsBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {adsBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{adsBannerError}</div>}
                                                </div>

                                                {/* Timezone Desk Image (1149x70) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Timezone Desk Image (1149 x 70, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!timezoneBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">1149 x 70 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'timezoneBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={timezoneBannerPreview} alt="Timezone Banner" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('timezone_banner', null);
                                                                        setTimezoneBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {timezoneBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{timezoneBannerError}</div>}
                                                </div>

                                                {/* Timezone Responsive Image (770x100) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Timezone Responsive Image (770 x 100, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!responsiveTimezoneBannerPreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">770 x 100 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'responsiveTimezoneBanner')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={responsiveTimezoneBannerPreview} alt="Responsive Timezone" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('responsive_timezone_banner', null);
                                                                        setResponsiveTimezoneBannerPreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {responsiveTimezoneBannerError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{responsiveTimezoneBannerError}</div>}
                                                </div>

                                                {/* Certificate (1600x1165) */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel value="Seminar Certificate (1600 x 1165, Max 1MB)" />
                                                    <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                        {!certificatePreview ? (
                                                            <div className="text-center">
                                                                <i className="fa fa-certificate text-4xl text-gray-400 mb-2"></i>
                                                                <p className="mb-1 text-xs text-gray-500">1600 x 1165 pixels</p>
                                                                <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 inline-block">
                                                                    <i className="fa fa-upload mr-2"></i>
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageChange(e, 'certificate')}
                                                                    />
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <img src={certificatePreview} alt="Certificate" className="mx-auto max-h-48 rounded-md mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('certificate', null);
                                                                        setCertificatePreview(null);
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800"
                                                                >
                                                                    <i className="fa fa-trash mr-1"></i>Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {certificateError && <div className="mt-1 text-xs text-red-600"><i className="fa fa-exclamation-circle mr-1"></i>{certificateError}</div>}
                                                </div>

                                                {/* Moderators */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Switch
                                                            checked={data.moderators_enabled}
                                                            onChange={(checked) => setData('moderators_enabled', checked)}
                                                            style={{ backgroundColor: data.moderators_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Moderators</span>
                                                    </div>
                                                    {data.moderators_enabled && (
                                                        <div className="ml-12">
                                                            <Select
                                                                mode="multiple"
                                                                placeholder="Choose moderators"
                                                                value={data.moderators_list}
                                                                onChange={(value) => setData('moderators_list', value)}
                                                                loading={loadingSpeakers}
                                                                options={speakers}
                                                                className="w-full"
                                                                size="large"
                                                                showSearch
                                                                filterOption={(input, option) =>
                                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Panelists */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Switch
                                                            checked={data.panelists_enabled}
                                                            onChange={(checked) => setData('panelists_enabled', checked)}
                                                            style={{ backgroundColor: data.panelists_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Panelists</span>
                                                    </div>
                                                    {data.panelists_enabled && (
                                                        <div className="ml-12">
                                                            <Select
                                                                mode="multiple"
                                                                placeholder="Choose panelists"
                                                                value={data.panelists_list}
                                                                onChange={(value) => setData('panelists_list', value)}
                                                                loading={loadingSpeakers}
                                                                options={speakers}
                                                                className="w-full"
                                                                size="large"
                                                                showSearch
                                                                filterOption={(input, option) =>
                                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Chief Guests */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Switch
                                                            checked={data.chief_guests_enabled}
                                                            onChange={(checked) => setData('chief_guests_enabled', checked)}
                                                            style={{ backgroundColor: data.chief_guests_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Chief Guests</span>
                                                    </div>
                                                    {data.chief_guests_enabled && (
                                                        <div className="ml-12">
                                                            <Select
                                                                mode="multiple"
                                                                placeholder="Choose chief guests"
                                                                value={data.chief_guests_list}
                                                                onChange={(value) => setData('chief_guests_list', value)}
                                                                loading={loadingSpeakers}
                                                                options={speakers}
                                                                className="w-full"
                                                                size="large"
                                                                showSearch
                                                                filterOption={(input, option) =>
                                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Speakers */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Switch
                                                            checked={data.speakers_enabled}
                                                            onChange={(checked) => setData('speakers_enabled', checked)}
                                                            style={{ backgroundColor: data.speakers_enabled ? '#00895f' : undefined }}
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Speakers</span>
                                                    </div>
                                                    {data.speakers_enabled && (
                                                        <div className="ml-12">
                                                            <Select
                                                                mode="multiple"
                                                                placeholder="Choose speakers"
                                                                value={data.speakers_list}
                                                                onChange={(value) => setData('speakers_list', value)}
                                                                loading={loadingSpeakers}
                                                                options={speakers}
                                                                className="w-full"
                                                                size="large"
                                                                showSearch
                                                                filterOption={(input, option) =>
                                                                    option.label.toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Note Text */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel htmlFor="note_text" value="Note Text" />
                                                    <textarea
                                                        id="note_text"
                                                        value={data.note_text}
                                                        onChange={(e) => setData('note_text', e.target.value)}
                                                        rows="3"
                                                        className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#00895f] focus:ring-[#00895f]"
                                                        placeholder="Enter note text for registration page"
                                                    />
                                                </div>

                                                {/* Left Text */}
                                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <InputLabel htmlFor="left_text" value="Left Text" />
                                                    <textarea
                                                        id="left_text"
                                                        value={data.left_text}
                                                        onChange={(e) => setData('left_text', e.target.value)}
                                                        rows="3"
                                                        className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#00895f] focus:ring-[#00895f]"
                                                        placeholder="Enter left sidebar text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between border-t pt-4">
                                    <div>
                                        {currentStep > 1 && (
                                            <SecondaryButton type="button" onClick={handlePrevious}>
                                                <i className="fa fa-arrow-left mr-2"></i>
                                                Previous
                                            </SecondaryButton>
                                        )}
                                        {currentStep === 1 && (
                                            <Link
                                                href={route('seminars.index')}
                                                className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                Cancel
                                            </Link>
                                        )}
                                    </div>
                                    <PrimaryButton processing={processing}>
                                        {currentStep < 3 ? (
                                            <>
                                                <span className="mr-2">Save and Continue</span>

                                                <i className="fa fa-arrow-right ml-2"></i>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-save mr-2"></i>
                                                {isEditing ? 'Update Seminar' : 'Create Seminar'}
                                            </>
                                        )}
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
