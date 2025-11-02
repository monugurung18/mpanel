import React from 'react';
import InputLabel from '@/Components/InputLabel';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import Dropdown from '@/Components/Dropdown';
import UploadCard from '@/Components/UploadCard';
import { Select, Switch } from 'antd';
import 'antd/dist/reset.css';
import '../../css/antd-custom.css';

export default function AddCourseStep3({ 
    data, 
    setData, 
    errors, 
    speakersList, 
    loadingSpeakers 
}) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Live Seminar Registration Form Builder</h3>
            <hr className="my-4" />

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    <i className="fa fa-info-circle mr-2"></i>
                    Configure which fields appear in the registration form and whether they're required.
                </p>
            </div>

            {/* Registration Fields Configuration */}
            <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 border-b border-gray-300 pb-3">
                    <div className="col-span-8">
                        <h5 className="font-semibold text-gray-700">Registration Fields</h5>
                    </div>
                    <div className="col-span-4 text-center">
                        <h5 className="font-semibold text-gray-700">Required</h5>
                    </div>
                </div>

                {/* Title Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_title_enabled}
                            onChange={(checked) => setData('reg_title_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Title</span>
                        {data.reg_title_enabled && (
                            <Select
                                mode="multiple"
                                size="small"
                                placeholder="Select titles"
                                value={data.reg_title_options}
                                onChange={(value) => setData('reg_title_options', value)}
                                options={[
                                    { value: 'Dr.', label: 'Dr.' },
                                    { value: 'Mr.', label: 'Mr.' },
                                    { value: 'Miss.', label: 'Miss.' },
                                    { value: 'Mrs.', label: 'Mrs.' },
                                    { value: 'Rural Practitioners', label: 'Rural Practitioners' },
                                    { value: 'Lawyer', label: 'Lawyer' },
                                    { value: 'Businessman', label: 'Businessman' },
                                    { value: 'Engineer', label: 'Engineer' }
                                ]}
                                className="ml-4 w-48"
                                showSearch
                            />
                        )}
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_title_required}
                            onChange={(checked) => setData('reg_title_required', checked)}
                            disabled={!data.reg_title_enabled}
                        />
                    </div>
                </div>

                {/* First Name Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_first_name_enabled}
                            onChange={(checked) => setData('reg_first_name_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">First Name</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_first_name_required}
                            onChange={(checked) => setData('reg_first_name_required', checked)}
                            disabled={!data.reg_first_name_enabled}
                        />
                    </div>
                </div>

                {/* Last Name Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_last_name_enabled}
                            onChange={(checked) => setData('reg_last_name_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Last Name</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_last_name_required}
                            onChange={(checked) => setData('reg_last_name_required', checked)}
                            disabled={!data.reg_last_name_enabled}
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_email_enabled}
                            onChange={(checked) => setData('reg_email_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Email</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_email_required}
                            onChange={(checked) => setData('reg_email_required', checked)}
                            disabled={!data.reg_email_enabled}
                        />
                    </div>
                </div>

                {/* Mobile Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_mobile_enabled}
                            onChange={(checked) => setData('reg_mobile_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Mobile</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_mobile_required}
                            onChange={(checked) => setData('reg_mobile_required', checked)}
                            disabled={!data.reg_mobile_enabled}
                        />
                    </div>
                </div>

                {/* City Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_city_enabled}
                            onChange={(checked) => setData('reg_city_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">City</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_city_required}
                            onChange={(checked) => setData('reg_city_required', checked)}
                            disabled={!data.reg_city_enabled}
                        />
                    </div>
                </div>

                {/* State Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_state_enabled}
                            onChange={(checked) => setData('reg_state_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">State</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_state_required}
                            onChange={(checked) => setData('reg_state_required', checked)}
                            disabled={!data.reg_state_enabled}
                        />
                    </div>
                </div>

                {/* Specialty Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_specialty_enabled}
                            onChange={(checked) => setData('reg_specialty_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Specialty</span>
                        {data.reg_specialty_enabled && (
                            <Select
                                mode="multiple"
                                size="small"
                                placeholder="Select specialties"
                                value={data.reg_specialty_options}
                                onChange={(value) => setData('reg_specialty_options', value)}
                                options={[]} // This will be passed as a prop
                                className="ml-4 w-48"
                                showSearch
                            />
                        )}
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_specialty_required}
                            onChange={(checked) => setData('reg_specialty_required', checked)}
                            disabled={!data.reg_specialty_enabled}
                        />
                    </div>
                </div>

                {/* Medical Registration No Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_medical_reg_enabled}
                            onChange={(checked) => setData('reg_medical_reg_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Medical Registration No</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_medical_reg_required}
                            onChange={(checked) => setData('reg_medical_reg_required', checked)}
                            disabled={!data.reg_medical_reg_enabled}
                        />
                    </div>
                </div>

                {/* Medical Council Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_medical_council_enabled}
                            onChange={(checked) => setData('reg_medical_council_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Medical Council</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_medical_council_required}
                            onChange={(checked) => setData('reg_medical_council_required', checked)}
                            disabled={!data.reg_medical_council_enabled}
                        />
                    </div>
                </div>

                {/* Profession Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_profession_enabled}
                            onChange={(checked) => setData('reg_profession_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Profession</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_profession_required}
                            onChange={(checked) => setData('reg_profession_required', checked)}
                            disabled={!data.reg_profession_enabled}
                        />
                    </div>
                </div>

                {/* DRL Code Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_drl_code_enabled}
                            onChange={(checked) => setData('reg_drl_code_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">DRL Code</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_drl_code_required}
                            onChange={(checked) => setData('reg_drl_code_required', checked)}
                            disabled={!data.reg_drl_code_enabled}
                        />
                    </div>
                </div>

                {/* Country Field */}
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-8 flex items-center">
                        <Switch
                            checked={data.reg_country_enabled}
                            onChange={(checked) => setData('reg_country_enabled', checked)}
                            className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Country</span>
                    </div>
                    <div className="col-span-4 text-center">
                        <Switch
                            checked={data.reg_country_required}
                            onChange={(checked) => setData('reg_country_required', checked)}
                            disabled={!data.reg_country_enabled}
                        />
                    </div>
                </div>
            </div>

            {/* Note Text and Left Text */}
            <div className="mt-8 space-y-4">
                <h4 className="text-md font-semibold text-gray-800">Additional Text</h4>
                
                <div>
                    <InputLabel htmlFor="note_text" value="Note Text" />
                    <Input
                        id="note_text"
                        type="text"
                        value={data.note_text || ''}
                        onChange={(e) => setData('note_text', e.target.value)}
                        placeholder="Enter note text"
                        className="mt-1"
                    />
                </div>
                
                <div>
                    <InputLabel htmlFor="left_text" value="Left Text" />
                    <Input
                        id="left_text"
                        type="text"
                        value={data.left_text || ''}
                        onChange={(e) => setData('left_text', e.target.value)}
                        placeholder="Enter left text"
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Webinar Banners Section */}
            <div className="mt-8 space-y-4">
                <h4 className="text-md font-semibold text-gray-800">Webinar Banners</h4>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Invite Banner - 700x393 */}
                    <div>
                        <InputLabel value="Invite Banner (700x393, Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="invite_banner"
                                onChange={(e) => setData('invite_banner', e.target.files[0])}
                                className="hidden"
                                id="invite_banner"
                            />
                            <label 
                                htmlFor="invite_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Invite Banner" 
                                    description="Dimensions: 700x393px | Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Responsive Invite Banner - 700x393 */}
                    <div>
                        <InputLabel value="Responsive Invite Banner (700x393, Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="responsive_invite_banner"
                                onChange={(e) => setData('responsive_invite_banner', e.target.files[0])}
                                className="hidden"
                                id="responsive_invite_banner"
                            />
                            <label 
                                htmlFor="responsive_invite_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Responsive Invite Banner" 
                                    description="Dimensions: 700x393px | Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Timezone Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Timezone Banner (Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="timezone_banner"
                                onChange={(e) => setData('timezone_banner', e.target.files[0])}
                                className="hidden"
                                id="timezone_banner"
                            />
                            <label 
                                htmlFor="timezone_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Timezone Banner" 
                                    description="Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Responsive Timezone Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Responsive Timezone Banner (Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="responsive_timezone_banner"
                                onChange={(e) => setData('responsive_timezone_banner', e.target.files[0])}
                                className="hidden"
                                id="responsive_timezone_banner"
                            />
                            <label 
                                htmlFor="responsive_timezone_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Responsive Timezone Banner" 
                                    description="Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Certificate - No specific dimensions */}
                    <div>
                        <InputLabel value="Certificate (Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="certificate"
                                onChange={(e) => setData('certificate', e.target.files[0])}
                                className="hidden"
                                id="certificate"
                            />
                            <label 
                                htmlFor="certificate"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Certificate" 
                                    description="Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Video Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Video Banner (Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="video_banner"
                                onChange={(e) => setData('video_banner', e.target.files[0])}
                                className="hidden"
                                id="video_banner"
                            />
                            <label 
                                htmlFor="video_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Video Banner" 
                                    description="Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Strip Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Strip Banner (Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="strip_banner"
                                onChange={(e) => setData('strip_banner', e.target.files[0])}
                                className="hidden"
                                id="strip_banner"
                            />
                            <label 
                                htmlFor="strip_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Strip Banner" 
                                    description="Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Ads Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Ads Banner (Max 1MB)" />
                        <div className="mt-2">
                            <input
                                type="file"
                                name="ads_banner"
                                onChange={(e) => setData('ads_banner', e.target.files[0])}
                                className="hidden"
                                id="ads_banner"
                            />
                            <label 
                                htmlFor="ads_banner"
                                className="cursor-pointer"
                            >
                                <UploadCard 
                                    title="Upload Ads Banner" 
                                    description="Max Size: 1MB | Formats: JPG, JPEG, PNG, GIF, WEBP" 
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Moderators, Panelists, Speakers, Chief Guests */}
            <div className="mt-8 space-y-4">
                <h4 className="text-md font-semibold text-gray-800">Participants</h4>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Moderators */}
                    <div>
                        <InputLabel value="Moderators" />
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="Select moderators"
                            value={data.moderators || []}
                            onChange={(value) => setData('moderators', value)}
                            loading={loadingSpeakers}
                            options={speakersList}
                            className="w-full"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="label"
                            showSearch
                        />
                    </div>

                    {/* Panelists */}
                    <div>
                        <InputLabel value="Panelists" />
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="Select panelists"
                            value={data.panelists || []}
                            onChange={(value) => setData('panelists', value)}
                            loading={loadingSpeakers}
                            options={speakersList}
                            className="w-full"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="label"
                            showSearch
                        />
                    </div>

                    {/* Speakers */}
                    <div>
                        <InputLabel value="Speakers" />
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="Select speakers"
                            value={data.speakers || []}
                            onChange={(value) => setData('speakers', value)}
                            loading={loadingSpeakers}
                            options={speakersList}
                            className="w-full"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="label"
                            showSearch
                        />
                    </div>

                    {/* Chief Guests */}
                    <div>
                        <InputLabel value="Chief Guests" />
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="Select chief guests"
                            value={data.chief_guests || []}
                            onChange={(value) => setData('chief_guests', value)}
                            loading={loadingSpeakers}
                            options={speakersList}
                            className="w-full"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="label"
                            showSearch
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}