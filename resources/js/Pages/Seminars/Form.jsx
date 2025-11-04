import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import RichTextEditor from '@/Components/RichTextEditor';
import AddCourseStep3 from '@/Components/AddCourseStep3';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Select, Switch, message } from 'antd';
import { getSeminarImageUrl } from '@/Utils/imageHelper';
import UploadCard from '@/Components/UploadCard';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';

// Helper function to format datetime for datetime-local input
const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';

    // Parse the datetime string (assuming format: 'YYYY-MM-DD HH:MM:SS')
    const date = new Date(dateTimeString.replace(' ', 'T'));

    if (isNaN(date.getTime())) return '';

    // Format as 'YYYY-MM-DDTHH:MM' for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to convert participants data to the required structure
const convertParticipantsToIds = (participants) => {
    if (!participants || !Array.isArray(participants)) return [];

    // If it's already an array of IDs, return as is
    if (participants.length > 0 && typeof participants[0] === 'string') {
        return participants;
    }

    // If it's an array of objects with user_id, extract the IDs
    if (participants.length > 0 && typeof participants[0] === 'object' && participants[0].user_id) {
        return participants.map(p => p.user_id);
    }

    return [];
};

export default function Form({ seminar, specialities }) {
    console.log("seminarData", seminar);
    const { props } = usePage();
    const { baseImagePath } = props;
    const isEditing = !!seminar;
    const [currentStep, setCurrentStep] = useState(1);

    const [speakersList, setSpeakersList] = useState([]);
    const [loadingSpeakers, setLoadingSpeakers] = useState(false);
    const [educationPartners, setEducationalPartners] = useState([]);

    const { data, setData, post, put, errors, processing } = useForm({
        seminar_id: seminar?.id || '',
        seminar_title: seminar?.seminar_title || '',
        custom_url: seminar?.custom_url || '',
        seminar_desc: seminar?.seminar_desc || '',
        stream_url: seminar?.stream_url || '',
        offline_url: seminar?.offline_url || '',
        video_status: seminar?.video_status || 'schedule',
        videoSource: seminar?.videoSource || 'youTube',
        schedule_timestamp: seminar?.schedule_timestamp ? formatDateTimeForInput(seminar.schedule_timestamp) : '',
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
        hasMCQ: seminar?.hasMCQ || 0,
        re_attempts: seminar?.re_attempts || 0,
        seminar_type: seminar?.seminar_type || '',
        poll_link: seminar?.poll_link || '',
        // Registration form configuration
        reg_title_enabled: seminar?.reg_title_enabled ?? false,
        reg_title_required: seminar?.reg_title_required ?? false,
        reg_title_options: seminar?.reg_title_options || ['Dr.', 'Mr.', 'Miss.', 'Mrs.'],
        reg_first_name_enabled: seminar?.reg_first_name_enabled ?? false,
        reg_first_name_required: seminar?.reg_first_name_required ?? false,
        reg_last_name_enabled: seminar?.reg_last_name_enabled ?? false,
        reg_last_name_required: seminar?.reg_last_name_required ?? false,
        reg_email_enabled: seminar?.reg_email_enabled ?? false,
        reg_email_required: seminar?.reg_email_required ?? false,
        reg_mobile_enabled: seminar?.reg_mobile_enabled ?? false,
        reg_mobile_required: seminar?.reg_mobile_required ?? false,
        reg_city_enabled: seminar?.reg_city_enabled ?? false,
        reg_city_required: seminar?.reg_city_required ?? false,
        reg_state_enabled: seminar?.reg_state_enabled ?? false,
        reg_state_required: seminar?.reg_state_required ?? false,
        reg_specialty_enabled: seminar?.reg_specialty_enabled ?? false,
        reg_specialty_required: seminar?.reg_specialty_required ?? false,
        reg_specialty_options: seminar?.reg_specialty_options || [],
        reg_medical_reg_enabled: seminar?.reg_medical_reg_enabled ?? false,
        reg_medical_reg_required: seminar?.reg_medical_reg_required ?? false,
        reg_medical_council_enabled: seminar?.reg_medical_council_enabled ?? false,
        reg_medical_council_required: seminar?.reg_medical_council_required ?? false,
        reg_profession_enabled: seminar?.reg_profession_enabled ?? false,
        reg_profession_required: seminar?.reg_profession_required ?? false,
        reg_drl_code_enabled: seminar?.reg_drl_code_enabled ?? false,
        reg_drl_code_required: seminar?.reg_drl_code_required ?? false,
        reg_country_enabled: seminar?.reg_country_enabled ?? false,
        reg_country_required: seminar?.reg_country_required ?? false,
        note_text: seminar?.note_text || '',
        left_text: seminar?.left_text || '',
        theme_color: seminar?.theme_color || '#5d9cec',
        allowed_by: seminar?.allowed_by || 'email',
        // Banner images from html_json
        invite_banner: seminar?.invite_banner || '',
        responsive_invite_banner: seminar?.responsive_invite_banner || '',
        timezone_banner: seminar?.timezone_banner || '',
        responsive_timezone_banner: seminar?.responsive_timezone_banner || '',
        certificate: seminar?.certificate || '',
        video_banner: seminar?.video_banner || '',
        strip_banner: seminar?.strip_banner || '',
        ads_banner: seminar?.ads_banner || '',
        // Participants - convert to IDs only
        moderators: convertParticipantsToIds(seminar?.moderators) || [],
        panelists: convertParticipantsToIds(seminar?.panelists) || [],
        speakers: convertParticipantsToIds(seminar?.speakers) || [],
        chief_guests: convertParticipantsToIds(seminar?.chief_guests) || [],
        image: seminar?.video_image || null,
        s_image1: seminar?.s_image1 || null,
        s_image2: seminar?.s_image2 || null,
        currentStep: currentStep
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

    // Banner image previews from html_json
    const [inviteBannerPreview, setInviteBannerPreview] = useState(seminar?.invite_banner || ''
    );
    const [videoBannerPreview, setVideoBannerPreview] = useState(
        seminar?.video_banner || ''
    );
    const [stripBannerPreview, setStripBannerPreview] = useState(
        seminar?.strip_banner || ''
    );
    const [responsiveInviteBannerPreview, setResponsiveInviteBannerPreview] = useState(
        seminar?.responsive_invite_banner || ''
    );
    const [timezoneBannerPreview, setTimezoneBannerPreview] = useState(
        seminar?.timezone_banner || ''
    );
    const [responsiveTimezoneBannerPreview, setResponsiveTimezoneBannerPreview] = useState(
        seminar?.responsive_timezone_banner || ''
    );
    const [certificatePreview, setCertificatePreview] = useState(
        seminar?.certificate || ''
    );
    const [adsBannerPreview, setAdsBannerPreview] = useState(
        seminar?.ads_banner || ''
    );

    useEffect(() => {
        // Fetch speakers from API
        const fetchSpeakers = async () => {
            setLoadingSpeakers(true);
            try {
                const response = await fetch('/api/seminar-speakers');
                const data = await response.json();
                setSpeakersList(data);
            } catch (error) {
                console.error('Error fetching speakers:', error);
            } finally {
                setLoadingSpeakers(false);
            }
        };

        fetchSpeakers();
    }, []);

    useEffect(() => {
        fetchEducationalPartners();

    }, []);

    const fetchEducationalPartners = async () => {
        setLoadingSpeakers(true);
        try {
            const response = await fetch('/api/education-partners');
            const data = await response.json();
            setEducationalPartners(data);
        } catch (error) {
            console.error('Error fetching speakers:', error);
        } finally {
            setLoadingSpeakers(false);
        }
    }

    const webcastSpeakers = (speakers) => {
        return speakers.map((speaker) => speaker.user_id);
    }

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

    // Handle image change for Featured Image
    const handleImageChange = (file) => {
        setData('image', file);
        if (file && file instanceof File) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle image removal for Featured Image
    const handleRemoveImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    // Handle image change for App Banner
    const handleAppBannerChange = (file) => {
        setData('s_image1', file);
        if (file && file instanceof File) {
            setAppBannerPreview(URL.createObjectURL(file));
        }
    };

    // Handle image removal for App Banner
    const handleRemoveAppBanner = () => {
        setData('s_image1', null);
        setAppBannerPreview(null);
    };

    // Handle image change for App Square
    const handleAppSquareChange = (file) => {
        setData('s_image2', file);
        if (file && file instanceof File) {
            setAppSquarePreview(URL.createObjectURL(file));
        }
    };

    // Handle image removal for App Square
    const handleRemoveAppSquare = () => {
        setData('s_image2', null);
        setAppSquarePreview(null);
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

        // Create FormData object to handle file uploads
        const formData = new FormData();
        
        // Prepare html_json data for Step 3
        // Always prepare html_json data if we've reached step 3 at any point
        if (currentStep === 3 || data.currentStep === 3) {
            const htmlJsonData = {
                // Registration fields configuration
                title: data.reg_title_enabled ? {
                    required: data.reg_title_required ? "1" : "0",
                    titles: data.reg_title_options
                } : {},
                first_name: data.reg_first_name_enabled ? {
                    required: data.reg_first_name_required ? "1" : "0"
                } : {},
                last_name: data.reg_last_name_enabled ? {
                    required: data.reg_last_name_required ? "1" : "0"
                } : {},
                email: data.reg_email_enabled ? {
                    required: data.reg_email_required ? "1" : "0"
                } : {},
                mobile: data.reg_mobile_enabled ? {
                    required: data.reg_mobile_required ? "1" : "0"
                } : {},
                city: data.reg_city_enabled ? {
                    required: data.reg_city_required ? "1" : "0"
                } : {},
                state: data.reg_state_enabled ? {
                    required: data.reg_state_required ? "1" : "0"
                } : {},
                specialty: data.reg_specialty_enabled ? {
                    required: data.reg_specialty_required ? "1" : "0",
                    specialities: data.reg_specialty_options
                } : {},
                medical_regisration_no: data.reg_medical_reg_enabled ? {
                    required: data.reg_medical_reg_required ? "1" : "0"
                } : {},
                medical_council: data.reg_medical_council_enabled ? {
                    required: data.reg_medical_council_required ? "1" : "0"
                } : {},
                profession: data.reg_profession_enabled ? {
                    required: data.reg_profession_required ? "1" : "0"
                } : {},
                drl_code: data.reg_drl_code_enabled ? {
                    required: data.reg_drl_code_required ? "1" : "0"
                } : {},
                country: data.reg_country_enabled ? {
                    required: data.reg_country_required ? "1" : "0"
                } : {},
                // Additional text
                left_text: {
                    text: data.left_text || ""
                },
                note_text: {
                    text: data.note_text || ""
                },
                // Theme and registration settings
                theme_color: data.theme_color,
                allowed_by: data.allowed_by,
                // Participants - store as arrays of IDs
                moderators: data.moderators || [],
                panelists: data.panelists || [],
                speakers: data.speakers || [],
                chief_guests: data.chief_guests || []
            };
            
            // Add banner images to html_json if they exist
            if (data.invite_banner) htmlJsonData.invite_banner = data.invite_banner ? { url: data.invite_banner } : { url: "uploaded" };
            if (data.responsive_invite_banner) htmlJsonData.responsive_invite_banner = data.responsive_invite_banner ? { url: data.responsive_invite_banner } : { url: "uploaded" };
            if (data.timezone_banner) htmlJsonData.timezone_banner = data.timezone_banner ? { url: data.timezone_banner } : { url: "uploaded" };
            if (data.responsive_timezone_banner) htmlJsonData.responsive_timezone_banner = data.responsive_timezone_banner ? { url: data.responsive_timezone_banner } : { url: "uploaded" };
            if (data.certificate) htmlJsonData.certificate = data.certificate ? { url: data.certificate } : { url: "uploaded" };
            if (data.video_banner) htmlJsonData.video_banner = data.video_banner ? { url: data.video_banner } : { url: "uploaded" };
            if (data.strip_banner) htmlJsonData.strip_banner = data.strip_banner ? { url: data.strip_banner } : { url: "uploaded" };
            if (data.ads_banner) htmlJsonData.ads_banner = data.ads_banner ? { url: data.ads_banner } : { url: "uploaded" };
            
            formData.append('html_json', JSON.stringify(htmlJsonData));
        }
        
        // Add all data fields
        Object.keys(data).forEach(key => {
            if (key === 'invite_banner' || key === 'responsive_invite_banner' || 
                key === 'timezone_banner' || key === 'responsive_timezone_banner' || 
                key === 'certificate' || key === 'video_banner' || key === 'strip_banner' || key === 'ads_banner' ||
                key === 'image' || key === 's_image1' || key === 's_image2') {
                // Handle file uploads
                if (data[key]) {
                    formData.append(key, data[key]);
                }
            } else if (Array.isArray(data[key]) && key !== 'moderators' && key !== 'panelists' && key !== 'speakers' && key !== 'chief_guests') {
                // Handle array data (except participants which are handled in html_json)
                formData.append(key, JSON.stringify(data[key]));
            } else if (key !== 'html_json') {
                // Handle regular fields (html_json is handled separately)
                formData.append(key, data[key]);
            }
        });

        if (isEditing) {
            setData('currentStep', currentStep);
            post(route('seminars.updates', seminar.id), {
                data: formData,
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
                data: formData,
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
        console.log('Form submitted', data)

        // Create FormData object to handle file uploads
        const formData = new FormData();

        // Prepare html_json data for Step 3
        const htmlJsonData = {
            // Registration fields configuration
            title: data.reg_title_enabled ? {
                required: data.reg_title_required ? "1" : "0",
                titles: data.reg_title_options
            } : {},
            first_name: data.reg_first_name_enabled ? {
                required: data.reg_first_name_required ? "1" : "0"
            } : {},
            last_name: data.reg_last_name_enabled ? {
                required: data.reg_last_name_required ? "1" : "0"
            } : {},
            email: data.reg_email_enabled ? {
                required: data.reg_email_required ? "1" : "0"
            } : {},
            mobile: data.reg_mobile_enabled ? {
                required: data.reg_mobile_required ? "1" : "0"
            } : {},
            city: data.reg_city_enabled ? {
                required: data.reg_city_required ? "1" : "0"
            } : {},
            state: data.reg_state_enabled ? {
                required: data.reg_state_required ? "1" : "0"
            } : {},
            specialty: data.reg_specialty_enabled ? {
                required: data.reg_specialty_required ? "1" : "0",
                specialities: data.reg_specialty_options
            } : {},
            medical_regisration_no: data.reg_medical_reg_enabled ? {
                required: data.reg_medical_reg_required ? "1" : "0"
            } : {},
            medical_council: data.reg_medical_council_enabled ? {
                required: data.reg_medical_council_required ? "1" : "0"
            } : {},
            profession: data.reg_profession_enabled ? {
                required: data.reg_profession_required ? "1" : "0"
            } : {},
            drl_code: data.reg_drl_code_enabled ? {
                required: data.reg_drl_code_required ? "1" : "0"
            } : {},
            country: data.reg_country_enabled ? {
                required: data.reg_country_required ? "1" : "0"
            } : {},
            // Additional text
            left_text: {
                text: data.left_text || ""
            },
            note_text: {
                text: data.note_text || ""
            },
            // Theme and registration settings
            theme_color: data.theme_color,
            allowed_by: data.allowed_by,
            // Participants - store as arrays of IDs
            moderators: data.moderators || [],
            panelists: data.panelists || [],
            speakers: data.speakers || [],
            chief_guests: data.chief_guests || []
        };

        // Add banner images to html_json if they exist
        if (data.invite_banner) htmlJsonData.invite_banner = data.invite_banner ? { url: data.invite_banner } : { url: "uploaded" };
        if (data.responsive_invite_banner) htmlJsonData.responsive_invite_banner = data.responsive_invite_banner ? { url: data.responsive_invite_banner } : { url: "uploaded" };
        if (data.timezone_banner) htmlJsonData.timezone_banner = data.timezone_banner ? { url: data.timezone_banner } : { url: "uploaded" };
        if (data.responsive_timezone_banner) htmlJsonData.responsive_timezone_banner = data.responsive_timezone_banner ? { url: data.responsive_timezone_banner } : { url: "uploaded" };
        if (data.certificate) htmlJsonData.certificate = data.certificate ? { url: data.certificate } : { url: "uploaded" };
        if (data.video_banner) htmlJsonData.video_banner = data.video_banner ? { url: data.video_banner } : { url: "uploaded" };
        if (data.strip_banner) htmlJsonData.strip_banner = data.strip_banner ? { url: data.strip_banner } : { url: "uploaded" };
        if (data.ads_banner) htmlJsonData.ads_banner = data.ads_banner ? { url: data.ads_banner } : { url: "uploaded" };

        formData.append('html_json', JSON.stringify(htmlJsonData));

        // Add all data fields
        Object.keys(data).forEach(key => {
            if (key === 'invite_banner' || key === 'responsive_invite_banner' ||
                key === 'timezone_banner' || key === 'responsive_timezone_banner' ||
                key === 'certificate' || key === 'video_banner' || key === 'strip_banner' || key === 'ads_banner' ||
                key === 'image' || key === 's_image1' || key === 's_image2') {
                // Handle file uploads
                if (data[key]) {
                    formData.append(key, data[key]);
                }
            } else if (Array.isArray(data[key]) && key !== 'moderators' && key !== 'panelists' && key !== 'speakers' && key !== 'chief_guests') {
                // Handle array data (except participants which are handled in html_json)
                formData.append(key, JSON.stringify(data[key]));
            } else if (key !== 'html_json') {
                // Handle regular fields (html_json is handled separately)
                formData.append(key, data[key]);
            }
        });

        if (isEditing) {
            setData('currentStep', currentStep);
            post(route('seminars.updates', seminar.id), {
                data: formData,
                forceFormData: true,
                _method: 'PUT',
            });
        } else {
            post(route('seminars.store'), {
                data: formData,
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
                            <div className="mb-6 max-w-4xl mx-auto">
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
                                            <div className="grid grid-cols-3 gap-6">
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

                                                    <Select
                                                        options={[
                                                            { value: 'live', label: 'Live' },
                                                            { value: 'schedule', label: 'Scheduled' },
                                                            { value: 'archive', label: 'Archive' },
                                                            { value: 'new', label: 'New' },
                                                        ]}
                                                        value={data.video_status}
                                                        onChange={(value) => setData('video_status', value)}
                                                        placeholder="Select status"
                                                        error={errors.video_status}
                                                        size="large"
                                                        className="w-full"
                                                    />
                                                </div>
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
                                                <div >
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
                                                <div >
                                                    <InputLabel htmlFor="videoSource" value="Video Source *" />
                                                    <Select
                                                        options={[
                                                            { value: 'vimeo', label: 'Vimeo' },
                                                            { value: 'youTube', label: 'YouTube' },
                                                            { value: 'faceBook', label: 'Facebook' },
                                                            { value: 'mp4', label: 'MP4' },
                                                            { value: 'other', label: 'Other' },
                                                        ]}
                                                        value={data.videoSource}
                                                        onChange={(value) => setData('videoSource', value)}
                                                        placeholder="Select source"
                                                        error={errors.videoSource}
                                                        size="large"
                                                        className="w-full"
                                                    />
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
                                            </div>
                                        </div>
                                        <div className='col-span-2 grid grid-cols-3 gap-4'>
                                            {/* Featured Image */}
                                            <div>
                                                <InputLabel value="Featured Image (700 x 393, Max 1MB)" />
                                                <div className="mt-2">
                                                    <UploadCard
                                                        id="featured_image"
                                                        file={data.image}
                                                        onFileChange={handleImageChange}
                                                        onFileRemove={handleRemoveImage}
                                                        accept=".jpg,.jpeg,.png,.gif,.webp"
                                                        maxSize={1048576} // 1MB
                                                        dimensions={{ width: 700, height: 393 }}
                                                    />
                                                </div>
                                                <InputError message={errors.image} className="mt-2" />
                                            </div>

                                            {/* App Banner */}
                                            <div>
                                                <InputLabel value="App Banner (640 x 360, Max 1MB)" />
                                                <div className="mt-2">
                                                    <UploadCard
                                                        id="app_banner"
                                                        file={data.s_image1}
                                                        onFileChange={handleAppBannerChange}
                                                        onFileRemove={handleRemoveAppBanner}
                                                        accept=".jpg,.jpeg,.png,.gif,.webp"
                                                        maxSize={1048576} // 1MB
                                                        dimensions={{ width: 640, height: 360 }}
                                                    />
                                                </div>
                                                <InputError message={errors.s_image1} className="mt-2" />
                                            </div>

                                            {/* App Square */}
                                            <div>
                                                <InputLabel value="App Square (400 x 400, Max 1MB)" />
                                                <div className="mt-2">
                                                    <UploadCard
                                                        id="app_square"
                                                        file={data.s_image2}
                                                        onFileChange={handleAppSquareChange}
                                                        onFileRemove={handleRemoveAppSquare}
                                                        accept=".jpg,.jpeg,.png,.gif,.webp"
                                                        maxSize={1048576} // 1MB
                                                        dimensions={{ width: 400, height: 400 }}
                                                    />
                                                </div>
                                                <InputError message={errors.s_image2} className="mt-2" />
                                            </div>
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
                                                <InputLabel value="Add Speakers" />
                                                <Select
                                                    mode="multiple"
                                                    placeholder="Choose Speakers"
                                                    value={data.speakerids}
                                                    onChange={(value) => setData('speakerids', value)}
                                                    loading={loadingSpeakers}
                                                    options={speakersList}
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
                                                <InputLabel value="Add Speciality" />
                                                <Select
                                                    placeholder="Choose Speciality"
                                                    value={data.seminar_speciality}
                                                    onChange={(value) => setData('seminar_speciality', value)}
                                                    loading={loadingSpeakers}
                                                    options={specialities}
                                                    className="w-full"
                                                    style={{ width: '100%' }}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    optionFilterProp="label"
                                                    showSearch
                                                />
                                                <InputError message={errors.seminar_speciality} />

                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Registration Form Configuration */}
                                {currentStep === 3 && (
                                    <AddCourseStep3
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        speakersList={speakersList}
                                        loadingSpeakers={loadingSpeakers}
                                        specialities={specialities}
                                    />
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6">
                                    <SecondaryButton
                                        onClick={handlePrevious}
                                        disabled={currentStep === 1}
                                        type="button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                        </svg>
                                        Previous
                                    </SecondaryButton>

                                    {currentStep < 3 ? (
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Save & Continue <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                        </PrimaryButton>
                                    ) : (
                                        <PrimaryButton
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={processing}
                                        >
                                            Save
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                        </PrimaryButton>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}