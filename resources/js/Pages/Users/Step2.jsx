import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Input from '@/Components/Input';
import { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Select } from 'antd';
import 'antd/dist/reset.css';

const { Option } = Select;

export default function UserStep2({ step1Data, education, workHistory, specialities }) {
    const { data, setData, post, processing } = useForm({
        education: education && education.length > 0 ? education.map(edu => ({
            id: edu.edu_id || null,
            degree: edu.degree || '',
            university: edu.university || '',
            completed_in: edu.completed_in || '',
            speciality: edu.speciality || '',
        })) : [{ id: null, degree: '', university: '', completed_in: '', speciality: '' }],
        
        workHistory: workHistory && workHistory.length > 0 ? workHistory.map(work => ({
            id: work.w_id || null,
            clinic_name: work.clinic_name || '',
            clinic_locality: work.clinic_locality || '',
            designation: work.designaion || '',
            speciality: work.speciality || '',
        })) : [{ id: null, clinic_name: '', clinic_locality: '', designation: '', speciality: '' }],
    });

    const addEducationField = () => {
        setData('education', [...data.education, { id: null, degree: '', university: '', completed_in: '', speciality: '' }]);
    };

    const removeEducationField = (index) => {
        const newEducation = [...data.education];
        newEducation.splice(index, 1);
        setData('education', newEducation);
    };

    const updateEducationField = (index, field, value) => {
        const newEducation = [...data.education];
        newEducation[index][field] = value;
        setData('education', newEducation);
    };

    const addWorkField = () => {
        setData('workHistory', [...data.workHistory, { id: null, clinic_name: '', clinic_locality: '', designation: '', speciality: '' }]);
    };

    const removeWorkField = (index) => {
        const newWork = [...data.workHistory];
        newWork.splice(index, 1);
        setData('workHistory', newWork);
    };

    const updateWorkField = (index, field, value) => {
        const newWork = [...data.workHistory];
        newWork[index][field] = value;
        setData('workHistory', newWork);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store.step2'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Instructor - Step 2" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-6">
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    Create New Instructor - Step 2 of 3
                                </h2>
                                <Link 
                                    href={route('users.create')} 
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <LeftOutlined className="mr-1" />
                                    Back to Step 1
                                </Link>
                            </div>

                            {/* Progress Indicator */}
                            <div className="mb-8">
                                <div className="flex items-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                        1
                                    </div>
                                    <div className="h-1 w-16 bg-[#00895f]"></div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00895f] text-white">
                                        2
                                    </div>
                                    <div className="h-1 w-16 bg-gray-200"></div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                        3
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-between text-sm text-gray-500">
                                    <span>Basic Information</span>
                                    <span>Education & Work</span>
                                    <span>Finalize</span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <form onSubmit={submit} className="space-y-8">
                                    {/* Education Section */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Education</h3>
                                            <Button 
                                                type="button" 
                                                onClick={addEducationField}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Add Education
                                            </Button>
                                        </div>
                                        
                                        {data.education.map((edu, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                                                <div className="md:col-span-3">
                                                    <InputLabel for={`degree-${index}`} value="Degree" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`degree-${index}`}
                                                        type="text"
                                                        placeholder="Enter degree"
                                                        value={edu.degree}
                                                        onChange={(e) => updateEducationField(index, 'degree', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-3">
                                                    <InputLabel for={`university-${index}`} value="University" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`university-${index}`}
                                                        type="text"
                                                        placeholder="Enter university"
                                                        value={edu.university}
                                                        onChange={(e) => updateEducationField(index, 'university', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-3">
                                                    <InputLabel for={`completed_in-${index}`} value="Completed In" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`completed_in-${index}`}
                                                        type="text"
                                                        placeholder="e.g., 2010 - 2015"
                                                        value={edu.completed_in}
                                                        onChange={(e) => updateEducationField(index, 'completed_in', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                    <InputLabel for={`edu_speciality-${index}`} value="Speciality" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`edu_speciality-${index}`}
                                                        type="text"
                                                        placeholder="Enter speciality"
                                                        value={edu.speciality}
                                                        onChange={(e) => updateEducationField(index, 'speciality', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-1 flex items-end">
                                                    <Button 
                                                        type="button" 
                                                        onClick={() => removeEducationField(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={data.education.length <= 1}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Work History Section */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Work History</h3>
                                            <Button 
                                                type="button" 
                                                onClick={addWorkField}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Add Work History
                                            </Button>
                                        </div>
                                        
                                        {data.workHistory.map((work, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                                                <div className="md:col-span-3">
                                                    <InputLabel for={`clinic_name-${index}`} value="Clinic/Hospital Name" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`clinic_name-${index}`}
                                                        type="text"
                                                        placeholder="Enter clinic/hospital name"
                                                        value={work.clinic_name}
                                                        onChange={(e) => updateWorkField(index, 'clinic_name', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-3">
                                                    <InputLabel for={`clinic_locality-${index}`} value="Locality" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`clinic_locality-${index}`}
                                                        type="text"
                                                        placeholder="Enter locality"
                                                        value={work.clinic_locality}
                                                        onChange={(e) => updateWorkField(index, 'clinic_locality', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-3">
                                                    <InputLabel for={`designation-${index}`} value="Designation" className="text-sm font-medium text-gray-700" />
                                                    <Input
                                                        id={`designation-${index}`}
                                                        type="text"
                                                        placeholder="Enter designation"
                                                        value={work.designation}
                                                        onChange={(e) => updateWorkField(index, 'designation', e.target.value)}
                                                        className="w-full py-1.5 mt-1 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                    <InputLabel for={`work_speciality-${index}`} value="Speciality" className="text-sm font-medium text-gray-700" />
                                                    <Select
                                                        id={`work_speciality-${index}`}
                                                        value={work.speciality}
                                                        onChange={(value) => updateWorkField(index, 'speciality', value)}
                                                        className="w-full mt-1"
                                                        placeholder="Select Speciality"
                                                        showSearch
                                                        optionFilterProp="label"
                                                    >
                                                        {specialities && specialities.map(spec => (
                                                            <Option key={spec.no} value={spec.no}>{spec.title}</Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                                
                                                <div className="md:col-span-1 flex items-end">
                                                    <Button 
                                                        type="button" 
                                                        onClick={() => removeWorkField(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={data.workHistory.length <= 1}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-6">
                                        <Link href={route('users.create')}>
                                            <Button variant="outline" className="uppercase">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4 mr-2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                Back to Step 1
                                            </Button>
                                        </Link>
                                        <PrimaryButton 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-[#00895f] hover:bg-[#007a52]"
                                        >
                                            Continue to Step 3
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-4 ml-2">
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