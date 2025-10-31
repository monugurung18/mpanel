import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Select } from 'antd';

export default function SpecialtyForm({ specialty, parentSpecialties }) {

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState({
        web_banner: null,
        app_banner: null,
        icon_banner: null,
        banner_img: null
    });
    // Add image validation errors state
    const [imageValidationErrors, setImageValidationErrors] = useState({
        web_banner: '',
        app_banner: '',
        icon_banner: '',
        banner_img: ''
    });

    const isEditing = !!specialty;

    const { data, setData, post, put, reset } = useForm({
        title: specialty?.title || '',
        spec_desc: specialty?.spec_desc || '',
        meta_title: specialty?.meta_title || '',
        meta_desc: specialty?.meta_desc || '',
        meta_key: specialty?.meta_key || '',
        custom_url: specialty?.custom_url || '',
        cmeDescription: specialty?.cmeDescription || '',
        speciality_type: specialty?.speciality_type || 'speciality',
        parentID: specialty?.parentID || 0,
        parentID2: specialty?.parentID2 || 0,
        parentID3: specialty?.parentID3 || 0,
        parentID4: specialty?.parentID4 || 0,
        parentID5: specialty?.parentID5 || 0,
        status: specialty?.status || 'on',
        web_banner: null,
        app_banner: null,
        icon_banner: null,
        banner_img: null,
        web_banner_old: specialty?.thumbnail_img || '',
        app_banner_old: specialty?.mobileThumb || '',
        icon_banner_old: specialty?.featured_img || '',
        banner_img_old: specialty?.banner_img || '',
    });

    useEffect(() => {
        if (specialty) {
            // Set up image previews for existing images
            const previews = {};
            if (specialty.thumbnail_img) previews.web_banner = `/storage/${specialty.thumbnail_img}`;
            if (specialty.mobileThumb) previews.app_banner = `/storage/${specialty.mobileThumb}`;
            if (specialty.featured_img) previews.icon_banner = `/storage/${specialty.featured_img}`;
            if (specialty.banner_img) previews.banner_img = `/storage/${specialty.banner_img}`;
            setImagePreviews(previews);
        }
    }, [specialty]);

    // Function to validate image dimensions and size
    const validateImage = (file, type) => {
        return new Promise((resolve, reject) => {
            // Check file size (max 1MB)
            if (file.size > 1024 * 1024) {
                reject(`File size must be less than 1MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                return;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                reject('Only JPG, JPEG, PNG, GIF, and WEBP files are allowed');
                return;
            }

            // Create image to check dimensions
            const img = new Image();
            img.onload = () => {
                const { width, height } = img;
                let expectedWidth, expectedHeight;

                // Define expected dimensions based on image type
                switch (type) {
                    case 'web_banner':
                        expectedWidth = 360;
                        expectedHeight = 260;
                        break;
                    case 'app_banner':
                        expectedWidth = 451;
                        expectedHeight = 260;
                        break;
                    case 'icon_banner':
                        expectedWidth = 350;
                        expectedHeight = 490;
                        break;
                    case 'banner_img':
                        expectedWidth = 451;
                        expectedHeight = 260;
                        break;
                    default:
                        resolve(); // No validation for unknown types
                        return;
                }

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

        // Validate title is not empty or only whitespace
        if (!data.title || data.title.trim() === '') {
            setErrors({ title: 'Specialty name is required and cannot be empty.' });
            return;
        }

        // Check for image validation errors
        const hasImageErrors = Object.values(imageValidationErrors).some(error => error !== '');
        if (hasImageErrors) {
            setErrors({ ...errors, image: 'Please fix image validation errors before submitting' });
            return;
        }

        setProcessing(true);
        setErrors({});

        // Prepare the data for submission
        const submitData = new FormData();

        // Add all form values
        Object.keys(data).forEach(key => {
            // Special handling for status field
            if (key === 'status') {
                submitData.append(key, data[key] ? 'on' : 'off');
            }
            // Special handling for title field
            else if (key === 'title') {
                submitData.append(key, data[key].trim());
            }
            // Skip file fields as they're handled separately
            else if (!['web_banner', 'app_banner', 'icon_banner', 'banner_img'].includes(key)) {
                submitData.append(key, data[key] !== undefined && data[key] !== null ? data[key] : '');
            }
        });

        // Add file uploads if present
        if (data.web_banner) submitData.append('web_banner', data.web_banner);
        if (data.app_banner) submitData.append('app_banner', data.app_banner);
        if (data.icon_banner) submitData.append('icon_banner', data.icon_banner);
        if (data.banner_img) submitData.append('banner_img', data.banner_img);

        // Add old image values for reference
        submitData.append('web_banner_old', data.web_banner_old || '');
        submitData.append('app_banner_old', data.app_banner_old || '');
        submitData.append('icon_banner_old', data.icon_banner_old || '');
        submitData.append('banner_img_old', data.banner_img_old || '');

        const url = isEditing
            ? route('specialties.update', specialty.no)
            : route('specialties.store');

        if (isEditing) {
            submitData.append('_method', 'PUT');
            put(url, submitData, {
                onSuccess: () => {
                    setProcessing(false);
                    // Redirect to index page
                    window.location.href = route('specialties.index');
                },
                onError: (errors) => {
                    setProcessing(false);
                    setErrors(errors);
                }
            });
        } else {
            post(url, submitData, {
                onSuccess: () => {
                    setProcessing(false);
                    reset();
                    // Reset image previews
                    setImagePreviews({
                        web_banner: null,
                        app_banner: null,
                        icon_banner: null,
                        banner_img: null
                    });
                    // Reset image validation errors
                    setImageValidationErrors({
                        web_banner: '',
                        app_banner: '',
                        icon_banner: '',
                        banner_img: ''
                    });
                },
                onError: (errors) => {
                    setProcessing(false);
                    setErrors(errors);
                }
            });
        }
    };

    const handleImageChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image before setting it
            validateImage(file, fieldName)
                .then(() => {
                    // Clear any previous validation error for this field
                    setImageValidationErrors(prev => ({
                        ...prev,
                        [fieldName]: ''
                    }));

                    setData(fieldName, file);

                    // Create preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImagePreviews(prev => ({
                            ...prev,
                            [fieldName]: e.target.result
                        }));
                    };
                    reader.readAsDataURL(file);
                })
                .catch(error => {
                    // Set validation error
                    setImageValidationErrors(prev => ({
                        ...prev,
                        [fieldName]: error
                    }));

                    // Clear the file input
                    e.target.value = '';
                });
        }
    };

    // Generate custom URL from title
    const generateCustomUrl = (title) => {
        if (title && title.trim() !== '') {
            const customUrl = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            setData('custom_url', customUrl);
        }
    };

    // Format parent specialties for dropdown
    const formatParentSpecialties = () => {
        return parentSpecialties.map(spec => ({
            value: spec.value,
            label: spec.label
        }));
    };



    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Speciality" : "Create Speciality"} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex justify-between items-center">

                                <h2 className="mt-2 text-2xl font-bold text-gray-900 uppercase">
                                    {isEditing ? "Edit Specialty" : "Create New Specialty"}
                                </h2>
                                <Link
                                    href={route('specialties.index')}
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 "
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Specialties
                                </Link>

                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel for="title" value="Specialty Name" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="title"
                                                type="text"
                                                placeholder="Enter specialty name"
                                                value={data.title}
                                                onChange={(e) => {
                                                    setData('title', e.target.value);
                                                    // Auto-generate custom URL when title changes (only for new specialties)
                                                    if (!isEditing) {
                                                        generateCustomUrl(e.target.value);
                                                    }
                                                }}
                                                className="w-full py-1.5 mt-1 text-sm"
                                                required
                                            />
                                            {errors.title && <InputError message={errors.title} className="mt-2" />}
                                        </div>

                                        <div>
                                            <InputLabel for="custom_url" value="Custom URL" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="custom_url"
                                                type="text"
                                                placeholder="Enter custom URL"
                                                value={data.custom_url}
                                                onChange={(e) => setData('custom_url', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel for="spec_desc" value="Description" className="text-sm font-medium text-gray-700" />
                                        <textarea
                                            id="spec_desc"
                                            placeholder="Enter description"
                                            value={data.spec_desc}
                                            onChange={(e) => setData('spec_desc', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00895f] focus:ring-[#00895f] sm:text-sm"
                                            rows="4"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <InputLabel for="speciality_type" value="Specialty Type" className="text-sm font-medium text-gray-700" />

                                            <Select
                                                options={[
                                                    { value: 'speciality', label: 'Speciality' },
                                                    { value: 'preference', label: 'Preference' },
                                                    { value: 'sponsored', label: 'Sponsored' }, { value: 'follow', label: 'Follow' }
                                                ]}

                                                value={data.speciality_type}
                                                onChange={(value) => setData('speciality_type', value)}
                                                placeholder="Select specialty type"
                                                searchable
                                                clearable
                                                className="mt-1 w-full h-[36px]"
                                            />

                                        </div>
                                        <div>
                                            <InputLabel for="parentID" value="Parent Specialty 1" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                options={parentSpecialties}
                                                value={data.parentID}
                                                onChange={(value) => setData('parentID', value)}
                                                placeholder="Select parent specialty"
                                                searchable
                                                clearable
                                                className="mt-1 w-full h-[36px]"

                                            />
                                        </div>

                                        <div>
                                            <InputLabel for="parentID2" value="Parent Specialty 2" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                options={formatParentSpecialties()}
                                                value={data.parentID2}
                                                onChange={(value) => setData('parentID2', value)}
                                                placeholder="Select parent specialty"
                                                searchable
                                                clearable
                                                className="mt-1 w-full h-[36px]"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel for="parentID3" value="Parent Specialty 3" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                options={formatParentSpecialties()}
                                                value={data.parentID3}
                                                onChange={(value) => setData('parentID3', value)}
                                                placeholder="Select parent specialty"
                                                searchable
                                                clearable
                                                className="mt-1 w-full h-[36px]"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel for="parentID4" value="Parent Specialty 4" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                options={parentSpecialties}
                                                value={data.parentID4}
                                                onChange={(value) => setData('parentID4', value)}
                                                placeholder="Select parent specialty"
                                                searchable
                                                clearable
                                                className="mt-1 w-full h-[36px]"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel for="parentID5" value="Parent Specialty 5" className="text-sm font-medium text-gray-700" />
                                            <Select
                                                options={formatParentSpecialties()}
                                                value={data.parentID5}
                                                onChange={(value) => setData('parentID5', value)}
                                                placeholder="Select parent specialty"
                                                searchable
                                                clearable
                                                className="mt-1 w-full h-[36px]"
                                            />
                                        </div>



                                    </div>



                                    {/* Image Upload Sections */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900">Images</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Upload images for this specialty (optional)
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel for="web_banner" value="Web Banner (360x260px)" className="text-sm font-medium text-gray-700" />
                                            {imagePreviews.web_banner && (
                                                <div className="mt-2 mb-2">
                                                    <img
                                                        src={imagePreviews.web_banner}
                                                        alt="Web Banner Preview"
                                                        className="h-32 w-full object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                id="web_banner"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'web_banner')}
                                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00895f] file:text-white hover:file:bg-[#007a52]"
                                            />
                                            {imageValidationErrors.web_banner && <InputError message={imageValidationErrors.web_banner} className="mt-2" />}
                                        </div>

                                        <div>
                                            <InputLabel for="app_banner" value="App Banner (451x260px)" className="text-sm font-medium text-gray-700" />
                                            {imagePreviews.app_banner && (
                                                <div className="mt-2 mb-2">
                                                    <img
                                                        src={imagePreviews.app_banner}
                                                        alt="App Banner Preview"
                                                        className="h-32 w-full object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                id="app_banner"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'app_banner')}
                                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00895f] file:text-white hover:file:bg-[#007a52]"
                                            />
                                            {imageValidationErrors.app_banner && <InputError message={imageValidationErrors.app_banner} className="mt-2" />}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel for="icon_banner" value="Icon Banner (350x490px)" className="text-sm font-medium text-gray-700" />
                                            {imagePreviews.icon_banner && (
                                                <div className="mt-2 mb-2">
                                                    <img
                                                        src={imagePreviews.icon_banner}
                                                        alt="Icon Banner Preview"
                                                        className="h-32 w-full object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                id="icon_banner"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'icon_banner')}
                                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00895f] file:text-white hover:file:bg-[#007a52]"
                                            />
                                            {imageValidationErrors.icon_banner && <InputError message={imageValidationErrors.icon_banner} className="mt-2" />}
                                        </div>

                                        <div>
                                            <InputLabel for="banner_img" value="App Banner Image (451x260px)" className="text-sm font-medium text-gray-700" />
                                            {imagePreviews.banner_img && (
                                                <div className="mt-2 mb-2">
                                                    <img
                                                        src={imagePreviews.banner_img}
                                                        alt="Banner Image Preview"
                                                        className="h-32 w-full object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                id="banner_img"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'banner_img')}
                                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#00895f] file:text-white hover:file:bg-[#007a52]"
                                            />
                                            {imageValidationErrors.banner_img && <InputError message={imageValidationErrors.banner_img} className="mt-2" />}
                                        </div>
                                    </div>

                                    {/* SEO Section */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900">SEO Information</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Optimize this specialty for search engines
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel for="meta_title" value="Meta Title" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="meta_title"
                                                type="text"
                                                placeholder="Enter meta title"
                                                value={data.meta_title}
                                                onChange={(e) => setData('meta_title', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel for="meta_desc" value="Meta Description" className="text-sm font-medium text-gray-700" />
                                            <textarea
                                                id="meta_desc"
                                                placeholder="Enter meta description"
                                                value={data.meta_desc}
                                                onChange={(e) => setData('meta_desc', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00895f] focus:ring-[#00895f] sm:text-sm"
                                                rows="3"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel for="meta_key" value="Meta Keywords" className="text-sm font-medium text-gray-700" />
                                            <Input
                                                id="meta_key"
                                                type="text"
                                                placeholder="Enter meta keywords"
                                                value={data.meta_key}
                                                onChange={(e) => setData('meta_key', e.target.value)}
                                                className="w-full py-1.5 mt-1 text-sm"
                                            />
                                        </div>
                                    </div>


                                    {Object.keys(errors).length > 0 && (
                                        <div className="mb-6">
                                            <div className="rounded-md bg-red-50 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800">
                                                            Validation Error
                                                        </h3>
                                                        <div className="mt-2 text-sm text-red-700">
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {Object.entries(errors).map(([key, value]) => (
                                                                    <li key={key}>{value}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-6">
                                        <Link href={route('specialties.index')}>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <PrimaryButton type="submit" disabled={processing}>
                                            Save
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>

                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}