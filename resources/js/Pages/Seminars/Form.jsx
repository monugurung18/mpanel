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
        speakerids: seminar?.speakerids || [],
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
        education_partners: seminar?.education_partners || [],
        hasMCQ: seminar?.hasMCQ || '',
        re_attempts: seminar?.re_attempts || 0,
        seminar_type: seminar?.seminar_type || '',
        poll_link: seminar?.poll_link || '',
        // Registration form configuration
        reg_title_enabled: false,
        reg_title_required: false,
        reg_title_options: ['Dr.', 'Mr.', 'Miss.', 'Mrs.'],
        reg_first_name_enabled: false,
        reg_first_name_required: false,
        reg_last_name_enabled: false,
        reg_last_name_required: false,
        reg_email_enabled: false,
        reg_email_required: false,
        reg_mobile_enabled: false,
        reg_mobile_required: false,
        reg_city_enabled: false,
        reg_city_required: false,
        reg_state_enabled: false,
        reg_state_required: false,
        reg_specialty_enabled: false,
        reg_specialty_required: false,
        reg_specialty_options: [],
        reg_medical_reg_enabled: false,
        reg_medical_reg_required: false,
        reg_medical_council_enabled: false,
        reg_medical_council_required: false,
        reg_profession_enabled: false,
        reg_profession_required: false,
        reg_drl_code_enabled: false,
        reg_drl_code_required: false,
        reg_country_enabled: false,
        reg_country_required: false,
        theme_color: '#5d9cec',
        allowed_by: 'email',
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
        };

        const rules = validationRules[type];
        const setError = type === 'featured' ? setImageError :
            type === 'appBanner' ? setAppBannerError : setAppSquareError;

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
            if (type === 'featured') {
                setData('image', file);
                setImagePreview(URL.createObjectURL(file));
            } else if (type === 'appBanner') {
                setData('s_image1', file);
                setAppBannerPreview(URL.createObjectURL(file));
            } else if (type === 'appSquare') {
                setData('s_image2', file);
                setAppSquarePreview(URL.createObjectURL(file));
            }
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
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-800">Live Seminar Registration Form Builder</h3>
                                        <hr className="my-4" />

                                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                            <p className="text-sm text-blue-800">
                                                <i className="fa fa-info-circle mr-2"></i>
                                                Configure which fields appear in the registration form and whether they're required.
                                            </p>
                                        </div>

                                        {/* Registration Fields Configuration */}
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-12 gap-4 border-b border-gray-300 pb-3">
                                                <div className="col-span-8">
                                                    <h5 className="font-semibold text-gray-700">Registration Fields</h5>
                                                </div>
                                                <div className="col-span-4 text-center">
                                                    <h5 className="font-semibold text-gray-700">Required</h5>
                                                </div>
                                            </div>

                                            {/* Registration fields - Title, First Name, Last Name, Email, Mobile, etc. */}
                                            {/* Similar pattern for each field with enable/required toggles */}
                                            
                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 mt-4">
                                                <p className="text-sm text-yellow-800">
                                                    <i className="fa fa-wrench mr-2"></i>
                                                    Registration form builder will be fully implemented with all fields from the PHP version.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Additional Settings */}
                                        <div className="mt-8 space-y-4">
                                            <h4 className="text-md font-semibold text-gray-800">Additional Settings</h4>
                                            
                                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                {/* Theme Color */}
                                                <div>
                                                    <InputLabel htmlFor="theme_color" value="Theme Color" />
                                                    <input
                                                        type="color"
                                                        id="theme_color"
                                                        value={data.theme_color}
                                                        onChange={(e) => setData('theme_color', e.target.value)}
                                                        className="h-10 w-full rounded-md border border-gray-300"
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Choose the primary color for the registration form
                                                    </p>
                                                </div>

                                                {/* Allow Registration With */}
                                                <div>
                                                    <InputLabel value="Allow Registration With" />
                                                    <div className="mt-2 space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="allowed_by"
                                                                value="email"
                                                                checked={data.allowed_by === 'email'}
                                                                onChange={(e) => setData('allowed_by', e.target.value)}
                                                                className="text-[#00895f] focus:ring-[#00895f]"
                                                            />
                                                            <span className="text-sm text-gray-700">Email</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="allowed_by"
                                                                value="mobile"
                                                                checked={data.allowed_by === 'mobile'}
                                                                onChange={(e) => setData('allowed_by', e.target.value)}
                                                                className="text-[#00895f] focus:ring-[#00895f]"
                                                            />
                                                            <span className="text-sm text-gray-700">Mobile</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="allowed_by"
                                                                value="both"
                                                                checked={data.allowed_by === 'both'}
                                                                onChange={(e) => setData('allowed_by', e.target.value)}
                                                                className="text-[#00895f] focus:ring-[#00895f]"
                                                            />
                                                            <span className="text-sm text-gray-700">Both (Email and Mobile)</span>
                                                        </label>
                                                    </div>
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
