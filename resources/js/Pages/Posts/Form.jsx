import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Input from '@/Components/Input';
import { LeftOutlined } from '@ant-design/icons';

import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Select, Switch, Upload } from 'antd';
import { getPostImageUrl } from '@/Utils/imageHelper';
import 'antd/dist/reset.css';
import '../../../css/antd-custom.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import UploadCard from '@/Components/UploadCard';
import { Button } from '@/Components/ui/button';

export default function Form({ post, specialities, relatedPostsOptions = [] }) {
    const { props } = usePage();
    const { baseImagePath } = props;
    const isEditing = !!post;

    // State for image validation errors
    const [imageValidationErrors, setImageValidationErrors] = useState({
        featuredThumbnail: '',
        SquareThumbnail: '',
        bannerImage: '',
        s_image1: ''
    });

    const [speakers, setSpeakers] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(post?.tags ? post?.tags.split(',') : []);

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
        article_language: post?.article_language || 'English',
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
                console.log('Tags data:', result); // For debugging
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

    // Function to validate image dimensions
    const validateImageDimensions = (file, expectedWidth, expectedHeight) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const { width, height } = img;
                if (width !== expectedWidth || height !== expectedHeight) {
                    reject(`Image dimensions must be exactly ${expectedWidth}x${expectedHeight}px. Current dimensions: ${width}x${height}px`);
                } else {
                    resolve();
                }
            };
            img.onerror = () => {
                reject('Invalid image file');
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Block submit if any image validation error
        if (imageValidationErrors.featuredThumbnail ||
            imageValidationErrors.SquareThumbnail ||
            imageValidationErrors.bannerImage ||
            imageValidationErrors.s_image1) {
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
                                    <LeftOutlined
                                        className="mr-1"
                                    /> Back to Posts
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

                                        {/* specialities */}
                                        <div>
                                            <InputLabel htmlFor="catagory1" value="Catagory1" />
                                            <Select
                                                id="catagory1"
                                                placeholder="Select speciality"
                                                value={data.catagory1}
                                                onChange={(value) => setData('catagory1', value)}
                                                options={specialities}
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
                                                options={specialities}
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
                                                options={specialities}
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

                                    <Card>
                                        <CardHeader>
                                            <CardTitle >Post Images</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                Upload images for your post. Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each)
                                            </p>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                                {/* Featured Image */}
                                                <div>
                                                    <InputLabel value="Featured Image (360x260px)" />
                                                    <Upload
                                                        name="featuredThumbnail"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                featuredThumbnail: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    featuredThumbnail: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    featuredThumbnail: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (360x260)
                                                            validateImageDimensions(file, 360, 260)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('featuredThumbnail', file);
                                                                    setImagePreview(URL.createObjectURL(file));
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        featuredThumbnail: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('featuredThumbnail', null);
                                                            setImagePreview(null);
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                featuredThumbnail: ''
                                                            }));
                                                        }}
                                                        fileList={imagePreview ? [{
                                                            uid: '-1',
                                                            name: data.featuredThumbnail?.name || post?.featuredThumbnail,
                                                            status: 'done',
                                                            url: imagePreview,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!imagePreview ? (
                                                            <UploadCard
                                                                title="Upload Featured Image"
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 360x260px"
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.featuredThumbnail && <InputError message={imageValidationErrors.featuredThumbnail} className="mt-2" />}
                                                </div>

                                                {/* Square Thumbnail */}
                                                <div>
                                                    <InputLabel value="Square Thumbnail (600x600px)" />
                                                    <Upload
                                                        name="SquareThumbnail"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                SquareThumbnail: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    SquareThumbnail: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    SquareThumbnail: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (600x600)
                                                            validateImageDimensions(file, 600, 600)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('SquareThumbnail', file);
                                                                    setSquarePreview(URL.createObjectURL(file));
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        SquareThumbnail: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('SquareThumbnail', null);
                                                            setSquarePreview(null);
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                SquareThumbnail: ''
                                                            }));
                                                        }}
                                                        fileList={squarePreview ? [{
                                                            uid: '-1',
                                                            name: data.SquareThumbnail?.name || post?.SquareThumbnail,
                                                            status: 'done',
                                                            url: squarePreview,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!squarePreview ? (
                                                            <UploadCard
                                                                title="Upload Square Thumbnail"
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 600x600px"
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.SquareThumbnail && <InputError message={imageValidationErrors.SquareThumbnail} className="mt-2" />}

                                                </div>

                                                {/* Banner Image */}
                                                <div>
                                                    <InputLabel value="Banner Image (1200x400px)" />
                                                    <Upload
                                                        name="bannerImage"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                bannerImage: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    bannerImage: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    bannerImage: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (1200x400)
                                                            validateImageDimensions(file, 1200, 400)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('bannerImage', file);
                                                                    setBannerPreview(URL.createObjectURL(file));
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        bannerImage: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('bannerImage', null);
                                                            setBannerPreview(null);
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                bannerImage: ''
                                                            }));
                                                        }}
                                                        fileList={bannerPreview ? [{
                                                            uid: '-1',
                                                            name: data.bannerImage?.name || post?.bannerImage,
                                                            status: 'done',
                                                            url: bannerPreview,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!bannerPreview ? (
                                                            <UploadCard
                                                                title="Upload Banner Image"
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 1200x400px"
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.bannerImage && <InputError message={imageValidationErrors.bannerImage} className="mt-2" />}

                                                </div>

                                                {/* App Image */}
                                                <div>
                                                    <InputLabel value="App Image (770x550px)" />
                                                    <Upload
                                                        name="s_image1"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                s_image1: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    s_image1: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    s_image1: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (770x550)
                                                            validateImageDimensions(file, 770, 550)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('s_image1', file);
                                                                    setAppImagePreview(URL.createObjectURL(file));
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        s_image1: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('s_image1', null);
                                                            setAppImagePreview(null);
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                s_image1: ''
                                                            }));
                                                        }}
                                                        fileList={appImagePreview ? [{
                                                            uid: '-1',
                                                            name: data.s_image1?.name || post?.s_image1,
                                                            status: 'done',
                                                            url: appImagePreview,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!appImagePreview ? (
                                                            <UploadCard
                                                                title="Upload App Image"
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 770x550px"
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.s_image1 && <InputError message={imageValidationErrors.s_image1} className="mt-2" />}

                                                </div>
                                            </div>

                                            {/* Related Posts */}
                                            <div>
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
                                            <div>
                                                <InputLabel value="Related Tags" />
                                                <Select
                                                    mode="tags"
                                                    size="large"
                                                    placeholder="Add tags (press Enter after each tag)"
                                                    value={data.tags}
                                                    onChange={(value) => setData('tags', value)}
                                                    className="w-full"
                                                    style={{ width: '100%' }}
                                                    options={tags.map(tag => ({
                                                        value: tag.label,
                                                        label: tag.label
                                                    }))}
                                                    optionFilterProp="label"
                                                    tokenSeparators={[',']}
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Add relevant tags to help categorize your post</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t pt-4">
                                    <Link
                                        href={route('posts.index')}
                                    >
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
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