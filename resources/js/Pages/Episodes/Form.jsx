import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function Form({ episode, sponsorPages }) {
    const isEditing = !!episode;
    const { baseImagePath } = usePage().props;

    const [speakers, setSpeakers] = useState([]);
    const [loadingSpeakers, setLoadingSpeakers] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [specialities, setSpecialities] = useState([]);   

    const { data, setData, post, put, errors, processing } = useForm({
        title: episode?.title || '',
        custom_url: episode?.custom_url || '',
        desc: episode?.desc || '',
        video_url: episode?.video_url || '',
        video_status: episode?.video_status || 'schedule',
        videoSource: episode?.videoSource || 'youTube',
        date_time: episode?.date_time || '',
        episode_type: episode?.episode_type || '',
        speakers_ids: episode?.speakers_ids ? (Array.isArray(episode.speakers_ids) ? episode.speakers_ids.map(id => String(id).trim()) : episode.speakers_ids.split(',').map(id => String(id.trim()))) : [],
        episode_no: episode?.episode_no || '',
        speciality_ids: episode?.speciality_id ? (Array.isArray(episode.speciality_id) ? episode.speciality_id.map(id => String(id).trim()) : episode.speciality_id.split(',').map(id => String(id.trim()))) : [],
        question_required: episode?.question_required || false,
        login_required: episode?.login_required || false,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        episode?.feature_image_banner
            ? getEpisodeImageUrl(episode.feature_image_banner, baseImagePath)
            : null
    );

    useEffect(() => {
        // Fetch speakers from API
        const fetchSpeakers = async () => {
            setLoadingSpeakers(true);
            try {
                const response = await fetch('/api/speakers');
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
        getSpecialities();
        function getSpecialities() {
            fetch('/api/specialities', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
                .then((response) => response.json())
                .then((data) => {
                    setSpecialities(data);
                })
                .catch((error) => {
                    console.error('Error fetching specialities:', error);
                });
        }
    }, []);
    useEffect(() => {
        // Auto-generate custom URL from title
        if (data.title && !isEditing) {
            const slug = data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            setData('custom_url', slug);
        }
    }, [data.title]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 1MB)
            const maxSize = 1 * 1024 * 1024; // 1MB in bytes
            if (file.size > maxSize) {
                setImageError('Image size must be less than 1MB');
                e.target.value = '';
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setImageError('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed.');
                e.target.value = '';
                return;
            }

            // Validate image dimensions (exactly 733 x 370)
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;
            
            img.onload = function () {
                // Clean up the object URL
                URL.revokeObjectURL(objectUrl);
                
                if (this.width !== 733 || this.height !== 370) {
                    setImageError(`Image dimensions must be exactly 733 x 370 pixels. Current: ${this.width} x ${this.height}`);
                    e.target.value = '';
                    return;
                }

                // All validations passed
                setImageError(null);
                setData('image', file);
                setImagePreview(URL.createObjectURL(file));
            };

            img.onerror = function () {
                URL.revokeObjectURL(objectUrl);
                setImageError('Failed to load image. Please try another file.');
                e.target.value = '';
            };
        }
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert arrays to comma-separated strings for backend
        const formData = {
            ...data,
            speakers_ids: Array.isArray(data.speakers_ids) ? data.speakers_ids.join(',') : data.speakers_ids,
            speciality_ids: Array.isArray(data.speciality_ids) ? data.speciality_ids.join(',') : data.speciality_ids,
        };

        if (isEditing) {
            post(route('episodes.updates', episode.id), {
                ...formData,
                forceFormData: true,
                _method: 'PUT',
            });
        } else {
            post(route('episodes.store'), {
                ...formData,
                forceFormData: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {isEditing ? 'Edit Episode' : 'Add Episode'}
                </h2>
            }
        >
            <Head title={isEditing ? 'Edit Episode' : 'Add Episode'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold">
                                    {isEditing ? 'EDIT EPISODE' : 'ADD EPISODE'}
                                </h4>
                                <Link
                                    href={route('episodes.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Episodes
                                </Link>
                            </div>

                            <hr className="my-4" />

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                   
                                        {/* Episode Type */}
                                        <div>
                                            <InputLabel htmlFor="episode_type" value="Type *" />
                                            <Select
                                                id="episode_type"
                                                placeholder="Select episode type"
                                                value={data.episode_type}
                                                onChange={(value) => setData('episode_type', value)}
                                                options={sponsorPages}
                                                icon="fa-th-large"
                                                searchable
                                                error={errors.episode_type}
                                                className="w-full mt-1 rounded-sm text-sm"
                                            />
                                        </div>

                                        {/* Episode No */}
                                        <div>
                                            <InputLabel htmlFor="episode_no" value="Episode No" />
                                            <Input
                                                id="episode_no"
                                                type="text"
                                                value={data.episode_no}
                                                onChange={(e) => setData('episode_no', e.target.value)}
                                                placeholder="Eg. Episode 999"
                                                icon="fa-hashtag"
                                                error={errors.episode_no}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                
                                            />
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <InputLabel htmlFor="title" value="Title *" />
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                                icon="fa-file-text"
                                                error={errors.title}
                                                placeholder="Enter episode title"
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>

                                        {/* Custom URL */}
                                        <div>
                                            <InputLabel htmlFor="custom_url" value="Custom URL *" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                value={data.custom_url}
                                                onChange={(e) =>
                                                    setData('custom_url', e.target.value.toLowerCase())
                                                }
                                                required
                                                icon="fa-link"
                                                error={errors.custom_url}
                                                placeholder="episode-custom-url"
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>

                                        {/* Speciality - Ant Design Multi-Select */}
                                        <div>
                                            <InputLabel htmlFor="speciality_ids" value="Speciality" />
                                            <Select
                                                mode="multiple"
                                                id="speciality_ids"
                                                className="mt-1 w-full text-sm rounded-sm"
                                                style={{ width: '100%' }}
                                                placeholder="Select specialities"
                                                value={data.speciality_ids}
                                                onChange={(value) => setData('speciality_ids', value)}
                                                size="large"
                                                showSearch
                                                filterOption={(input, option) => {
                                                    const label = option?.label ?? '';
                                                    const searchText = input.toLowerCase();
                                                    return label.toLowerCase().includes(searchText);
                                                }}
                                                optionFilterProp="label"
                                                labelInValue={false}
                                                options={specialities}
                                            />
                                           
                                            <InputError message={errors.speciality_ids} className="mt-2" />
                                        </div>
                                        {/* Question Required */}
                                        <div>
                                            <InputLabel
                                                htmlFor="question_required"
                                                value="Question Required"
                                            />
                                            
                                            
                                            <Dropdown
                                                options={[
                                                    { value: false, label: 'No' },
                                                    { value: true, label: 'Yes' },
                                                ]}
                                                value={data.question_required}
                                                onChange={(value) => setData('question_required', value)}
                                                icon="fa-question-circle"
                                                error={errors.question_required}
                                                size="lg"
                                            />
                                        </div>
                                        {/* Video Status */}
                                        <div>
                                            <InputLabel htmlFor="video_status" value="Video Status *" />
                                            <Select
                                                id="video_status"
                                                options={[
                                                    { value: 'live', label: 'Live' },
                                                    { value: 'schedule', label: 'Scheduled' },
                                                    { value: 'archive', label: 'Archive' },
                                                    { value: 'new', label: 'New' },
                                                ]}
                                                value={data.video_status}
                                                onChange={(value) => setData('video_status', value)}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                error={errors.video_status}
                                            />

                                           
                                        </div>

                                        {/* Video Source */}
                                        <div>
                                            <InputLabel htmlFor="videoSource" value="Video Source *" />
                                            <Select
                                                id="videoSource"
                                                options={[
                                                    { value: 'youTube', label: 'YouTube' },
                                                    { value: 'faceBook', label: 'Facebook' },
                                                    { value: 'mp4', label: 'MP4' },
                                                    { value: 'other', label: 'Other' }
                                                ]}
                                                value={data.videoSource}
                                                onChange={(value) => setData('videoSource', value)}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                error={errors.videoSource}
                                            />  
                                           
                                        </div>

                                        {/* Episode Date */}
                                        <div>
                                            <InputLabel htmlFor="date_time" value="Episode Date *" />
                                            <Input
                                                id="date_time"
                                                type="datetime-local"
                                                value={data.date_time}
                                                onChange={(e) => setData('date_time', e.target.value)}
                                                required
                                                icon="fa-calendar"
                                                error={errors.date_time}
                                                size="lg"
                                            />
                                        </div>

                                        {/* Speakers - Ant Design Multi-Select */}
                                        <div>
                                            <InputLabel htmlFor="speakers_ids" value="Speakers" />
                                            <Select
                                                mode="multiple"
                                                id="speakers_ids"
                                                className="mt-1 w-full text-sm"
                                                style={{ width: '100%' }}
                                                placeholder="Search and select speakers"
                                                value={data.speakers_ids}
                                                onChange={(value) => setData('speakers_ids', value)}
                                                loading={loadingSpeakers}
                                                size="large"
                                                showSearch
                                                filterOption={(input, option) => {
                                                    const label = option?.label ?? '';
                                                    const specialty = option?.specialty ?? '';
                                                    const searchText = input.toLowerCase();
                                                    return (
                                                        label.toLowerCase().includes(searchText) ||
                                                        specialty.toLowerCase().includes(searchText)
                                                    );
                                                }}
                                                optionFilterProp="label"
                                                labelInValue={false}
                                                fieldNames={{ label: 'label', value: 'value' }}
                                                options={speakers}
                                                optionRender={(option) => (
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{option.data.label}</div>
                                                            {option.data.specialty && (
                                                                <div className="text-xs text-gray-500">{option.data.specialty}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                maxTagCount="responsive"
                                                allowClear
                                            />
                                            <InputError message={errors.speakers_ids} className="mt-2" />
                                        </div>

                                        

                                        {/* Login Required */}
                                        <div>
                                            <InputLabel htmlFor="login_required" value="Login Required" />
                                            <Select
                                                id="login_required"
                                                options={[
                                                    { value: false, label: 'No' },
                                                    { value: true, label: 'Yes' },
                                                ]}
                                                value={data.login_required}
                                                onChange={(value) => setData('login_required', value)}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                error={errors.login_required}
                                                placeholder="Select login required"
                                            />
                                           
                                        </div>
                                         {/* Video URL */}
                                        <div>
                                            <InputLabel htmlFor="video_url" value="Video URL" />
                                            <Input
                                                id="video_url"
                                                type="text"
                                                value={data.video_url}
                                                onChange={(e) => setData('video_url', e.target.value)}
                                                icon="fa-youtube-play"
                                                error={errors.video_url}
                                                size="lg"
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>

                                        {/* Description - Rich Text Editor */}
                                        <div className='col-span-2'>
                                            <InputLabel htmlFor="desc" value="Description" />
                                            <RichTextEditor
                                                value={data.desc}
                                                onChange={(content) => setData('desc', content)}
                                                placeholder="Enter episode description with rich formatting..."
                                                error={errors.desc}
                                                height={300}
                                                className='mt-1'
                                            />
                                        </div>

                                        {/* Featured Image */}
                                        <div className='mt-8'>
                                            <InputLabel value="Featured Image (733 x 370, Max 1MB)" />
                                            <div className="mt-2">
                                                <Upload
                                                    accept=".png,.jpg,.jpeg,.gif,.webp"
                                                    showUploadList={false}
                                                    maxCount={1}
                                                    beforeUpload={file => {
                                                        const maxSize = 1 * 1024 * 1024; // 1MB
                                                        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                                                        if (!validTypes.includes(file.type)) {
                                                            message.error('Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed.');
                                                            return Upload.LIST_IGNORE;
                                                        }
                                                        if (file.size > maxSize) {
                                                            message.error('Image size must be less than 1MB.');
                                                            return Upload.LIST_IGNORE;
                                                        }
                                                        // Validate dimensions async
                                                        return new Promise(resolve => {
                                                            const img = new window.Image();
                                                            img.src = window.URL.createObjectURL(file);
                                                            img.onload = function() {
                                                                window.URL.revokeObjectURL(img.src);
                                                                if (img.width !== 733 || img.height !== 370) {
                                                                    message.error(`Image dimensions must be 733 x 370 pixels. Current: ${img.width} x ${img.height}`);
                                                                    resolve(Upload.LIST_IGNORE);
                                                                } else {
                                                                    setImageError(null);
                                                                    setData('image', file);
                                                                    setImagePreview(window.URL.createObjectURL(file));
                                                                    resolve(false); // Prevent auto-upload
                                                                }
                                                            };
                                                            img.onerror = function() {
                                                                message.error('Failed to load image. Please try another file.');
                                                                resolve(Upload.LIST_IGNORE);
                                                            };
                                                        });
                                                    }}
                                                >
                                                    {!imagePreview ? (
                                                        <button
                                                            type="button"
                                                            className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700 transition-colors inline-block"
                                                        >
                                                            <i className="fa fa-upload mr-2"></i> Upload Featured Image
                                                        </button>
                                                    ) : null}
                                                </Upload>
                                                {imagePreview && (
                                                    <div>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="mx-auto max-h-64 w-full object-contain rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveImage}
                                                            className="mt-3 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                                {imageError && (
                                                    <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                        <i className="fa fa-exclamation-circle"></i>
                                                        <span>{imageError}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <InputError message={errors.image} className="mt-2" />
                                    </div>
                                   
                                       

                                        
                                
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-between gap-4">
                                    <Link
                                        href={route('episodes.index')}
                                        className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {isEditing ? 'Update Episode' : 'Create Episode'}
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
