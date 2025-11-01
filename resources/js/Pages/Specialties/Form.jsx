import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Select, Upload } from 'antd';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import UploadCard from '@/Components/UploadCard';

export default function SpecialtyForm({ specialty, parentSpecialties }) {
    const isEditing = !!specialty;
    console.log(specialty);

    const { data, setData, post, put, errors, processing } = useForm({
        no: specialty?.no || '',
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
        web_banner_name: specialty?.thumbnail_img || '',
        app_banner_name: specialty?.mobileThumb || '',
        icon_banner_name: specialty?.featured_img || '',
        banner_img_name: specialty?.banner_img || '',
    });

    // State for image previews
    const [imagePreviews, setImagePreviews] = useState({
        web_banner: specialty?.thumbnail_img ? `/uploads/specialty/${specialty.thumbnail_img}` : null,
        app_banner: specialty?.mobileThumb ? `/uploads/specialty/${specialty.mobileThumb}` : null,
        icon_banner: specialty?.featured_img ? `/uploads/specialty/${specialty.featured_img}` : null,
        banner_img: specialty?.banner_img ? `/uploads/specialty/${specialty.banner_img}` : null
    });

    // State for image validation errors
    const [imageValidationErrors, setImageValidationErrors] = useState({
        web_banner: '',
        app_banner: '',
        icon_banner: '',
        banner_img: ''
    });

    useEffect(() => {
        if (specialty) {
            // Set up image previews for existing images
            const previews = {};
            if (specialty.thumbnail_img) previews.web_banner = `/uploads/specialty/${specialty.thumbnail_img}`;
            if (specialty.mobileThumb) previews.app_banner = `/uploads/specialty/${specialty.mobileThumb}`;
            if (specialty.featured_img) previews.icon_banner = `/uploads/specialty/${specialty.featured_img}`;
            if (specialty.banner_img) previews.banner_img = `/uploads/specialty/${specialty.banner_img}`;
            setImagePreviews(previews);
        }
    }, [specialty]);

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

        // Validate title is not empty or only whitespace
        if (!data.title || data.title.trim() === '') {
            // Set error directly in the errors object
            errors.title = 'Specialty name is required and cannot be empty.';
            return;
        }

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
        if (data.web_banner instanceof File) submitData.append('web_banner', data.web_banner);
        if (data.app_banner instanceof File) submitData.append('app_banner', data.app_banner);
        if (data.icon_banner instanceof File) submitData.append('icon_banner', data.icon_banner);
        if (data.banner_img instanceof File) submitData.append('banner_img', data.banner_img);

        const url = isEditing
            ? route('specialties.updates', specialty.no)
            : route('specialties.store');

        if (isEditing) {
            post(url, {
                data: submitData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            post(url, {
                data: submitData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                                    <Card>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
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
                                                            { value: 'sponsored', label: 'Sponsored' }, 
                                                            { value: 'follow', label: 'Follow' }
                                                        ]}
                                                        value={data.speciality_type}
                                                        onChange={(value) => setData('speciality_type', value)}
                                                        placeholder="Select specialty type"
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
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
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        className="mt-1 w-full h-[36px]"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel for="parentID2" value="Parent Specialty 2" className="text-sm font-medium text-gray-700" />
                                                    <Select
                                                        options={parentSpecialties}
                                                        value={data.parentID2}
                                                        onChange={(value) => setData('parentID2', value)}
                                                        placeholder="Select parent specialty"
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        className="mt-1 w-full h-[36px]"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel for="parentID3" value="Parent Specialty 3" className="text-sm font-medium text-gray-700" />
                                                    <Select
                                                        options={parentSpecialties}
                                                        value={data.parentID3}
                                                        onChange={(value) => setData('parentID3', value)}
                                                        placeholder="Select parent specialty"
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
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
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        className="mt-1 w-full h-[36px]"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel for="parentID5" value="Parent Specialty 5" className="text-sm font-medium text-gray-700" />
                                                    <Select
                                                        options={parentSpecialties}
                                                        value={data.parentID5}
                                                        onChange={(value) => setData('parentID5', value)}
                                                        placeholder="Select parent specialty"
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        className="mt-1 w-full h-[36px]"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Image Upload Sections */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Images</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                Upload images for this specialty. Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each)
                                            </p>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel value="Web Banner (360x260px)" className="text-sm font-medium text-gray-700" />
                                                    <Upload
                                                        name="web_banner"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                web_banner: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    web_banner: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    web_banner: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (360x260)
                                                            validateImageDimensions(file, 360, 260)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('web_banner', file);
                                                                    setData('web_banner_name', file.name);

                                                                    // Create preview
                                                                    const reader = new FileReader();
                                                                    reader.onload = (event) => {
                                                                        setImagePreviews(prev => ({
                                                                            ...prev,
                                                                            web_banner: event.target.result
                                                                        }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        web_banner: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('web_banner', null);
                                                            setData('web_banner_name', '');
                                                            setImagePreviews(prev => ({
                                                                ...prev,
                                                                web_banner: null
                                                            }));
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                web_banner: ''
                                                            }));
                                                        }}
                                                        fileList={imagePreviews.web_banner ? [{
                                                            uid: '-1',
                                                            name: data.web_banner_name || specialty?.thumbnail_img,
                                                            status: 'done',
                                                            url: imagePreviews.web_banner,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!imagePreviews.web_banner ? (
                                                            <UploadCard 
                                                                title="Upload Web Banner" 
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 360x260px" 
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.web_banner && <InputError message={imageValidationErrors.web_banner} className="mt-2" />}

                                                </div>

                                                <div>
                                                    <InputLabel value="App Banner (451x260px)" className="text-sm font-medium text-gray-700" />
                                                    <Upload
                                                        name="app_banner"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                app_banner: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    app_banner: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    app_banner: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (451x260)
                                                            validateImageDimensions(file, 451, 260)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('app_banner', file);
                                                                    setData('app_banner_name', file.name);

                                                                    // Create preview
                                                                    const reader = new FileReader();
                                                                    reader.onload = (event) => {
                                                                        setImagePreviews(prev => ({
                                                                            ...prev,
                                                                            app_banner: event.target.result
                                                                        }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        app_banner: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('app_banner', null);
                                                            setData('app_banner_name', '');
                                                            setImagePreviews(prev => ({
                                                                ...prev,
                                                                app_banner: null
                                                            }));
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                app_banner: ''
                                                            }));
                                                        }}
                                                        fileList={imagePreviews.app_banner ? [{
                                                            uid: '-1',
                                                            name: data.app_banner_name || specialty?.mobileThumb,
                                                            status: 'done',
                                                            url: imagePreviews.app_banner,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!imagePreviews.app_banner ? (
                                                            <UploadCard 
                                                                title="Upload App Banner" 
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 451x260px" 
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.app_banner && <InputError message={imageValidationErrors.app_banner} className="mt-2" />}

                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel value="Icon Banner (350x490px)" className="text-sm font-medium text-gray-700" />
                                                    <Upload
                                                        name="icon_banner"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                icon_banner: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    icon_banner: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    icon_banner: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (350x490)
                                                            validateImageDimensions(file, 350, 490)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('icon_banner', file);
                                                                    setData('icon_banner_name', file.name);

                                                                    // Create preview
                                                                    const reader = new FileReader();
                                                                    reader.onload = (event) => {
                                                                        setImagePreviews(prev => ({
                                                                            ...prev,
                                                                            icon_banner: event.target.result
                                                                        }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        icon_banner: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('icon_banner', null);
                                                            setData('icon_banner_name', '');
                                                            setImagePreviews(prev => ({
                                                                ...prev,
                                                                icon_banner: null
                                                            }));
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                icon_banner: ''
                                                            }));
                                                        }}
                                                        fileList={imagePreviews.icon_banner ? [{
                                                            uid: '-1',
                                                            name: data.icon_banner_name || specialty?.featured_img,
                                                            status: 'done',
                                                            url: imagePreviews.icon_banner,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!imagePreviews.icon_banner ? (
                                                            <UploadCard 
                                                                title="Upload Icon Banner" 
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 350x490px" 
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.icon_banner && <InputError message={imageValidationErrors.icon_banner} className="mt-2" />}

                                                </div>

                                                <div>
                                                    <InputLabel value="Banner Image (451x260px)" className="text-sm font-medium text-gray-700" />
                                                    <Upload
                                                        name="banner_img"
                                                        beforeUpload={(file) => {
                                                            // Clear previous validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                banner_img: ''
                                                            }));

                                                            // Validate file type
                                                            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
                                                            if (!isValidType) {
                                                                const errorMessage = 'Only JPG, JPEG, PNG, or WEBP files are allowed.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    banner_img: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate file size (1MB max)
                                                            const isLt1M = file.size / 1024 / 1024 < 1;
                                                            if (!isLt1M) {
                                                                const errorMessage = 'File size must be less than 1MB.';
                                                                setImageValidationErrors(prev => ({
                                                                    ...prev,
                                                                    banner_img: errorMessage
                                                                }));
                                                                return Upload.LIST_IGNORE;
                                                            }

                                                            // Validate dimensions (451x260)
                                                            validateImageDimensions(file, 451, 260)
                                                                .then(() => {
                                                                    // Update form data
                                                                    setData('banner_img', file);
                                                                    setData('banner_img_name', file.name);

                                                                    // Create preview
                                                                    const reader = new FileReader();
                                                                    reader.onload = (event) => {
                                                                        setImagePreviews(prev => ({
                                                                            ...prev,
                                                                            banner_img: event.target.result
                                                                        }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                })
                                                                .catch(error => {
                                                                    setImageValidationErrors(prev => ({
                                                                        ...prev,
                                                                        banner_img: error
                                                                    }));
                                                                    return Upload.LIST_IGNORE;
                                                                });

                                                            return false; // Prevent automatic upload
                                                        }}
                                                        onRemove={() => {
                                                            setData('banner_img', null);
                                                            setData('banner_img_name', '');
                                                            setImagePreviews(prev => ({
                                                                ...prev,
                                                                banner_img: null
                                                            }));
                                                            // Clear validation error
                                                            setImageValidationErrors(prev => ({
                                                                ...prev,
                                                                banner_img: ''
                                                            }));
                                                        }}
                                                        fileList={imagePreviews.banner_img ? [{
                                                            uid: '-1',
                                                            name: data.banner_img_name || specialty?.banner_img,
                                                            status: 'done',
                                                            url: imagePreviews.banner_img,
                                                        }] : []}
                                                        listType="picture"
                                                        maxCount={1}
                                                        className="mt-2"
                                                    >
                                                        {!imagePreviews.banner_img ? (
                                                            <UploadCard 
                                                                title="Upload Banner Image" 
                                                                description="Supported formats: JPG, JPEG, PNG, WEBP (max 1MB each) | Dimensions: 451x260px" 
                                                            />
                                                        ) : null}
                                                    </Upload>
                                                    {imageValidationErrors.banner_img && <InputError message={imageValidationErrors.banner_img} className="mt-2" />}

                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* SEO Section */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>SEO Information</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                Optimize this specialty for search engines
                                            </p>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
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
                                        </CardContent>
                                    </Card>

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