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
    const [loadingSpeakers, setLoadingSpeakers] = useState(false);

    const { data, setData, post: submitPost, put: submitPut, errors, processing } = useForm({
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
        isFeatured: post?.isFeatured ? true : false,
        post_date: post?.post_date ? (typeof post.post_date === 'string' ? post.post_date.slice(0, 16).replace(' ', 'T') : '') : '',
        featuredThumbnail: null,
        SquareThumbnail: null,
        bannerImage: null,
        s_image1: null,
        alt_image: post?.alt_image || '',
        related_post_id: Array.isArray(post?.related_post_id) ? post.related_post_id.map(v => String(v)) : [],
        seo_pageTitle: post?.seo_pageTitle || '',
        seo_metaDesctiption: post?.seo_metaDesctiption || '',
        seo_metaKeywords: post?.seo_metaKeywords || '',
        seo_canonical: post?.seo_canonical || '',
        tags: post?.tags ? post.tags.split(',').filter(t => t) : [],
    });

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
        // Auto-generate SEO title from title
        if (data.title && !data.seo_pageTitle) {
            setData('seo_pageTitle', data.title);
        }
    }, [data.title]);

    const handleImageChange = (e, field = 'featuredThumbnail') => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 1MB)
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrorForField(field, 'Image size must be less than 1MB');
            e.target.value = '';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrorForField(field, 'Only JPG, JPEG, PNG, GIF, or WEBP are allowed.');
            e.target.value = '';
            return;
        }

        // Validate dimensions per field
        const requiredSizes = {
            featuredThumbnail: { w: 360, h: 260, label: 'Featured Article Image' },
            SquareThumbnail: { w: 600, h: 600, label: 'Square Thumbnail' },
            bannerImage: { w: 1200, h: 400, label: 'Banner Image' },
            s_image1: { w: 770, h: 550, label: 'App Image' },
        };

        const cfg = requiredSizes[field] || null;
        if (cfg) {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;
            img.onload = function () {
                URL.revokeObjectURL(objectUrl);
                if (this.width !== cfg.w || this.height !== cfg.h) {
                    setErrorForField(field, `${cfg.label} must be exactly ${cfg.w} x ${cfg.h} px. Current: ${this.width} x ${this.height}`);
                    e.target.value = '';
                    return;
                }

                // All validations passed
                clearErrorForField(field);
                setData(field, file);
                if (field === 'featuredThumbnail') setImagePreview(URL.createObjectURL(file));
                if (field === 'SquareThumbnail') setSquarePreview(URL.createObjectURL(file));
                if (field === 'bannerImage') setBannerPreview(URL.createObjectURL(file));
                if (field === 's_image1') setAppImagePreview(URL.createObjectURL(file));
            };
            img.onerror = function () {
                URL.revokeObjectURL(objectUrl);
                setErrorForField(field, 'Failed to load image. Please try another file.');
                e.target.value = '';
            };
            return;
        }

        // Fallback (no cfg): accept
        clearErrorForField(field);
        setData(field, file);
        if (field === 'featuredThumbnail') setImagePreview(URL.createObjectURL(file));
        if (field === 'SquareThumbnail') setSquarePreview(URL.createObjectURL(file));
        if (field === 'bannerImage') setBannerPreview(URL.createObjectURL(file));
        if (field === 's_image1') setAppImagePreview(URL.createObjectURL(file));
    };

    const setErrorForField = (field, message) => {
        console.log(field, message);
        setImageError(message);
        if (field == 'featuredThumbnail') setFeaturedError(message);
        if (field == 'SquareThumbnail') setSquareError(message);
        if (field == 'bannerImage') setBannerError(message);
        if (field == 's_image1') setAppError(message);
    };

    const clearErrorForField = (field) => {
        setImageError(null);
        if (field === 'featuredThumbnail') setFeaturedError(null);
        if (field === 'SquareThumbnail') setSquareError(null);
        if (field === 'bannerImage') setBannerError(null);
        if (field === 's_image1') setAppError(null);
    };

    // Default post_date to now on create
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
    }, []);

    // Single-step form: no step navigation

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
        };

        if (isEditing) {
            submitPut(route('posts.update', post.articleID), {
                ...formData,
            }, {
                forceFormData: true,
            });
        } else {
            submitPost(route('posts.store'), {
                ...formData,
            }, {
                forceFormData: true,
            });
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
                                <Link
                                    href={route('posts.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Posts
                                </Link>
                            </div>

                            {/* Single-page form (no step wizard) */}

                            <hr className="my-4" />

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Content */}
                                <div className="space-y-6">
                                    

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                        {/* Post Type */}
                                        <div className="lg:col-span-1">
                                            <InputLabel htmlFor="postType" value="Post Type" />
                                            <Dropdown
                                                options={[
                                                    { value: 'FAQ', label: 'FAQ' },
                                                    { value: 'article', label: 'Article' },
                                                    { value: 'video', label: 'Video' },
                                                    { value: 'news', label: 'News' },
                                                ]}
                                                value={data.postType}
                                                onChange={(value) => setData('postType', value)}
                                                placeholder="Select type"
                                                icon="fa-file-text"
                                                error={errors.postType}
                                                size="lg"
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
                                                size="lg"
                                            />
                                        </div>
                                        {/* Author */}
                                        <div>
                                            <InputLabel htmlFor="author1" value="Author Name" />
                                            <Dropdown options={speakers} value={data.author1} onChange={(value) => setData('author1', value)} placeholder="Select author" icon="fa-user" size="lg" />

                                        </div>
                                        {/* Custom URL */}
                                        <div className='lg:col-span-2'>
                                            <InputLabel htmlFor="custom_url" value="URL Slug *" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                value={data.custom_url}
                                                onChange={(e) => setData('custom_url', e.target.value.toLowerCase())}
                                                error={errors.custom_url}
                                                icon="fa-link"
                                                placeholder="url-slug"
                                                size="lg"
                                            />
                                        </div>





                                        {/* Article Language */}
                                        <div>
                                            <InputLabel htmlFor="article_language" value="Article Language" />
                                            <Dropdown
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
                                                value={data.article_language}
                                                onChange={(value) => setData('article_language', value)}
                                                placeholder="Select language"
                                                icon="fa-language"
                                                size="lg"
                                            />
                                        </div>

                                        {/* (catagory1) */}
                                        <div>
                                            <InputLabel htmlFor="catagory1" value="Catagory1" />
                                            <Dropdown
                                                options={categories}
                                                value={data.catagory1}
                                                onChange={(value) => setData('catagory1', value)}
                                                placeholder="Select speciality"
                                                icon="fa-stethoscope"
                                                searchable
                                                error={errors.catagory1}
                                                size="lg"
                                            />
                                        </div>
                                        {/* (catagory2) */}
                                        <div>
                                            <InputLabel htmlFor="catagory2" value="Catagory2" />
                                            <Dropdown
                                                options={categories}
                                                value={data.catagory2}
                                                onChange={(value) => setData('catagory2', value)}
                                                placeholder="Select speciality"
                                                icon="fa-stethoscope"
                                                searchable
                                                error={errors.catagory2}
                                                size="lg"
                                            />
                                        </div>
                                        {/* (catagory3) */}
                                        <div>
                                            <InputLabel htmlFor="catagory3" value="Catagory3" />
                                            <Dropdown
                                                options={categories}
                                                value={data.catagory3}
                                                onChange={(value) => setData('catagory3', value)}
                                                placeholder="Select speciality"
                                                icon="fa-stethoscope"
                                                searchable
                                                error={errors.catagory3}
                                                size="lg"
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
                                                size="lg"
                                            />
                                        </div>


                                        {/* Schedule Date & Time */}
                                        <div >
                                            <InputLabel htmlFor="post_date" value="Schedule Date & Time *" />
                                            <Input
                                                id="post_date"
                                                type="datetime-local"
                                                value={data.post_date}
                                                onChange={(e) => setData('post_date', e.target.value)}
                                                error={errors.post_date}
                                                icon="fa-calendar"
                                                size="lg"
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
                                            />
                                        </div>




                                        {/* Featured Toggle */}
                                        <div className="lg:col-span-1 mt-6">
                                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                <Switch
                                                    checked={data.isFeatured}
                                                    onChange={(checked) => setData('isFeatured', checked)}
                                                    style={{
                                                        backgroundColor: data.isFeatured ? '#00895f' : undefined,
                                                    }}
                                                />
                                                <div>
                                                    <InputLabel value="Featured Post" className="mb-0" />
                                                  
                                                </div>
                                            </div>
                                        </div>
                                         {/* Image Alt Text */}
                                         <div className="lg:col-span-2 mt-6">
                                            <InputLabel htmlFor="alt_image" value="Image Alt Text" />
                                            <Input
                                                id="alt_image"
                                                type="text"
                                                value={data.alt_image}
                                                onChange={(e) => setData('alt_image', e.target.value)}
                                                error={errors.alt_image}
                                                icon="fa-comment"
                                                placeholder="Describe the image for accessibility"
                                                size="lg"
                                            />
                                           
                                        </div>
                                    </div>
                                </div>

                                {/* Media & Image */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Media & Images</h3>
                                    <hr className="my-4" />

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        {/* Featured Image */}
                                        <div className="lg:col-span-1">
                                            <InputLabel value="Featured Image 360*260 (Max 1MB)" />
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!imagePreview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Featured Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, PNG, GIF, or WEBP (Max 1MB)
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-emerald-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="mx-auto max-h-32 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setData('featuredThumbnail', null);
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
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-4">
                                                {!squarePreview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Square Thumbnail Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, PNG, GIF, or WEBP (Max 1MB)
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-gray-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Square Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'SquareThumbnail')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img src={squarePreview} alt="Square" className="mx-auto max-h-32 rounded-md" />
                                                        <div className='flex justify-center'>
<button
                                                            type="button"
                                                            onClick={() => { setData('SquareThumbnail', null); setSquarePreview(null); }}
                                                            className="mt-4 w-1/2 mx-auto rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                        </div>
                                                        
                                                    </div>
                                                )}
                                            </div>
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
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!bannerPreview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload Banner Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, PNG, GIF, or WEBP (Max 1MB)
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-gray-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose Banner Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 'bannerImage')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img src={bannerPreview} alt="Banner" className="mx-auto max-h-72 rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={() => { setData('bannerImage', null); setBannerPreview(null); }}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                                            <div className="mt-2 rounded-md border-2 border-dashed border-gray-300 p-6">
                                                {!appImagePreview ? (
                                                    <div className="text-center">
                                                        <div className="mb-4">
                                                            <i className="fa fa-cloud-upload text-5xl text-gray-400"></i>
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                                            Upload App Image
                                                        </p>
                                                        <p className="mb-4 text-xs text-gray-500">
                                                            JPG, PNG, GIF, or WEBP (Max 1MB)
                                                        </p>
                                                        <label className="cursor-pointer rounded-md bg-[#00895f] px-4 py-2 text-sm text-white hover:bg-gray-700">
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Choose App Image
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, 's_image1')}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img src={appImagePreview} alt="App" className="mx-auto max-h-72 rounded-md" />
                                                        <button
                                                            type="button"
                                                            onClick={() => { setData('s_image1', null); setAppImagePreview(null); }}
                                                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                        >
                                                            <i className="fa fa-trash mr-2"></i>
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                                                value={data.tags}
                                                onChange={(value) => setData('tags', value)}
                                                className="w-full"
                                                style={{ width: '100%' }}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Add relevant tags to help categorize your post
                                            </p>
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
                                    <PrimaryButton processing={processing}>
                                       
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
