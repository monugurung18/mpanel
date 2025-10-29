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
import { Select, Switch, Upload } from 'antd';
import { getPostImageUrl } from '@/Utils/imageHelper';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';

export default function Form({ post, categories, specialities, relatedPostsOptions = [] }) {
    const { props } = usePage();
    const { baseImagePath } = props;
    const isEditing = !!post;

    const [imageError, setImageError] = useState(null);
    const [featuredError, setFeaturedError] = useState(null);
    const [squareError, setSquareError] = useState(null);
    const [bannerError, setBannerError] = useState(null);
    const [appError, setAppError] = useState(null);
    const [speakers, setSpeakers] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(post?.tags.split(',') || []);

    const [loadingTags, setLoadingTags] = useState(false);
    const [loadingSpeakers, setLoadingSpeakers] = useState(false);

    // Use the form object directly (so .transform/.post/.put bindings are intact)
    const form = useForm({
        articleID: post?.articleID || '',
        title: post?.title || '',
        custom_url: post?.custom_url || '',
        postType: post?.postType || 'FAQ',
        theContent: post?.theContent || '',
        transcript: post?.transcript || '',
        videoLink: post?.videoLink || '',
        linkType: post?.linkType || '',
        catagory1: post?.catagory1 || '',
        catagory2: post?.catagory2 || '',
        catagory3: post?.catagory3 || '',
        diseaseRelations: post?.diseaseRelations || '',
        author1: post?.author1 || '',
        article_language: post?.article_language || '',
        status: post?.status || 'published',
        isFeatured: !!post?.isFeatured,
        post_date: post?.post_date
            ? (typeof post.post_date === 'string' ? post.post_date.slice(0, 16).replace(' ', 'T') : '')
            : '',
        featuredThumbnail: null,
        SquareThumbnail: null,
        bannerImage: null,
        s_image1: null,
        alt_image: post?.alt_image || '',
        related_post_id: Array.isArray(post?.related_post_id)
            ? post.related_post_id.map(v => String(v))
            : post?.related_post_id
                ? String(post.related_post_id).split(',').map(v => v.trim()).filter(v => v)
                : [],
        seo_pageTitle: post?.seo_pageTitle || '',
        seo_metaDesctiption: post?.seo_metaDesctiption || '',
        seo_metaKeywords: post?.seo_metaKeywords || '',
        seo_canonical: post?.seo_canonical || '',
        tags: post?.tags ? (Array.isArray(post.tags) ? post.tags : post.tags.split(',').filter(t => t)) : [],
    });

    const { data, setData, errors, processing } = form;

    const [imagePreview, setImagePreview] = useState(
        post?.featuredThumbnail ? getPostImageUrl(post.featuredThumbnail, baseImagePath) : null
    );
    const [squarePreview, setSquarePreview] = useState(
        post?.SquareThumbnail ? getPostImageUrl(post.SquareThumbnail, baseImagePath) : null
    );
    const [bannerPreview, setBannerPreview] = useState(
        post?.bannerImage ? getPostImageUrl(post.bannerImage, baseImagePath) : null
    );
    const [appImagePreview, setAppImagePreview] = useState(
        post?.s_image1 ? getPostImageUrl(post.s_image1, baseImagePath) : null
    );

    // Auto-generate slug for create
    useEffect(() => {
        if (data.title && !isEditing) {
            const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            setData('custom_url', slug);
        }
    }, [data.title, isEditing, setData]);

    // Fetch speakers
    useEffect(() => {
        const fetchSpeakers = async () => {
            setLoadingSpeakers(true);
            try {
                const response = await fetch('/api/speakers');
                const result = await response.json();
                setSpeakers(result);
            } catch (error) {
                console.error('Error fetching speakers:', error);
            } finally {
                setLoadingSpeakers(false);
            }
        };
        fetchSpeakers();
    }, []);

    //Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tags');
                const result = await response.json();
                setTags(result);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    // Auto-fill SEO title
    useEffect(() => {
        if (data.title && !data.seo_pageTitle) {
            setData('seo_pageTitle', data.title);
        }
    }, [data.title, data.seo_pageTitle, setData]);

    // Default post_date on create
    useEffect(() => {
        if (!isEditing && !data.post_date) {
            const pad = (n) => String(n).padStart(2, '0');
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            const hh = pad(d.getHours());
            const mi = pad(d.getMinutes());
            setData('post_date', `${yyyy}-${mm}-${dd}T${hh}:${mi}`);
        }
    }, [isEditing, data.post_date, setData]);

    const setErrorForField = (field, message) => {
        setImageError(message);
        if (field === 'featuredThumbnail') setFeaturedError(message);
        if (field === 'SquareThumbnail') setSquareError(message);
        if (field === 'bannerImage') setBannerError(message);
        if (field === 's_image1') setAppError(message);
    };

    const clearErrorForField = (field) => {
        setImageError(null);
        if (field === 'featuredThumbnail') setFeaturedError(null);
        if (field === 'SquareThumbnail') setSquareError(null);
        if (field === 'bannerImage') setBannerError(null);
        if (field === 's_image1') setAppError(null);
    };

    const handleImageChange = (e, field = 'featuredThumbnail') => {
        const file = e.target.files?.[0];
        if (!file) return;

        clearErrorForField(field);

        // Size <= 1MB
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrorForField(field, 'Image size must be less than 1MB');
            e.target.value = '';
            return;
        }

        // Type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrorForField(field, 'Only JPG, JPEG, PNG, GIF, or WEBP are allowed.');
            e.target.value = '';
            return;
        }

        // Dimension checks per field
        const requiredSizes = {
            featuredThumbnail: { w: 360, h: 260, label: 'Featured Article Image' },
            SquareThumbnail: { w: 600, h: 600, label: 'Square Thumbnail' },
            bannerImage: { w: 1200, h: 400, label: 'Banner Image' },
            s_image1: { w: 770, h: 550, label: 'App Image' },
        };

        const cfg = requiredSizes[field] || null;

        const applyFile = () => {
            clearErrorForField(field);
            setData(field, file);

            const url = URL.createObjectURL(file);
            if (field === 'featuredThumbnail') setImagePreview(url);
            if (field === 'SquareThumbnail') setSquarePreview(url);
            if (field === 'bannerImage') setBannerPreview(url);
            if (field === 's_image1') setAppImagePreview(url);
        };

        if (!cfg) {
            applyFile();
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        img.onload = function () {
            URL.revokeObjectURL(objectUrl);
            if (this.width !== cfg.w || this.height !== cfg.h) {
                setErrorForField(
                    field,
                    `${cfg.label} must be exactly ${cfg.w} x ${cfg.h} px. Current: ${this.width} x ${this.height}`
                );
                e.target.value = '';
                return;
            }
            applyFile();
        };
        img.onerror = function () {
            URL.revokeObjectURL(objectUrl);
            setErrorForField(field, 'Failed to load image. Please try another file.');
            e.target.value = '';
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Block submit if any image validation error
        if (featuredError || squareError || bannerError || appError) {
            console.error('Image validation errors prevent submission');
            return;
        }

        // Ensure all required fields are present
        if (!data.title || !data.custom_url || !data.theContent || !data.status || !data.post_date) {
            console.error('Required fields are missing');
            return;
        }

        // Prepare the data for submission
        const submitData = {
            ...data,
            isFeatured: data.isFeatured ? 1 : 0,
            tags: Array.isArray(data.tags) ? data.tags : [],
            related_post_id: Array.isArray(data.related_post_id) ? data.related_post_id : [],
        };

        // Remove file fields that are not File objects
        const fileFields = ['featuredThumbnail', 'SquareThumbnail', 'bannerImage', 's_image1'];
        fileFields.forEach(field => {
            if (!(data[field] instanceof File)) {
                delete submitData[field];
            }
        });

        const options = {
            forceFormData: true,
            onSuccess: () => console.log(isEditing ? 'Post updated successfully' : 'Post created successfully'),
            onError: (errs) => console.log('Validation errors:', errs),
        };

        console.log('Submitting data:', submitData);

        if (isEditing) {
            form.transform(() => submitData);
            console.log("test", submitData);
            form.post(route('posts.updates', post.articleID), options);
        } else {
            form.transform(() => submitData);
            form.post(route('posts.store'), options);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Post' : 'Add Post'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-lg font-bold">
                                    {isEditing ? 'EDIT POST' : 'ADD NEW POST'}
                                </h4>
                                <Link href={route('posts.index')} className="text-gray-600 hover:text-gray-900">
                                    ← Back to Posts
                                </Link>
                            </div>

                            <hr className="my-4" />

                            {Object.keys(errors).length > 0 && (
                                <div className="mb-4 rounded-md bg-red-50 border-l-4 border-red-500 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <i className="fa fa-exclamation-circle text-red-400"></i>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <ul className="list-disc list-inside space-y-1">
                                                    {Object.entries(errors).map(([field, message]) => (
                                                        <li key={field}>
                                                            <span className="font-semibold">{field}:</span> {message}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Content */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
                                        {/* Post Type */}
                                        <div className="lg:col-span-1">
                                            <InputLabel htmlFor="postType" value="Post Type" />
                                            <Select
                                                id="postType"
                                                placeholder="Select type"
                                                value={data.postType}
                                                onChange={(value) => setData('postType', value)}
                                                options={[
                                                    { value: 'FAQ', label: 'FAQ' },
                                                    { value: 'article', label: 'Article' },
                                                    { value: 'video', label: 'Video' },
                                                    { value: 'news', label: 'News' },
                                                ]}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                style={{ width: '100%' }}

                                            />
                                        </div>

                                        {/* Title */}
                                        <div className="lg:col-span-2">
                                            <InputLabel htmlFor="title" value="Post Title *" />
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                error={errors.title}
                                                icon="fa-heading"
                                                placeholder="Enter post title"
                                                className="w-full py-1.5 mt-1 text-sm"
                                                size="large"
                                            />
                                        </div>

                                        {/* Author */}
                                        <div>
                                            <InputLabel htmlFor="author1" value="Author Name" />
                                            <Select
                                                id="author1"
                                                placeholder="Select author"
                                                value={data.author1}
                                                onChange={(value) => setData('author1', value)}
                                                options={speakers}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                style={{ width: '100%' }}
                                            />
                                        </div>

                                        {/* Custom URL */}
                                        <div className="lg:col-span-2">
                                            <InputLabel htmlFor="custom_url" value="URL Slug *" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                value={data.custom_url}
                                                onChange={(e) => setData('custom_url', e.target.value.toLowerCase())}
                                                error={errors.custom_url}
                                                icon="fa-link"
                                                placeholder="url-slug"
                                                className="w-full py-1.5 mt-1 text-sm"

                                            />
                                        </div>

                                        {/* Article Language */}
                                        <div>
                                            <InputLabel htmlFor="article_language" value="Article Language" />
                                            <Select
                                                id="article_language"
                                                placeholder="Select language"
                                                value={data.article_language}
                                                onChange={(value) => setData('article_language', value)}
                                                options={[
                                                    { value: 'en', label: 'English' },
                                                    { value: 'hi', label: 'Hindi' },
                                                    { value: 'bn', label: 'Bengali' },
                                                    { value: 'te', label: 'Telugu' },
                                                    { value: 'ta', label: 'Tamil' },
                                                    { value: 'mr', label: 'Marathi' },
                                                    { value: 'gu', label: 'Gujarati' },
                                                    { value: 'pa', label: 'Punjabi' },
                                                    { value: 'kn', label: 'Kannada' },
                                                    { value: 'ml', label: 'Malayalam' },
                                                ]}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                style={{ width: '100%' }}
                                            />

                                        </div>

                                        {/* Categories */}
                                        <div>
                                            <InputLabel htmlFor="catagory1" value="Catagory1" />
                                            <Select
                                                id="catagory1"
                                                placeholder="Select speciality"
                                                value={data.catagory1}
                                                onChange={(value) => setData('catagory1', value)}
                                                options={categories}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="catagory2" value="Catagory2" />
                                            <Select
                                                id="catagory2"
                                                placeholder="Select speciality"
                                                value={data.catagory2}
                                                onChange={(value) => setData('catagory2', value)}
                                                options={categories}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="catagory3" value="Catagory3" />
                                            <Select
                                                id="catagory3"
                                                placeholder="Select speciality"
                                                value={data.catagory3}
                                                onChange={(value) => setData('catagory3', value)}
                                                options={categories}
                                                className="w-full mt-1 rounded-sm text-sm"
                                                style={{ width: '100%' }}
                                            />

                                        </div>

                                        {/* Video Link */}
                                        <div>
                                            <InputLabel htmlFor="videoLink" value="Video Link" />
                                            <Input
                                                id="videoLink"
                                                type="text"
                                                value={data.videoLink}
                                                onChange={(e) => setData('videoLink', e.target.value)}
                                                error={errors.videoLink}
                                                icon="fa-video-camera"
                                                placeholder="YouTube or video URL"

                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>

                                        {/* Schedule Date & Time */}
                                        <div>
                                            <InputLabel htmlFor="post_date" value="Schedule Date & Time *" />
                                            <Input
                                                id="post_date"
                                                type="datetime-local"
                                                value={data.post_date}
                                                onChange={(e) => setData('post_date', e.target.value)}
                                                error={errors.post_date}
                                                icon="fa-calendar"

                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>

                                        {/* Transcript */}
                                        <div className="lg:col-span-3">
                                            <InputLabel value="Transcript" />
                                            <RichTextEditor
                                                value={data.transcript}
                                                onChange={(content) => setData('transcript', content)}
                                                placeholder="Enter video transcript or summary"
                                                error={errors.transcript}
                                                height={150}
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="lg:col-span-3 mt-8">
                                            <InputLabel value="Post Content *" />
                                            <RichTextEditor
                                                value={data.theContent}
                                                onChange={(content) => setData('theContent', content)}
                                                placeholder="Write your post content here..."
                                                error={errors.theContent}
                                                height={400}
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Featured Toggle and Alt Text */}
                                        <div className="lg:col-span-1 mt-8">
                                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                <Switch
                                                    checked={data.isFeatured}
                                                    onChange={(checked) => setData('isFeatured', checked)}
                                                    style={{ backgroundColor: data.isFeatured ? '#00895f' : undefined }}
                                                />
                                                <div>
                                                    <InputLabel value="Featured Post" className="mb-0" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2 mt-8">
                                            <InputLabel htmlFor="alt_image" value="Image Alt Text" />
                                            <Input
                                                id="alt_image"
                                                type="text"
                                                value={data.alt_image}
                                                onChange={(e) => setData('alt_image', e.target.value)}
                                                error={errors.alt_image}
                                                icon="fa-comment"
                                                placeholder="Describe the image for accessibility"

                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Media & Images */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Media & Images</h3>
                                    <hr className="my-4" />

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        {/* Featured Image */}
                                        <div className="lg:col-span-1">
                                            <InputLabel value="Featured Image 360*260 (Max 1MB)" />
                                            <Upload
                                                name="featuredThumbnail"
                                                listType="picture-card"
                                                className="mt-2"
                                                showUploadList={false}
                                                beforeUpload={(file) => {
                                                    // Size validation (1MB max)
                                                    const isLt1M = file.size / 1024 / 1024 < 1;
                                                    if (!isLt1M) {
                                                        setErrorForField('featuredThumbnail', 'Image size must be less than 1MB');
                                                        return Upload.LIST_IGNORE;
                                                    }

                                                    // Type validation - only allow PNG, JPG, JPEG, and WEBP
                                                    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
                                                    if (!validTypes.includes(file.type)) {
                                                        setErrorForField('featuredThumbnail', 'Only PNG, JPG, JPEG, and WEBP files are allowed.');
                                                        return Upload.LIST_IGNORE;
                                                    }

                                                    // Clear previous errors
                                                    clearErrorForField('featuredThumbnail');

                                                    // Validate dimensions
                                                    const img = new Image();
                                                    const objectUrl = URL.createObjectURL(file);
                                                    img.src = objectUrl;

                                                    img.onload = function () {
                                                        URL.revokeObjectURL(objectUrl);
                                                        if (this.width !== 360 || this.height !== 260) {
                                                            setErrorForField(
                                                                'featuredThumbnail',
                                                                `Featured Article Image must be exactly 360 x 260 px. Current: ${this.width} x ${this.height}`
                                                            );
                                                            return;
                                                        }

                                                        // All validations passed
                                                        clearErrorForField('featuredThumbnail');
                                                        setData('featuredThumbnail', file);
                                                        setImagePreview(URL.createObjectURL(file));
                                                    };

                                                    img.onerror = function () {
                                                        URL.revokeObjectURL(objectUrl);
                                                        setErrorForField('featuredThumbnail', 'Failed to load image. Please try another file.');
                                                    };

                                                    // Return false to prevent automatic upload
                                                    return false;
                                                }}
                                                onRemove={() => {
                                                    setData('featuredThumbnail', null);
                                                    setImagePreview(null);
                                                    clearErrorForField('featuredThumbnail');
                                                    return true;
                                                }}
                                            >
                                                {imagePreview ? (
                                                    <div className="relative w-full h-[200px]">
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setData('featuredThumbnail', null);
                                                                setImagePreview(null);
                                                                clearErrorForField('featuredThumbnail');
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="mb-2">
                                                            <i className="fa fa-cloud-upload text-2xl text-gray-400"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-500">Upload Image (PNG, JPG, JPEG, WEBP)</p>
                                                    </div>
                                                )}
                                            </Upload>
                                            {featuredError && (
                                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                    <i className="fa fa-exclamation-circle"></i>
                                                    <span>{featuredError}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Square Thumbnail */}
                                        <div className="lg:col-span-1">
                                            <InputLabel value="Square Thumbnail 600*600 (Max 1MB)" />
                                            <Upload
                                                name="SquareThumbnail"
                                                listType="picture-card"
                                                className="mt-2"
                                                showUploadList={false}
                                                beforeUpload={(file) => {
                                                    // Size validation (1MB max)
                                                    const isLt1M = file.size / 1024 / 1024 < 1;
                                                    if (!isLt1M) {
                                                        setErrorForField('SquareThumbnail', 'Image size must be less than 1MB');
                                                        return Upload.LIST_IGNORE;
                                                    }

                                                    // Type validation - only allow PNG, JPG, JPEG, and WEBP
                                                    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
                                                    if (!validTypes.includes(file.type)) {
                                                        setErrorForField('SquareThumbnail', 'Only PNG, JPG, JPEG, and WEBP files are allowed.');
                                                        return Upload.LIST_IGNORE;
                                                    }

                                                    // Clear previous errors
                                                    clearErrorForField('SquareThumbnail');

                                                    // Validate dimensions
                                                    const img = new Image();
                                                    const objectUrl = URL.createObjectURL(file);
                                                    img.src = objectUrl;

                                                    img.onload = function () {
                                                        URL.revokeObjectURL(objectUrl);
                                                        if (this.width !== 600 || this.height !== 600) {
                                                            setErrorForField(
                                                                'SquareThumbnail',
                                                                `Square Thumbnail must be exactly 600 x 600 px. Current: ${this.width} x ${this.height}`
                                                            );
                                                            return;
                                                        }

                                                        // All validations passed
                                                        clearErrorForField('SquareThumbnail');
                                                        setData('SquareThumbnail', file);
                                                        setSquarePreview(URL.createObjectURL(file));
                                                    };

                                                    img.onerror = function () {
                                                        URL.revokeObjectURL(objectUrl);
                                                        setErrorForField('SquareThumbnail', 'Failed to load image. Please try another file.');
                                                    };

                                                    // Return false to prevent automatic upload
                                                    return false;
                                                }}
                                                onRemove={() => {
                                                    setData('SquareThumbnail', null);
                                                    setSquarePreview(null);
                                                    clearErrorForField('SquareThumbnail');
                                                    return true;
                                                }}
                                            >
                                                {squarePreview ? (
                                                    <div className="relative w-full">
                                                        <img src={squarePreview} alt="Square" className="w-full h-[200px] object-cover rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setData('SquareThumbnail', null);
                                                                setSquarePreview(null);
                                                                clearErrorForField('SquareThumbnail');
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full hover:bg-red-700 h-6 w-6"
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="mb-2">
                                                            <i className="fa fa-cloud-upload text-2xl text-gray-400"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-500">Upload Image (PNG, JPG, JPEG, WEBP)</p>
                                                    </div>
                                                )}
                                            </Upload>
                                            {squareError && (
                                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                    <i className="fa fa-exclamation-circle"></i>
                                                    <span>{squareError}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Banner Image */}
                                        <div className="lg:col-span-1">
                                            <InputLabel value="Banner Image 1200*400 (Max 1MB)" />
                                            <Upload
                                                name="bannerImage"
                                                listType="picture-card"
                                                className="mt-2"
                                                showUploadList={false}
                                                beforeUpload={(file) => {
                                                    // Size validation (1MB max)
                                                    const isLt1M = file.size / 1024 / 1024 < 1;
                                                    if (!isLt1M) {
                                                        setErrorForField('bannerImage', 'Image size must be less than 1MB');
                                                        return Upload.LIST_IGNORE;
                                                    }

                                                    // Type validation - only allow PNG, JPG, JPEG, and WEBP
                                                    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
                                                    if (!validTypes.includes(file.type)) {
                                                        setErrorForField('bannerImage', 'Only PNG, JPG, JPEG, and WEBP files are allowed.');
                                                        return Upload.LIST_IGNORE;
                                                    }

                                                    // Clear previous errors
                                                    clearErrorForField('bannerImage');

                                                    // Validate dimensions
                                                    const img = new Image();
                                                    const objectUrl = URL.createObjectURL(file);
                                                    img.src = objectUrl;

                                                    img.onload = function () {
                                                        URL.revokeObjectURL(objectUrl);
                                                        if (this.width !== 1200 || this.height !== 400) {
                                                            setErrorForField(
                                                                'bannerImage',
                                                                `Banner Image must be exactly 1200 x 400 px. Current: ${this.width} x ${this.height}`
                                                            );
                                                            return;
                                                        }

                                                        // All validations passed
                                                        clearErrorForField('bannerImage');
                                                        setData('bannerImage', file);
                                                        setBannerPreview(URL.createObjectURL(file));
                                                    };

                                                    img.onerror = function () {
                                                        URL.revokeObjectURL(objectUrl);
                                                        setErrorForField('bannerImage', 'Failed to load image. Please try another file.');
                                                    };

                                                    // Return false to prevent automatic upload
                                                    return false;
                                                }}
                                                onRemove={() => {
                                                    setData('bannerImage', null);
                                                    setBannerPreview(null);
                                                    clearErrorForField('bannerImage');
                                                    return true;
                                                }}
                                            >
                                                {bannerPreview ? (
                                                    <div className="relative w-full h-[200px]">
                                                        <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setData('bannerImage', null);
                                                                setBannerPreview(null);
                                                                clearErrorForField('bannerImage');
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full hover:bg-red-700 h-6 w-6"
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="mb-2">
                                                            <i className="fa fa-cloud-upload text-2xl text-gray-400"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-500">Upload Image (PNG, JPG, JPEG, WEBP)</p>
                                                    </div>
                                                )}
                                            </Upload>
                                            {bannerError && (
                                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                    <i className="fa fa-exclamation-circle"></i>
                                                    <span>{bannerError}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* App Image */}
                                        <div className="lg:col-span-1">
                                            <InputLabel value="App Image 770*550 (Max 1MB)" />
                                            <Upload
                                                name="s_image1"
                                                listType="picture-card"
                                                className="mt-2"
                                                showUploadList={false}
                                                beforeUpload={(file) => {
                                                    // Size validation (1MB max)
                                                    const isLt1M = file.size / 1024 / 1024 < 1;
                                                    if (!isLt1M) {
                                                        setErrorForField('s_image1', 'Image size must be less than 1MB');
                                                        return false;
                                                    }

                                                    // Type validation
                                                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                                                    if (!validTypes.includes(file.type)) {
                                                        setErrorForField('s_image1', 'Only JPG, JPEG, PNG, GIF, or WEBP are allowed.');
                                                        return false;
                                                    }

                                                    // Clear previous errors
                                                    clearErrorForField('s_image1');
                                                    return true;
                                                }}
                                                onChange={(info) => {
                                                    if (info.file.status === 'done') {
                                                        // Validate dimensions
                                                        const img = new Image();
                                                        const objectUrl = URL.createObjectURL(info.file.originFileObj);
                                                        img.src = objectUrl;
                                                        img.onload = function () {
                                                            URL.revokeObjectURL(objectUrl);
                                                            if (this.width !== 770 || this.height !== 550) {
                                                                setErrorForField(
                                                                    's_image1',
                                                                    `App Image must be exactly 770 x 550 px. Current: ${this.width} x ${this.height}`
                                                                );
                                                                // Clear the file
                                                                setData('s_image1', null);
                                                                setAppImagePreview(null);
                                                                return;
                                                            }

                                                            // All validations passed
                                                            clearErrorForField('s_image1');
                                                            setData('s_image1', info.file.originFileObj);
                                                            setAppImagePreview(URL.createObjectURL(info.file.originFileObj));
                                                        };
                                                        img.onerror = function () {
                                                            URL.revokeObjectURL(objectUrl);
                                                            setErrorForField('s_image1', 'Failed to load image. Please try another file.');
                                                        };
                                                    } else if (info.file.status === 'error') {
                                                        setErrorForField('s_image1', 'Upload failed. Please try again.');
                                                    }
                                                }}
                                                onRemove={() => {
                                                    setData('s_image1', null);
                                                    setAppImagePreview(null);
                                                    clearErrorForField('s_image1');
                                                }}
                                            >
                                                {appImagePreview ? (
                                                    <div className="relative w-full h-[200px]">
                                                        <img src={appImagePreview} alt="App" className="w-full h-full object-cover rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setData('s_image1', null);
                                                                setAppImagePreview(null);
                                                                clearErrorForField('s_image1');
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="mb-2">
                                                            <i className="fa fa-cloud-upload text-2xl text-gray-400"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-500">Upload Image</p>
                                                    </div>
                                                )}
                                            </Upload>
                                            {appError && (
                                                <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                    <i className="fa fa-exclamation-circle"></i>
                                                    <span>{appError}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Related Posts */}
                                        <div className="lg:col-span-2">
                                            <InputLabel value="Related Posts" />
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                placeholder="Search and select related posts"
                                                value={data.related_post_id}
                                                onChange={(value) => setData('related_post_id', value)}
                                                options={relatedPostsOptions}
                                                className="w-full"
                                                style={{ width: '100%' }}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                optionFilterProp="label"
                                                maxTagCount="responsive"
                                            />
                                        </div>

                                        {/* Related Tags */}
                                        <div className="lg:col-span-2">
                                            <InputLabel value="Related Tags" />
                                            <Select
                                                mode="tags"
                                                size="large"
                                                placeholder="Add tags (press Enter after each tag)"
                                                value={selectedTags}
                                                onChange={(value) => setData('tags', value)}
                                                className="w-full"
                                                style={{ width: '100%' }}
                                                options={tags}
                                                optionFilterProp="label"
                                                tokenSeparators={[',']}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Add relevant tags to help categorize your post</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t pt-4">
                                    <Link
                                        href={route('posts.index')}
                                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>

                                    {/* Make sure this is a submit button */}
                                    <PrimaryButton type="submit" processing={processing}>
                                        {isEditing ? 'Update Post' : 'Create Post'}
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
