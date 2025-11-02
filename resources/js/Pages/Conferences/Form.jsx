import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Input from '@/Components/Input';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Select, Upload, message } from 'antd';
import { Plus, Upload as UploadIcon } from 'lucide-react';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';

const { Option } = Select;

export default function Form({ conference, speakers, specialities }) {
    const { props } = usePage();
    const isEditing = !!conference;
    
    const conferenceNames = [
        { value: 'update-across-specialities', label: 'Update across Specialities with Special reference to MOH and WHO guidelines on COVID-19' },
        { value: 'how-to-practice-post-the-lockdown-across-different-specialties', label: 'How to practice post the lockdown across different specialties' },
        { value: 'whats-new-in-last-6-months-across-specialties', label: "What's new in the last 6 months across different specialties" },
        { value: 'saluting-the-corona-warriors', label: 'Saluting The Corona Warriors' },
        { value: 'lighthouse-dr-kk-aggarwal-memorial-program', label: 'Lighthouse Dr KK aggarwal memorial program' },
        { value: '0-100-the-insulin-time-travel', label: '0 - 100 The Insulin Time Travel' },
        { value: 'diabetes-research-and-solutions-2022', label: 'DRS 2022' },
        { value: 'inasl-2023', label: 'INASL 2023' },
        { value: 'diabetes-research-and-solutions-2023', label: 'DRS 2023' },
        { value: '11th-wcpd', label: '11th WCPD 2024' },
        { value: 'best-of-rssdi-conference-2024', label: 'Best of Rssdi Conference 2024' },
        { value: 'best-of-apicon-conference-2025-kolkata', label: 'Best of APICON Conference 2025 Kolkata' },
        { value: 'best-of-pedicon-conference-2025-hyderabad', label: 'Best of PEDICON Conference 2025 Hyderabad' },
        { value: 'obesitas-2025', label: 'Obesitas 2025' },
        { value: 'obesitas-2025-midterm', label: 'Obesitas 2025 Midterm' }
    ];

    const { data, setData, post, put, errors, processing } = useForm({
        conference_id: conference?.id || '',
        conference_title: conference?.conference_title || '',
        conference_subtile: conference?.conference_subtile || '',
        conference_customURL: conference?.conference_customURL || '',
        conference_description: conference?.conference_description || '',
        conference_address: conference?.conference_address || '',
        conference_agenda: conference?.conference_agenda || '',
        conference_whyAttend: conference?.conference_whyAttend || '',
        conference_replay: conference?.conference_replay || '',
        stream_source: conference?.stream_source || 'youtube',
        conferenceName: conference?.conferenceName || '',
        hall: conference?.hall || '',
        status: conference?.status || 'schedule',
        conference_date: conference?.conference_date || '',
        conference_endDate: conference?.conference_endDate || '',
        conference_start_time: conference?.conference_start_time || '',
        conference_end_time: conference?.conference_end_time || '',
        speakerids: conference?.speakerids || [],
        search_specialty: conference?.speciality_id || [],
        image: null,
        frame_image: null,
    });

    const [showHalls, setShowHalls] = useState(data.conferenceName === 'diabetes-research-and-solutions-2023');
    const [featuredImagePreview, setFeaturedImagePreview] = useState(
        conference?.conference_banner ? `https://medtalks.in/conf_banner/${conference.conference_banner}` : null
    );
    const [frameImagePreview, setFrameImagePreview] = useState(
        conference?.frame_image ? `https://medtalks.in/conf_banner/${conference.frame_image}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('conferences.update', conference.id), {
                onSuccess: () => {
                    message.success('Conference updated successfully');
                },
                onError: (errors) => {
                    message.error('Failed to update conference');
                }
            });
        } else {
            post(route('conferences.store'), {
                onSuccess: () => {
                    message.success('Conference created successfully');
                },
                onError: (errors) => {
                    message.error('Failed to create conference');
                }
            });
        }
    };

    const handleConferenceNameChange = (value) => {
        setData('conferenceName', value);
        setShowHalls(value === 'diabetes-research-and-solutions-2023');
        if (value !== 'diabetes-research-and-solutions-2023') {
            setData('hall', '');
        }
    };

    const handleImageChange = (file, type) => {
        if (!file) return false;
        
        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }
        
        // Validate file size (2MB max)
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        
        // Set preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'featured') {
                setFeaturedImagePreview(e.target.result);
                setData('image', file);
            } else {
                setFrameImagePreview(e.target.result);
                setData('frame_image', file);
            }
        };
        reader.readAsDataURL(file);
        
        return false;
    };

    const removeImage = (type) => {
        if (type === 'featured') {
            setFeaturedImagePreview(null);
            setData('image', null);
        } else {
            setFrameImagePreview(null);
            setData('frame_image', null);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Conference" : "Create Conference"} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('conferences.index')} className="text-primary hover:underline">
                            ← Back to Conferences
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isEditing ? 'Edit Conference' : 'Create Conference'}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {isEditing ? 'Update the conference details below' : 'Fill in the details to create a new conference'}
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Conference Name */}
                                    <div>
                                        <InputLabel htmlFor="conferenceName" value="Conference Name *" />
                                        <Select
                                            id="conferenceName"
                                            value={data.conferenceName}
                                            onChange={handleConferenceNameChange}
                                            className="w-full"
                                            placeholder="Select Conference Name"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {conferenceNames.map((conf) => (
                                                <Option key={conf.value} value={conf.value}>
                                                    {conf.label}
                                                </Option>
                                            ))}
                                        </Select>
                                        <InputError message={errors.conferenceName} />
                                    </div>
                                    
                                    {/* Hall (only for DRS 2023) */}
                                    {showHalls && (
                                        <div>
                                            <InputLabel htmlFor="hall" value="Hall *" />
                                            <Input
                                                id="hall"
                                                type="text"
                                                value={data.hall}
                                                onChange={(e) => setData('hall', e.target.value)}
                                                className="w-full"
                                                placeholder="Enter hall name"
                                            />
                                            <InputError message={errors.hall} />
                                        </div>
                                    )}
                                    
                                    {/* Custom URL */}
                                    <div>
                                        <InputLabel htmlFor="conference_customURL" value="Custom URL *" />
                                        <Input
                                            id="conference_customURL"
                                            type="text"
                                            value={data.conference_customURL}
                                            onChange={(e) => setData('conference_customURL', e.target.value)}
                                            className="w-full"
                                            placeholder="Conference custom URL"
                                            required
                                        />
                                        <InputError message={errors.conference_customURL} />
                                    </div>
                                    
                                    {/* Subtitle */}
                                    <div>
                                        <InputLabel htmlFor="conference_subtile" value="Conference Subtitle" />
                                        <Input
                                            id="conference_subtile"
                                            type="text"
                                            value={data.conference_subtile}
                                            onChange={(e) => setData('conference_subtile', e.target.value)}
                                            className="w-full"
                                            placeholder="Conference subtitle"
                                        />
                                        <InputError message={errors.conference_subtile} />
                                    </div>
                                    
                                    {/* Replay URL */}
                                    <div>
                                        <InputLabel htmlFor="conference_replay" value="Conference Replay URL *" />
                                        <Input
                                            id="conference_replay"
                                            type="text"
                                            value={data.conference_replay}
                                            onChange={(e) => setData('conference_replay', e.target.value)}
                                            className="w-full"
                                            placeholder="Conference replay URL"
                                            required
                                        />
                                        <InputError message={errors.conference_replay} />
                                    </div>
                                    
                                    {/* Stream Source */}
                                    <div>
                                        <InputLabel htmlFor="stream_source" value="Stream Source *" />
                                        <Select
                                            id="stream_source"
                                            value={data.stream_source}
                                            onChange={(value) => setData('stream_source', value)}
                                            className="w-full"
                                            placeholder="Select Stream Source"
                                        >
                                            <Option value="youtube">YouTube</Option>
                                            <Option value="facebook">Facebook</Option>
                                            <Option value="s3Direct">S3 Direct</Option>
                                            <Option value="other">Other</Option>
                                        </Select>
                                        <InputError message={errors.stream_source} />
                                    </div>
                                    
                                    {/* Speakers */}
                                    <div>
                                        <InputLabel htmlFor="speakerids" value="Speakers" />
                                        <Select
                                            id="speakerids"
                                            mode="multiple"
                                            value={data.speakerids}
                                            onChange={(value) => setData('speakerids', value)}
                                            className="w-full"
                                            placeholder="Select speakers"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {speakers.map((speaker) => (
                                                <Option key={speaker.value} value={speaker.value}>
                                                    {speaker.label}
                                                </Option>
                                            ))}
                                        </Select>
                                        <InputError message={errors.speakerids} />
                                    </div>
                                    
                                    {/* Specialities */}
                                    <div>
                                        <InputLabel htmlFor="search_specialty" value="Specialities" />
                                        <Select
                                            id="search_specialty"
                                            mode="multiple"
                                            value={data.search_specialty}
                                            onChange={(value) => setData('search_specialty', value)}
                                            className="w-full"
                                            placeholder="Select specialities"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {specialities.map((speciality) => (
                                                <Option key={speciality.value} value={speciality.value}>
                                                    {speciality.label}
                                                </Option>
                                            ))}
                                        </Select>
                                        <InputError message={errors.search_specialty} />
                                    </div>
                                    
                                    {/* Address */}
                                    <div>
                                        <InputLabel htmlFor="conference_address" value="Conference Address" />
                                        <textarea
                                            id="conference_address"
                                            value={data.conference_address}
                                            onChange={(e) => setData('conference_address', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={4}
                                            placeholder="Conference address"
                                        />
                                        <InputError message={errors.conference_address} />
                                    </div>
                                    
                                    {/* Why Attend */}
                                    <div>
                                        <InputLabel htmlFor="conference_whyAttend" value="Why Attend" />
                                        <textarea
                                            id="conference_whyAttend"
                                            value={data.conference_whyAttend}
                                            onChange={(e) => setData('conference_whyAttend', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={4}
                                            placeholder="Why attend this conference"
                                        />
                                        <InputError message={errors.conference_whyAttend} />
                                    </div>
                                </div>
                                
                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <InputLabel htmlFor="conference_title" value="Conference Title *" />
                                        <Input
                                            id="conference_title"
                                            type="text"
                                            value={data.conference_title}
                                            onChange={(e) => setData('conference_title', e.target.value)}
                                            className="w-full"
                                            placeholder="Conference title"
                                            required
                                        />
                                        <InputError message={errors.conference_title} />
                                    </div>
                                    
                                    {/* Status */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Conference Status *" />
                                        <Select
                                            id="status"
                                            value={data.status}
                                            onChange={(value) => setData('status', value)}
                                            className="w-full"
                                            placeholder="Select Status"
                                        >
                                            <Option value="live">Live</Option>
                                            <Option value="schedule">Scheduled</Option>
                                            <Option value="archive">Archive</Option>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                    
                                    {/* Start Date */}
                                    <div>
                                        <InputLabel htmlFor="conference_date" value="Conference Start Date" />
                                        <Input
                                            id="conference_date"
                                            type="date"
                                            value={data.conference_date}
                                            onChange={(e) => setData('conference_date', e.target.value)}
                                            className="w-full"
                                        />
                                        <InputError message={errors.conference_date} />
                                    </div>
                                    
                                    {/* End Date */}
                                    <div>
                                        <InputLabel htmlFor="conference_endDate" value="Conference End Date" />
                                        <Input
                                            id="conference_endDate"
                                            type="date"
                                            value={data.conference_endDate}
                                            onChange={(e) => setData('conference_endDate', e.target.value)}
                                            className="w-full"
                                        />
                                        <InputError message={errors.conference_endDate} />
                                    </div>
                                    
                                    {/* Start Time */}
                                    <div>
                                        <InputLabel htmlFor="conference_start_time" value="Conference Start Time" />
                                        <Input
                                            id="conference_start_time"
                                            type="time"
                                            value={data.conference_start_time}
                                            onChange={(e) => setData('conference_start_time', e.target.value)}
                                            className="w-full"
                                        />
                                        <InputError message={errors.conference_start_time} />
                                    </div>
                                    
                                    {/* End Time */}
                                    <div>
                                        <InputLabel htmlFor="conference_end_time" value="Conference End Time" />
                                        <Input
                                            id="conference_end_time"
                                            type="time"
                                            value={data.conference_end_time}
                                            onChange={(e) => setData('conference_end_time', e.target.value)}
                                            className="w-full"
                                        />
                                        <InputError message={errors.conference_end_time} />
                                    </div>
                                    
                                    {/* Description */}
                                    <div>
                                        <InputLabel htmlFor="conference_description" value="Conference Description" />
                                        <textarea
                                            id="conference_description"
                                            value={data.conference_description}
                                            onChange={(e) => setData('conference_description', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={4}
                                            placeholder="Conference description"
                                        />
                                        <InputError message={errors.conference_description} />
                                    </div>
                                    
                                    {/* Agenda */}
                                    <div>
                                        <InputLabel htmlFor="conference_agenda" value="Conference Agenda" />
                                        <textarea
                                            id="conference_agenda"
                                            value={data.conference_agenda}
                                            onChange={(e) => setData('conference_agenda', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={4}
                                            placeholder="Conference agenda"
                                        />
                                        <InputError message={errors.conference_agenda} />
                                    </div>
                                    
                                    {/* Featured Image */}
                                    <div>
                                        <InputLabel value="Featured Image" />
                                        <div className="mt-1 flex items-center">
                                            {featuredImagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={featuredImagePreview}
                                                        alt="Featured"
                                                        className="h-40 w-40 object-cover rounded-md border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage('featured')}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <Plus className="h-3 w-3 rotate-45" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                                    <div className="space-y-1 text-center">
                                                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="flex text-sm text-gray-600">
                                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(e.target.files[0], 'featured')}
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.image} />
                                    </div>
                                    
                                    {/* Frame Image */}
                                    <div>
                                        <InputLabel value="Frame Image" />
                                        <div className="mt-1 flex items-center">
                                            {frameImagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={frameImagePreview}
                                                        alt="Frame"
                                                        className="h-40 w-40 object-cover rounded-md border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage('frame')}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <Plus className="h-3 w-3 rotate-45" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                                    <div className="space-y-1 text-center">
                                                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="flex text-sm text-gray-600">
                                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(e.target.files[0], 'frame')}
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.frame_image} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
                                <Link href={route('conferences.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex items-center"
                                >
                                    {processing && (
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                    )}
                                    {isEditing ? 'Update Conference' : 'Create Conference'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}