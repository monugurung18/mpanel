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

export default function Form({ post, categories, specialities }) {
    const { props } = usePage();
    const { baseImagePath } = props;
    const isEditing = !!post;
    const [currentStep, setCurrentStep] = useState(1);
    const [imageError, setImageError] = useState(null);

    const { data, setData, post: submitPost, errors, processing } = useForm({
        title: post?.title || '',
        custom_url: post?.custom_url || '',
        postType: post?.postType || 'article',
        theContent: post?.theContent || '',
        transcript: post?.transcript || '',
        videoLink: post?.videoLink || '',
        linkType: post?.linkType || '',
        catagory1: post?.catagory1 || '',
        diseaseRelations: post?.diseaseRelations || '',
        author1: post?.author1 || '',
        status: post?.status || 'draft',
        isFeatured: post?.isFeatured ? true : false,
        post_date: post?.post_date ? (typeof post.post_date === 'string' ? post.post_date.slice(0, 16).replace(' ', 'T') : '') : '',
        featuredThumbnail: null,
        alt_image: post?.alt_image || '',
        seo_pageTitle: post?.seo_pageTitle || '',
        seo_metaDesctiption: post?.seo_metaDesctiption || '',
        seo_metaKeywords: post?.seo_metaKeywords || '',
        seo_canonical: post?.seo_canonical || '',
        tags: post?.tags ? post.tags.split(',').filter(t => t) : [],
    });

    const [imagePreview, setImagePreview] = useState(
        post?.featuredThumbnail ? getPostImageUrl(post.featuredThumbnail, baseImagePath) : null
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
        // Auto-generate SEO title from title
        if (data.title && !data.seo_pageTitle) {
            setData('seo_pageTitle', data.title);
        }
    }, [data.title]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 1MB)
        const maxSize = 1 * 1024 * 1024;
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

        // All validations passed
        setImageError(null);
        setData('featuredThumbnail', file);
        setImagePreview(URL.createObjectURL(file));
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
            tags: Array.isArray(data.tags) ? data.tags : [],
        };

        if (isEditing) {
            submitPost(route('posts.update', post.articleID), {
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
            submitPost(route('posts.store'), {
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
            tags: Array.isArray(data.tags) ? data.tags : [],
        };

        if (isEditing) {
            submitPost(route('posts.update', post.articleID), {
                ...formData,
                forceFormData: true,
                _method: 'PUT',
            });
        } else {
            submitPost(route('posts.store'), {
                ...formData,
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
                                                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                                                        currentStep === step
                                                            ? 'border-[#00895f] bg-[#00895f] text-white'
                                                            : currentStep > step || isEditing
                                                            ? 'border-[#00895f] bg-white text-[#00895f] cursor-pointer hover:bg-gray-50'
                                                            : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <i className={`fa ${
                                                        step === 1 ? 'fa-file-text' :
                                                        step === 2 ? 'fa-image' :
                                                        'fa-search'
                                                    } text-lg`}></i>
                                                </button>
                                                <span className="mt-2 text-xs font-medium text-gray-600">
                                                    {step === 1 ? 'Content' : step === 2 ? 'Media' : 'SEO'}
                                                </span>
                                            </div>
                                            {step < 3 && (
                                                <div
                                                    className={`mx-4 h-1 flex-1 ${
                                                        currentStep > step ? 'bg-[#00895f]' : 'bg-gray-300'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-4" />

                            <form onSubmit={currentStep === 3 ? handleSubmit : handleSaveAndContinue} className="space-y-6">
                                {/* Step 1: Content */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-800">Post Content</h3>
                                        <hr className="my-4" />

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

                                            {/* Custom URL */}
                                            <div>
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

                                            {/* Category */}
                                            <div>
                                                <InputLabel htmlFor="catagory1" value="Category" />
                                                <Input
                                                    id="catagory1"
                                                    type="text"
                                                    value={data.catagory1}
                                                    onChange={(e) => setData('catagory1', e.target.value)}
                                                    error={errors.catagory1}
                                                    icon="fa-folder"
                                                    placeholder="e.g., Medical News, Research"
                                                    size="lg"
                                                    list="categories-list"
                                                />
                                                <datalist id="categories-list">
                                                    {categories.map((cat) => (
                                                        <option key={cat.value} value={cat.value} />
                                                    ))}
                                                </datalist>
                                            </div>

                                            {/* Author */}
                                            <div>
                                                <InputLabel htmlFor="author1" value="Author Name" />
                                                <Input
                                                    id="author1"
                                                    type="text"
                                                    value={data.author1}
                                                    onChange={(e) => setData('author1', e.target.value)}
                                                    error={errors.author1}
                                                    icon="fa-user"
                                                    placeholder="Author name"
                                                    size="lg"
                                                />
                                            </div>

                                            {/* Disease Relations (Speciality) */}
                                            <div>
                                                <InputLabel htmlFor="diseaseRelations" value="Speciality" />
                                                <Dropdown
                                                    options={specialities}
                                                    value={data.diseaseRelations}
                                                    onChange={(value) => setData('diseaseRelations', value)}
                                                    placeholder="Select speciality"
                                                    icon="fa-stethoscope"
                                                    searchable
                                                    error={errors.diseaseRelations}
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

                                            {/* Transcript */}
                                            <div className="lg:col-span-2">
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
                                            <div className="lg:col-span-2">
                                                <InputLabel value="Post Content *" />
                                                <RichTextEditor
                                                    value={data.theContent}
                                                    onChange={(content) => setData('theContent', content)}
                                                    placeholder="Write your post content here..."
                                                    error={errors.theContent}
                                                    height={400}
                                                />
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <InputLabel htmlFor="status" value="Status *" />
                                                <Dropdown
                                                    options={[
                                                        { value: 'draft', label: 'Draft' },
                                                        { value: 'published', label: 'Published' },
                                                        { value: 'deleted', label: 'Deleted' },
                                                    ]}
                                                    value={data.status}
                                                    onChange={(value) => setData('status', value)}
                                                    placeholder="Select status"
                                                    icon="fa-circle"
                                                    error={errors.status}
                                                    size="lg"
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
                                                    size="lg"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Set the publish date and time for this post
                                                </p>
                                            </div>

                                            {/* Post Type */}
                                            <div className="lg:col-span-2">
                                                <InputLabel htmlFor="postType" value="Post Type" />
                                                <Dropdown
                                                    options={[
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

                                            {/* Featured Toggle */}
                                            <div className="lg:col-span-2">
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
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Featured posts will be highlighted on the homepage
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Media & Image */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-800">Media & Featured Image</h3>
                                        <hr className="my-4" />

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            {/* Featured Image */}
                                            <div className="lg:col-span-2">
                                                <InputLabel value="Featured Image (Max 1MB)" />
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
                                                                className="mx-auto max-h-96 rounded-md"
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
                                                {imageError && (
                                                    <div className="mt-2 flex items-center space-x-1 text-sm text-red-600">
                                                        <i className="fa fa-exclamation-circle"></i>
                                                        <span>{imageError}</span>
                                                    </div>
                                                )}
                                                <InputError message={errors.featuredThumbnail} className="mt-2" />
                                            </div>

                                            {/* Image Alt Text */}
                                            <div className="lg:col-span-2">
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
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Alt text helps search engines and screen readers understand your image
                                                </p>
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
                                )}

                                {/* Step 3: SEO Settings */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-800">SEO & Metadata</h3>
                                        <hr className="my-4" />

                                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                            <p className="text-sm text-blue-800">
                                                <i className="fa fa-info-circle mr-2"></i>
                                                Optimize your post for search engines with these SEO settings.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {/* SEO Title */}
                                            <div>
                                                <InputLabel htmlFor="seo_pageTitle" value="SEO Title" />
                                                <Input
                                                    id="seo_pageTitle"
                                                    type="text"
                                                    value={data.seo_pageTitle}
                                                    onChange={(e) => setData('seo_pageTitle', e.target.value)}
                                                    error={errors.seo_pageTitle}
                                                    icon="fa-font"
                                                    placeholder="SEO optimized title"
                                                    size="lg"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {data.seo_pageTitle?.length || 0} characters (recommended: 50-60)
                                                </p>
                                            </div>

                                            {/* SEO Description */}
                                            <div>
                                                <InputLabel htmlFor="seo_metaDesctiption" value="SEO Meta Description" />
                                                <textarea
                                                    id="seo_metaDesctiption"
                                                    value={data.seo_metaDesctiption}
                                                    onChange={(e) => setData('seo_metaDesctiption', e.target.value)}
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00895f] focus:ring-[#00895f]"
                                                    placeholder="Brief description for search results"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {data.seo_metaDesctiption?.length || 0} characters (recommended: 150-160)
                                                </p>
                                                <InputError message={errors.seo_metaDesctiption} />
                                            </div>

                                            {/* SEO Keywords */}
                                            <div>
                                                <InputLabel htmlFor="seo_metaKeywords" value="SEO Keywords" />
                                                <Input
                                                    id="seo_metaKeywords"
                                                    type="text"
                                                    value={data.seo_metaKeywords}
                                                    onChange={(e) => setData('seo_metaKeywords', e.target.value)}
                                                    error={errors.seo_metaKeywords}
                                                    icon="fa-key"
                                                    placeholder="keyword1, keyword2, keyword3"
                                                    size="lg"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Separate keywords with commas
                                                </p>
                                            </div>

                                            {/* Canonical URL */}
                                            <div>
                                                <InputLabel htmlFor="seo_canonical" value="Canonical URL" />
                                                <Input
                                                    id="seo_canonical"
                                                    type="text"
                                                    value={data.seo_canonical}
                                                    onChange={(e) => setData('seo_canonical', e.target.value)}
                                                    error={errors.seo_canonical}
                                                    icon="fa-link"
                                                    placeholder="https://example.com/post-url"
                                                    size="lg"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Specify the preferred URL if this content exists elsewhere
                                                </p>
                                            </div>
                                        </div>

                                        {/* Preview Card */}
                                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                                            <h4 className="mb-3 text-sm font-semibold text-gray-700">Search Preview</h4>
                                            <div className="space-y-1">
                                                <div className="text-lg text-blue-600 hover:underline">
                                                    {data.seo_pageTitle || data.title || 'Your Post Title'}
                                                </div>
                                                <div className="text-xs text-green-700">
                                                    {data.seo_canonical || `https://example.com/posts/${data.custom_url || 'post-url'}`}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {data.seo_metaDesctiption || 'Your post description will appear here in search results.'}
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
                                                href={route('posts.index')}
                                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
                                                {isEditing ? 'Update Post' : 'Create Post'}
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
