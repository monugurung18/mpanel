import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@/Components/ui/textarea';
import { useState, useEffect } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Building, Save, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Select } from 'antd'; // Use Ant Design Select instead
import PrimaryButton from '@/Components/PrimaryButton';
import UploadCard from '@/Components/UploadCard';

export default function Form({ business }) {
    const { errors } = usePage().props;
    const isEditing = !!business;
    
    const { data, setData, post, put, processing, reset } = useForm({
        business_Name: business?.business_Name || '',
        business_description: business?.business_description || '',
        businessType: business?.businessType || '',
        businessEmail: business?.businessEmail || '',
        businessContactNumber: business?.businessContactNumber || '',
        businessCategory: business?.businessCategory || '',
        businessAddress: business?.businessAddress || '',
        city: business?.city || '',
        state: business?.state || '',
        country: business?.country || '',
        businessPincode: business?.businessPincode || '',
        businessWebsite: business?.businessWebsite || '',
        isCustomPage: business?.isCustomPage || '0',
        custom_url: business?.custom_url || '',
        businessLogo: business?.businessLogo || null,
    });

    // Handle contact number input with auto-masking
    const handleContactNumberChange = (e) => {
        let value = e.target.value;
        
        // Remove all non-digit characters except + and -
        value = value.replace(/[^\d+-]/g, '');
        
        // Ensure + only at the beginning
        let plusCount = (value.match(/\+/g) || []).length;
        if (plusCount > 1) {
            // Keep only the first +
            const firstPlusIndex = value.indexOf('+');
            value = value.substring(0, firstPlusIndex + 1) + value.substring(firstPlusIndex + 1).replace(/\+/g, '');
        } else if (plusCount === 0 && value.length > 0) {
            // Add + at the beginning if user starts typing digits
            if (/\d/.test(value[0])) {
                value = '+' + value;
            }
        }
        
        // Handle hyphen placement
        if (value.includes('+')) {
            const plusIndex = value.indexOf('+');
            let countryCode = '';
            let phoneNumber = '';
            
            // Extract parts after +
            const afterPlus = value.substring(plusIndex + 1);
            
            if (afterPlus.includes('-')) {
                const dashIndex = afterPlus.indexOf('-');
                countryCode = afterPlus.substring(0, dashIndex);
                phoneNumber = afterPlus.substring(dashIndex + 1);
            } else {
                // No hyphen yet, determine where to place it
                if (afterPlus.length > 3) {
                    // Auto-insert hyphen after 3 digits of country code
                    countryCode = afterPlus.substring(0, 3);
                    phoneNumber = afterPlus.substring(3);
                } else {
                    countryCode = afterPlus;
                }
            }
            
            // Limit country code to 3 digits
            countryCode = countryCode.substring(0, 3);
            
            // Limit phone number to 15 digits
            phoneNumber = phoneNumber.substring(0, 15);
            
            // Reconstruct value
            value = '+' + countryCode;
            if (phoneNumber.length > 0 || countryCode.length >= 3) {
                value += '-' + phoneNumber;
            }
        }
        
        setData('businessContactNumber', value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add all text fields
        Object.keys(data).forEach(key => {
            if (key !== 'businessLogo') {
                formData.append(key, data[key]);
            }
        });
        
        // Add businessLogo if it exists
        if (data.businessLogo) formData.append('businessLogo', data.businessLogo);
        
        if (isEditing) {
            // For updates, we need to send a PUT request with FormData
            post(route('business-pages.updates', business.businessID), {
                data: formData,
                onSuccess: () => reset(),
            });
        } else {
            // For creation, we need to send a POST request with FormData
            post(route('business-pages.store'), {
                data: formData,
                onSuccess: () => reset(),
            });
        }
    };

    const businessCategories = [
        { value: 'Pharma', label: 'Pharma' },
        { value: 'Pathlab', label: 'Pathlab' },
        { value: 'Healthcare Professional', label: 'Healthcare Professional' },
        { value: 'Hospital', label: 'Hospital' },
        { value: 'Clinic', label: 'Clinic' },
        { value: 'Medical Device', label: 'Medical Device' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Others', label: 'Others' }
    ];

    const businessTypes = [
        { value: 'Business', label: 'Business' },
        { value: 'Council', label: 'Council' },
        { value: 'Organization', label: 'Organization' },
        { value: 'Individual', label: 'Individual' },
        { value: 'Others', label: 'Others' }
    ];

    const customPageOptions = [
        { value: '0', label: 'No' },
        { value: '1', label: 'Yes' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Business" : "Create Business"} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="px-6 pt-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {isEditing ? 'Edit Business' : 'Create Business'}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {isEditing 
                                            ? 'Update the business information below' 
                                            : 'Fill in the business details to create a new business page'}
                                    </CardDescription>
                                </div>
                                <Link href={route('business-pages.index')} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                                    <LeftOutlined className="mr-1" />
                                    Back to Businesses
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {/* Business Type */}
                                    <div>
                                        <InputLabel for="businessType" value="Business Type" className="text-sm font-medium text-gray-700" />
                                        <Select
                                            id="businessType"
                                            value={data.businessType}
                                            onChange={(value) => setData('businessType', value)}
                                            options={businessTypes}
                                            placeholder="Select business type"
                                            className="w-full mt-1"
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                        <InputError message={errors.businessType} className="mt-2" />
                                    </div>
                                    {/* Business Name */}
                                    <div className="">
                                        <InputLabel for="business_Name" value="Business Name" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="business_Name"
                                            value={data.business_Name}
                                            onChange={(e) => setData('business_Name', e.target.value)}
                                            placeholder="Enter business name"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.business_Name} className="mt-2" />
                                    </div>

                                    {/* Business Description */}
                                    <div className="md:col-span-2">
                                        <InputLabel for="business_description" value="Business Description" className="text-sm font-medium text-gray-700" />
                                        <Textarea
                                            id="business_description"
                                            value={data.business_description}
                                            onChange={(e) => setData('business_description', e.target.value)}
                                            placeholder="Enter business description"
                                            rows={4}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.business_description} className="mt-2" />
                                    </div>

                                    {/* Business Category */}
                                    <div>
                                        <InputLabel for="businessCategory" value="Business Category" className="text-sm font-medium text-gray-700" />
                                        <Select
                                            id="businessCategory"
                                            value={data.businessCategory}
                                            onChange={(value) => setData('businessCategory', value)}
                                            options={businessCategories}
                                            placeholder="Select business category"
                                            className="w-full mt-1"
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                        <InputError message={errors.businessCategory} className="mt-2" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <InputLabel for="businessEmail" value="Business Email" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="businessEmail"
                                            type="email"
                                            value={data.businessEmail}
                                            onChange={(e) => setData('businessEmail', e.target.value)}
                                            placeholder="Enter business email"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.businessEmail} className="mt-2" />
                                    </div>

                                    {/* Contact Number */}
                                    <div>
                                        <InputLabel for="businessContactNumber" value="Contact Number" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="businessContactNumber"
                                            value={data.businessContactNumber}
                                            onChange={handleContactNumberChange}
                                            placeholder="e.g., +1-234567890"
                                            className="mt-1"
                                        />
                                        <div className="text-xs text-gray-500 mt-1">
                                            Format: +[1-3 digits]-[7-15 digits] (e.g., +1-234567890 or +91-9876543210)
                                        </div>
                                        <InputError message={errors.businessContactNumber} className="mt-2" />
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <InputLabel for="businessWebsite" value="Business Website" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="businessWebsite"
                                            type="url"
                                            value={data.businessWebsite}
                                            onChange={(e) => setData('businessWebsite', e.target.value)}
                                            placeholder="https://example.com"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.businessWebsite} className="mt-2" />
                                    </div>

                                    {/* Custom Page */}
                                    <div>
                                        <InputLabel for="isCustomPage" value="Is Custom Page" className="text-sm font-medium text-gray-700" />
                                        <Select
                                            id="isCustomPage"
                                            value={data.isCustomPage}
                                            onChange={(value) => setData('isCustomPage', value)}
                                            options={customPageOptions}
                                            placeholder="Select option"
                                            className="w-full mt-1"
                                        />
                                        <InputError message={errors.isCustomPage} className="mt-2" />
                                    </div>

                                    {/* Custom URL */}
                                    <div>
                                        <InputLabel for="custom_url" value="Custom URL" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="custom_url"
                                            value={data.custom_url}
                                            onChange={(e) => setData('custom_url', e.target.value)}
                                            placeholder="Enter custom URL"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.custom_url} className="mt-2" />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <InputLabel for="businessAddress" value="Business Address" className="text-sm font-medium text-gray-700" />
                                        <Textarea
                                            id="businessAddress"
                                            value={data.businessAddress}
                                            onChange={(e) => setData('businessAddress', e.target.value)}
                                            placeholder="Enter business address"
                                            rows={2}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.businessAddress} className="mt-2" />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <InputLabel for="city" value="City" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Enter city"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <InputLabel for="state" value="State" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder="Enter state"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.state} className="mt-2" />
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <InputLabel for="country" value="Country" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder="Enter country"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.country} className="mt-2" />
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <InputLabel for="businessPincode" value="Pincode" className="text-sm font-medium text-gray-700" />
                                        <Input
                                            id="businessPincode"
                                            value={data.businessPincode}
                                            onChange={(e) => setData('businessPincode', e.target.value)}
                                            placeholder="Enter pincode"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.businessPincode} className="mt-2" />
                                    </div>

                                    {/* Business Logo */}
                                    <div className="md:col-span-2">
                                        <InputLabel for="businessLogo" value="Business Logo (240x71 pixels)" className="text-sm font-medium text-gray-700" />
                                        <UploadCard
                                            id="businessLogo"
                                            file={data.businessLogo}
                                            onFileChange={(file) => setData('businessLogo', file)}
                                            onFileRemove={() => setData('businessLogo', null)}
                                            accept=".jpg,.jpeg,.png,.webp"
                                            maxSize={1048576} // 1MB
                                            dimensions={{ width: 240, height: 71 }}
                                        />
                                        <div className="text-xs text-gray-500 mt-1">
                                            Logo must be exactly 240x71 pixels and maximum 1MB in size
                                        </div>
                                        <InputError message={errors.businessLogo} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex justify-between gap-3 pt-4">
                                    <Link href={route('business-pages.index')}>
                                        <Button variant="outline" disabled={processing}>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}