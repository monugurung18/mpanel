import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button, Input, Select, Form, Row, Col, message, Switch, Upload } from 'antd';
import { useState, useEffect } from 'react';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function SpecialtyForm({ specialty, parentSpecialties }) {
    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditing = !!specialty;

    useEffect(() => {
        if (specialty) {
            const initialValues = {
                title: specialty.title || '',
                spec_desc: specialty.spec_desc || '',
                meta_title: specialty.meta_title || '',
                meta_desc: specialty.meta_desc || '',
                meta_key: specialty.meta_key || '',
                custom_url: specialty.custom_url || '',
                cmeDescription: specialty.cmeDescription || '',
                speciality_type: specialty.speciality_type || 'speciality',
                parentID: specialty.parentID || undefined,
                parentID2: specialty.parentID2 || undefined,
                parentID3: specialty.parentID3 || undefined,
                parentID4: specialty.parentID4 || undefined,
                parentID5: specialty.parentID5 || undefined,
                status: specialty.status === 'on', // Initialize as boolean
                web_banner_old: specialty.thumbnail_img || '',
                app_banner_old: specialty.mobileThumb || '',
                icon_banner_old: specialty.featured_img || '',
                banner_img_old: specialty.banner_img || '',
            };
            form.setFieldsValue(initialValues);
        } else {
            // For new specialties, set default values
            const initialValues = {
                title: '',
                spec_desc: '',
                meta_title: '',
                meta_desc: '',
                meta_key: '',
                custom_url: '',
                cmeDescription: '',
                speciality_type: 'speciality',
                parentID: undefined,
                parentID2: undefined,
                parentID3: undefined,
                parentID4: undefined,
                parentID5: undefined,
                status: true, // Default to active
                web_banner_old: '',
                app_banner_old: '',
                icon_banner_old: '',
                banner_img_old: '',
            };
            form.setFieldsValue(initialValues);
        }
    }, [specialty, form]);

    const handleSubmit = (values) => {
        // Validate title is not empty or only whitespace
        if (!values.title || values.title.trim() === '') {
            message.error('Specialty name is required and cannot be empty.');
            return;
        }
        
        // Set processing state
        setProcessing(true);
        setErrors({});
        
        // Prepare the data for submission
        const submitData = new FormData();
        
        // Add all form values
        Object.keys(values).forEach(key => {
            // Special handling for status field
            if (key === 'status') {
                submitData.append(key, values[key] ? 'on' : 'off');
            } 
            // Special handling for title field
            else if (key === 'title') {
                submitData.append(key, values[key].trim());
            }
            // Skip file fields as they're handled separately
            else if (!['web_banner', 'app_banner', 'icon_banner', 'banner_img'].includes(key)) {
                submitData.append(key, values[key] !== undefined && values[key] !== null ? values[key] : '');
            }
        });
        
        // Add file uploads if present and are actual File objects
        if (values.web_banner instanceof File) submitData.append('web_banner', values.web_banner);
        if (values.app_banner instanceof File) submitData.append('app_banner', values.app_banner);
        if (values.icon_banner instanceof File) submitData.append('icon_banner', values.icon_banner);
        if (values.banner_img instanceof File) submitData.append('banner_img', values.banner_img);
        
        // Add old image values for reference
        submitData.append('web_banner_old', values.web_banner_old || '');
        submitData.append('app_banner_old', values.app_banner_old || '');
        submitData.append('icon_banner_old', values.icon_banner_old || '');
        submitData.append('banner_img_old', values.banner_img_old || '');

        // Debug log
        console.log('Form values received:', values);
        console.log('Prepared submission data:', Array.from(submitData.entries()));
        
        // Check specifically for title in prepared data
        const titleEntry = Array.from(submitData.entries()).find(entry => entry[0] === 'title');
        if (titleEntry) {
            console.log('Title in prepared submission data:', titleEntry[1]);
        } else {
            console.log('ERROR: Title not found in prepared submission data!');
        }

        // Submit the form data
        const url = isEditing 
            ? route('specialties.update', specialty.no) 
            : route('specialties.store');
            
        const method = isEditing ? 'post' : 'post'; // Both use POST, Laravel handles PUT via _method
        
        // Add _method for PUT requests
        if (isEditing) {
            submitData.append('_method', 'PUT');
        }

        axios({
            method: method,
            url: url,
            data: submitData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
        })
        .then(response => {
            setProcessing(false);
            message.success(isEditing ? 'Specialty updated successfully!' : 'Specialty created successfully!');
            if (!isEditing) {
                form.resetFields();
            }
            // Redirect to index page
            window.location.href = route('specialties.index');
        })
        .catch(error => {
            setProcessing(false);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
                message.error(isEditing ? 'Failed to update specialty.' : 'Failed to create specialty.');
            } else {
                console.error(isEditing ? 'Update error:' : 'Create error:', error);
                message.error('An unexpected error occurred.');
            }
        });
    };

    // Handle image preview and validation
    const handleImageChange = (info, fieldName) => {
        if (info.file.status === 'done') {
            form.setFieldsValue({ [fieldName]: info.file.originFileObj });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    // Custom request for image upload to bypass default behavior
    const customRequest = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    // Generate custom URL from title
    const generateCustomUrl = (title) => {
        if (title && title.trim() !== '') {
            const customUrl = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            form.setFieldsValue({ custom_url: customUrl });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Specialty" : "Create Specialty"} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6">
                                <Link 
                                    href={route('specialties.index')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Specialties
                                </Link>
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    {isEditing ? "Edit Specialty" : "Create New Specialty"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isEditing 
                                        ? "Update the details for this specialty below." 
                                        : "Fill in the details to create a new specialty."}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    requiredMark={false}
                                >
                                    {/* Basic Information */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Specialty Name
                                                        </span>
                                                    }
                                                    name="title"
                                                    rules={[
                                                        { 
                                                            required: true, 
                                                            message: 'Please input the specialty name!',
                                                            validator: (_, value) => {
                                                                if (!value || value.trim() === '') {
                                                                    return Promise.reject('Please input the specialty name!');
                                                                }
                                                                return Promise.resolve();
                                                            }
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Enter specialty name"
                                                        className="rounded-md"
                                                        size="large"
                                                        onChange={(e) => generateCustomUrl(e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Specialty Type
                                                        </span>
                                                    }
                                                    name="speciality_type"
                                                >
                                                    <Select
                                                        placeholder="Select specialty type"
                                                        options={[
                                                            { value: 'speciality', label: 'Speciality' },
                                                            { value: 'preference', label: 'Preference' },
                                                            { value: 'follow', label: 'Follow' },
                                                            { value: 'sponsored', label: 'Sponsored' },
                                                        ]}
                                                        className="rounded-md"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Item
                                            label={
                                                <span className="text-sm font-medium text-gray-700">
                                                    Specialty Description
                                                </span>
                                            }
                                            name="spec_desc"
                                        >
                                            <Input.TextArea
                                                placeholder="Enter specialty description"
                                                rows={4}
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </div>
                                    
                                    {/* Parent Specialties */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Parent Specialties</h3>
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Parent 1
                                                        </span>
                                                    }
                                                    name="parentID"
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Select parent specialty"
                                                        optionFilterProp="children"
                                                        options={parentSpecialties[0]}
                                                        className="rounded-md"
                                                        size="large"
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Parent 2
                                                        </span>
                                                    }
                                                    name="parentID2"
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Select parent specialty"
                                                        optionFilterProp="children"
                                                        options={parentSpecialties[1]}
                                                        className="rounded-md"
                                                        size="large"
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Parent 3
                                                        </span>
                                                    }
                                                    name="parentID3"
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Select parent specialty"
                                                        optionFilterProp="children"
                                                        options={parentSpecialties[2]}
                                                        className="rounded-md"
                                                        size="large"
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Parent 4
                                                        </span>
                                                    }
                                                    name="parentID4"
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Select parent specialty"
                                                        optionFilterProp="children"
                                                        options={parentSpecialties[3]}
                                                        className="rounded-md"
                                                        size="large"
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Parent 5
                                                        </span>
                                                    }
                                                    name="parentID5"
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Select parent specialty"
                                                        optionFilterProp="children"
                                                        options={parentSpecialties[4]}
                                                        className="rounded-md"
                                                        size="large"
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                    
                                    {/* URLs and Meta Information */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">URLs and Meta Information</h3>
                                        <Form.Item
                                            label={
                                                <span className="text-sm font-medium text-gray-700">
                                                    Custom URL
                                                </span>
                                            }
                                            name="custom_url"
                                        >
                                            <Input
                                                placeholder="Enter custom URL"
                                                className="rounded-md"
                                                size="large"
                                            />
                                        </Form.Item>
                                        
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Meta Title
                                                        </span>
                                                    }
                                                    name="meta_title"
                                                >
                                                    <Input
                                                        placeholder="Enter meta title"
                                                        className="rounded-md"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Meta Keywords
                                                        </span>
                                                    }
                                                    name="meta_key"
                                                >
                                                    <Input
                                                        placeholder="Enter meta keywords"
                                                        className="rounded-md"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Item
                                            label={
                                                <span className="text-sm font-medium text-gray-700">
                                                    Meta Description
                                                </span>
                                            }
                                            name="meta_desc"
                                        >
                                            <Input.TextArea
                                                placeholder="Enter meta description"
                                                rows={3}
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </div>
                                    
                                    {/* CME Description */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">CME Description</h3>
                                        <Form.Item
                                            name="cmeDescription"
                                        >
                                            <Input.TextArea
                                                placeholder="Enter CME description"
                                                rows={4}
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </div>
                                    
                                    {/* Images */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                                        <Row gutter={24}>
                                            {/* Web Banner */}
                                            <Col xs={24} md={6}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Web Banner (360x260)
                                                        </span>
                                                    }
                                                >
                                                    <Upload
                                                        name="web_banner"
                                                        customRequest={customRequest}
                                                        onChange={(info) => handleImageChange(info, 'web_banner')}
                                                        showUploadList={false}
                                                        accept=".jpg,.jpeg,.png"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                                    </Upload>
                                                    {form.getFieldValue('web_banner_old') && (
                                                        <div className="mt-2">
                                                            <img 
                                                                src={`/uploads/specialty/${form.getFieldValue('web_banner_old')}`} 
                                                                alt="Web Banner" 
                                                                className="w-full h-24 object-cover rounded border"
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            
                                            {/* App Banner */}
                                            <Col xs={24} md={6}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            App Banner (451x260)
                                                        </span>
                                                    }
                                                >
                                                    <Upload
                                                        name="app_banner"
                                                        customRequest={customRequest}
                                                        onChange={(info) => handleImageChange(info, 'app_banner')}
                                                        showUploadList={false}
                                                        accept=".jpg,.jpeg,.png"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                                    </Upload>
                                                    {form.getFieldValue('app_banner_old') && (
                                                        <div className="mt-2">
                                                            <img 
                                                                src={`/uploads/specialty/${form.getFieldValue('app_banner_old')}`} 
                                                                alt="App Banner" 
                                                                className="w-full h-24 object-cover rounded border"
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            
                                            {/* Icon Image */}
                                            <Col xs={24} md={6}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Icon Image (350x490)
                                                        </span>
                                                    }
                                                >
                                                    <Upload
                                                        name="icon_banner"
                                                        customRequest={customRequest}
                                                        onChange={(info) => handleImageChange(info, 'icon_banner')}
                                                        showUploadList={false}
                                                        accept=".jpg,.jpeg,.png"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                                    </Upload>
                                                    {form.getFieldValue('icon_banner_old') && (
                                                        <div className="mt-2">
                                                            <img 
                                                                src={`/uploads/specialty/${form.getFieldValue('icon_banner_old')}`} 
                                                                alt="Icon Image" 
                                                                className="w-full h-24 object-cover rounded border"
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            
                                            {/* App Banner Image */}
                                            <Col xs={24} md={6}>
                                                <Form.Item
                                                    label={
                                                        <span className="text-sm font-medium text-gray-700">
                                                            App Banner Image (451x260)
                                                        </span>
                                                    }
                                                >
                                                    <Upload
                                                        name="banner_img"
                                                        customRequest={customRequest}
                                                        onChange={(info) => handleImageChange(info, 'banner_img')}
                                                        showUploadList={false}
                                                        accept=".jpg,.jpeg,.png"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                                    </Upload>
                                                    {form.getFieldValue('banner_img_old') && (
                                                        <div className="mt-2">
                                                            <img 
                                                                src={`/uploads/specialty/${form.getFieldValue('banner_img_old')}`} 
                                                                alt="App Banner Image" 
                                                                className="w-full h-24 object-cover rounded border"
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                                        <Form.Item
                                            name="status"
                                            valuePropName="checked"
                                        >
                                            <Switch 
                                                checkedChildren="Active" 
                                                unCheckedChildren="Inactive" 
                                            />
                                        </Form.Item>
                                    </div>
                                    
                                    {/* Form Actions */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="mb-6">
                                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800">
                                                            Validation Errors
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
                                    
                                    <div className="flex items-center justify-end space-x-4 pt-6">
                                        <Link href={route('specialties.index')}>
                                            <Button size="large">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={processing}
                                            size="large"
                                        >
                                            {isEditing ? 'Update Specialty' : 'Create Specialty'}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}