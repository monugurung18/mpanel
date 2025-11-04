import React from 'react';
import InputLabel from '@/Components/InputLabel';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import Dropdown from '@/Components/Dropdown';
import { Textarea } from '@/Components/ui/textarea';

import UploadCard from '@/Components/UploadCard';
import { Select, Switch } from 'antd';
import 'antd/dist/reset.css';
import '../../css/antd-custom.css';

export default function AddCourseStep3({ 
    data, 
    setData, 
    errors, 
    speakersList, 
    loadingSpeakers,
    specialities
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
                                options={specialities || []}
                                className="ml-4 w-full"
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
                    <Textarea
                        id="note_text"
                        value={data.note_text || ''}
                        onChange={(e) => setData('note_text', e.target.value)}
                        placeholder="Enter note text"
                        className="mt-1"
                    />      
                </div>
                
                <div>
                    <InputLabel htmlFor="left_text" value="Left Text" />
                    <Textarea
                        id="left_text"
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
                            <UploadCard
                                id="invite_banner"
                                file={data.invite_banner}
                                onFileChange={(file) => setData('invite_banner', file)}
                                onFileRemove={() => setData('invite_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                                dimensions={{ width: 700, height: 393 }}
                            />
                        </div>
                    </div>

                    {/* Responsive Invite Banner - 700x393 */}
                    <div>
                        <InputLabel value="Responsive Invite Banner (700x393, Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="responsive_invite_banner"
                                file={data.responsive_invite_banner}
                                onFileChange={(file) => setData('responsive_invite_banner', file)}
                                onFileRemove={() => setData('responsive_invite_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                                dimensions={{ width: 700, height: 393 }}
                            />
                        </div>
                    </div>

                    {/* Timezone Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Timezone Banner (Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="timezone_banner"
                                file={data.timezone_banner}
                                onFileChange={(file) => setData('timezone_banner', file)}
                                onFileRemove={() => setData('timezone_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                            />
                        </div>
                    </div>

                    {/* Responsive Timezone Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Responsive Timezone Banner (Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="responsive_timezone_banner"
                                file={data.responsive_timezone_banner}
                                onFileChange={(file) => setData('responsive_timezone_banner', file)}
                                onFileRemove={() => setData('responsive_timezone_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                            />
                        </div>
                    </div>

                    {/* Certificate - No specific dimensions */}
                    <div>
                        <InputLabel value="Certificate (Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="certificate"
                                file={data.certificate}
                                onFileChange={(file) => setData('certificate', file)}
                                onFileRemove={() => setData('certificate', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                            />
                        </div>
                    </div>

                    {/* Video Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Video Banner (Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="video_banner"
                                file={data.video_banner}
                                onFileChange={(file) => setData('video_banner', file)}
                                onFileRemove={() => setData('video_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                            />
                        </div>
                    </div>

                    {/* Strip Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Strip Banner (Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="strip_banner"
                                file={data.strip_banner}
                                onFileChange={(file) => setData('strip_banner', file)}
                                onFileRemove={() => setData('strip_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                            />
                        </div>
                    </div>

                    {/* Ads Banner - No specific dimensions */}
                    <div>
                        <InputLabel value="Ads Banner (Max 1MB)" />
                        <div className="mt-2">
                            <UploadCard
                                id="ads_banner"
                                file={data.ads_banner}
                                onFileChange={(file) => setData('ads_banner', file)}
                                onFileRemove={() => setData('ads_banner', null)}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                maxSize={1048576} // 1MB
                            />
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