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
import { Select, Switch, Upload, message } from 'antd';
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
    console.log("seminarData",seminar);
    const { props } = usePage();
    const { baseImagePath } = props;
    const isEditing = !!seminar;
    const [currentStep, setCurrentStep] = useState(1);

    const [speakersList, setSpeakersList] = useState([]);
    const [loadingSpeakers, setLoadingSpeakers] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [appBannerError, setAppBannerError] = useState(null);
    const [appSquareError, setAppSquareError] = useState(null);
    const [educationPartners, setEducationalPartners]= useState([]);

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
        image: null,
        s_image1: null,
        s_image2: null,
        currentStep:currentStep
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

    useEffect(()=>{
        fetchEducationalPartners();

    },[]);

    const fetchEducationalPartners=async()=>{
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

        // Create FormData object to handle file uploads
        const formData = new FormData();
        
        // Prepare html_json data for Step 3
        if (currentStep === 3) {
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
                                            </div>
                                        </div>
                                        <div className='col-span-2 grid grid-cols-3 gap-4'>
                                            <div>
                                            <InputLabel value="Featured Image (700 x 393, Max 1MB)" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300">
                                                <Upload
                                                    name="image"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    beforeUpload={(file) => {
                                                        // Validation for file type
                                                        const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
                                                        if (!isValidType) {
                                                            message.error('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed.');
                                                            return false;
                                                        }

                                                        // Validation for file size (max 1MB)
                                                        const isLt1M = file.size / 1024 / 1024 < 1;
                                                        if (!isLt1M) {
                                                            message.error('Image size must be less than 1MB.');
                                                            return false;
                                                        }

                                                        // Create preview
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            // Validate dimensions
                                                            const img = new Image();
                                                            img.src = e.target.result;
                                                            img.onload = () => {
                                                                if (img.width !== 700 || img.height !== 393) {
                                                                    message.error(`Featured Image dimensions must be exactly 700 x 393 pixels. Current: ${img.width} x ${img.height}`);
                                                                    return false;
                                                                }
                                                                setImagePreview(e.target.result);
                                                                setData('image', file);
                                                                setImageError(null);
                                                            };
                                                        };
                                                        reader.readAsDataURL(file);

                                                        return false; // Prevent automatic upload
                                                    }}
                                                    onRemove={() => {
                                                        setData('image', null);
                                                        setImagePreview(null);
                                                    }}
                                                >
                                                    {imagePreview ? (
                                                        <div className="relative w-full">
                                                            <img src={imagePreview} alt="Preview" className="mx-auto w-full h-[200px] rounded-md" />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setData('image', null);
                                                                    setImagePreview(null);
                                                                }}
                                                                className="rounded-md bg-red-600 px-2 py-1 text-white hover:bg-red-700 absolute right-1 top-1"
                                                            >
                                                                <i className="fa fa-trash h-3 w-3"></i>

                                                            </button>
                                                        </div>
                                                    ) : (
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
                                                            <div className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                                <i className="fa fa-upload mr-2"></i>
                                                                Upload Featured Image
                                                            </div>
                                                        </div>
                                                    )}
                                                </Upload>
                                            </div>
                                            {imageError && (
                                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                    <i className="fa fa-exclamation-circle"></i>
                                                    <span>{imageError}</span>
                                                </div>
                                            )}
                                            <InputError message={errors.image} className="mt-2" />
                                        </div>



                                        {/* App Banner */}
                                        <div>
                                            <InputLabel value="App Banner (640 x 360, Max 1MB)" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                <Upload
                                                    name="s_image1"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    beforeUpload={(file) => {
                                                        // Validation for file type
                                                        const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
                                                        if (!isValidType) {
                                                            message.error('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed.');
                                                            return false;
                                                        }
                                                        
                                                        // Validation for file size (max 1MB)
                                                        const isLt1M = file.size / 1024 / 1024 < 1;
                                                        if (!isLt1M) {
                                                            message.error('Image size must be less than 1MB.');
                                                            return false;
                                                        }
                                                        
                                                        // Create preview
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            // Validate dimensions
                                                            const img = new Image();
                                                            img.src = e.target.result;
                                                            img.onload = () => {
                                                                if (img.width !== 640 || img.height !== 360) {
                                                                    message.error(`App Banner dimensions must be exactly 640 x 360 pixels. Current: ${img.width} x ${img.height}`);
                                                                    return false;
                                                                }
                                                                setAppBannerPreview(e.target.result);
                                                                setData('s_image1', file);
                                                                setAppBannerError(null);
                                                            };
                                                        };
                                                        reader.readAsDataURL(file);
                                                        
                                                        return false; // Prevent automatic upload
                                                    }}
                                                    onRemove={() => {
                                                        setData('s_image1', null);
                                                        setAppBannerPreview(null);
                                                    }}
                                                >
                                                    {appBannerPreview ? (
                                                        <div className="relative">
                                                            <img src={appBannerPreview} alt="App Banner" className="mx-auto max-h-32 rounded-md" />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setData('s_image1', null);
                                                                    setAppBannerPreview(null);
                                                                }}
                                                                className="mt-2 text-xs text-red-600 hover:text-red-800"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <p className="mb-2 text-xs text-gray-500">640 x 360 pixels</p>
                                                            <div className="cursor-pointer rounded-md bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700">
                                                                Upload
                                                            </div>
                                                        </div>
                                                    )}
                                                </Upload>
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
                                        ← Previous
                                    </SecondaryButton>
                                    
                                    {currentStep < 3 ? (
                                        <PrimaryButton 
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Save & Continue →
                                        </PrimaryButton>
                                    ) : (
                                        <PrimaryButton 
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={processing}
                                        >
                                            {isEditing ? 'Update Seminar' : 'Create Seminar'}
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