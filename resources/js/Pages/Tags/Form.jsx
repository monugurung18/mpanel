import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input, Select, Form, Card, Row, Col, message, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';

export default function TagForm({ tag, specialities }) {
    const [form] = Form.useForm();
    const [tagError, setTagError] = useState('');
    const [displayNameError, setDisplayNameError] = useState('');
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        display_name: tag?.display_name || '',
        tagString: tag?.tagString || '',
        tagCategory1: tag?.tagCategory1 || undefined,
        tagCategory2: tag?.tagCategory2 || undefined,
        tagCategory3: tag?.tagCategory3 || undefined,
    });

    const isEditing = !!tag;

    useEffect(() => {
        if (tag) {
            form.setFieldsValue({
                display_name: tag.display_name,
                tagString: tag.tagString,
                tagCategory1: tag.tagCategory1,
                tagCategory2: tag.tagCategory2,
                tagCategory3: tag.tagCategory3,
            });
        }
    }, [tag, form]);

    const handleSubmit = (values) => {
        // Prepare data for submission
        const formData = {
            display_name: values.display_name,
            tagString: values.tagString,
            tagCategory1: values.tagCategory1 || null,
            tagCategory2: values.tagCategory2 || null,
            tagCategory3: values.tagCategory3 || null,
        };

        if (isEditing) {
            put(route('tags.update', tag.tagId), formData, {
                onSuccess: () => {
                    message.success('Tag updated successfully!');
                },
                onError: (errors) => {
                    message.error('Failed to update tag.');
                }
            });
        } else {
            post(route('tags.store'), formData, {
                onSuccess: () => {
                    message.success('Tag created successfully!');
                    form.resetFields();
                },
                onError: (errors) => {
                    message.error('Failed to create tag.');
                }
            });
        }
    };

    const checkTagExists = async (tagValue, fieldName) => {
        if (!tagValue) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            // Using Inertia's visit method with replace to avoid page navigation
            const params = {
                [fieldName]: tagValue,
                tag_id: isEditing && tag?.tagId ? tag.tagId : ''
            };
            
            // We'll make a direct axios request to avoid Inertia's full page visit
            // but still leverage Laravel's CSRF protection
            window.axios.post(route('tags.check'), params)
                .then(response => {
                    const result = response.data;
                    
                    if (result === '1') {
                        if (fieldName === 'tag') {
                            setTagError('Tag already exists');
                        } else if (fieldName === 'dname') {
                            setDisplayNameError('Display name already exists');
                        }
                        reject('Already exists');
                    } else {
                        if (fieldName === 'tag') {
                            setTagError('');
                        } else if (fieldName === 'dname') {
                            setDisplayNameError('');
                        }
                        resolve();
                    }
                })
                .catch(error => {
                    console.error('Error checking tag:', error);
                    reject('Error checking tag');
                });
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Tag" : "Create Tag"} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6">
                                <Link 
                                    href={route('tags.index')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Tags
                                </Link>
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    {isEditing ? "Edit Tag" : "Create New Tag"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isEditing 
                                        ? "Update the details for this tag below." 
                                        : "Fill in the details to create a new tag."}
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={data}
                                    requiredMark={false}
                                >
                                    <Row gutter={24}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label={
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Tag Name
                                                    </span>
                                                }
                                                name="tagString"
                                                rules={[
                                                    { 
                                                        required: true, 
                                                        message: 'Please input the tag name!' 
                                                    },
                                                    {
                                                        validator: (_, value) => checkTagExists(value, 'tag')
                                                    }
                                                ]}
                                                help={tagError}
                                                validateStatus={tagError ? 'error' : ''}
                                            >
                                                <Input
                                                    placeholder="Enter tag name"
                                                    className="rounded-md"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label={
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Display Name
                                                    </span>
                                                }
                                                name="display_name"
                                                rules={[
                                                    { 
                                                        required: true, 
                                                        message: 'Please input the display name!' 
                                                    },
                                                    {
                                                        validator: (_, value) => checkTagExists(value, 'dname')
                                                    }
                                                ]}
                                                help={displayNameError}
                                                validateStatus={displayNameError ? 'error' : ''}
                                            >
                                                <Input
                                                    placeholder="Enter display name"
                                                    className="rounded-md"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">Specialities</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Assign specialities to this tag (optional)
                                        </p>
                                    </div>
                                    
                                    <Row gutter={24}>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label={
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Speciality 1
                                                    </span>
                                                }
                                                name="tagCategory1"
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Select speciality"
                                                    optionFilterProp="children"
                                                    options={specialities}
                                                    className="rounded-md"
                                                    size="large"
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label={
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Speciality 2
                                                    </span>
                                                }
                                                name="tagCategory2"
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Select speciality"
                                                    optionFilterProp="children"
                                                    options={specialities}
                                                    className="rounded-md"
                                                    size="large"
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label={
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Speciality 3
                                                    </span>
                                                }
                                                name="tagCategory3"
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Select speciality"
                                                    optionFilterProp="children"
                                                    options={specialities}
                                                    className="rounded-md"
                                                    size="large"
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    {Object.keys(errors).length > 0 && (
                                        <div className="mb-6">
                                            <Alert
                                                message="Validation Error"
                                                description={
                                                    <ul className="list-disc pl-5">
                                                        {Object.entries(errors).map(([key, value]) => (
                                                            <li key={key} className="text-sm">{value}</li>
                                                        ))}
                                                    </ul>
                                                }
                                                type="error"
                                                showIcon
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-end space-x-4 pt-6">
                                        <Link href={route('tags.index')}>
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
                                            {isEditing ? 'Update Tag' : 'Create Tag'}
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