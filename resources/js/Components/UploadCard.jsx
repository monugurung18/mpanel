import React, { useState, useRef } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export default function UploadCard({ 
    id, 
    file, 
    onFileChange, 
    onFileRemove, 
    accept = '.jpg,.jpeg,.png,.webp',
    maxSize = 1048576, // 1MB default
    dimensions = null // { width, height }
}) {
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file type
            const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase());
            const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(fileExt)) {
                const errorMsg = `Invalid file type. Allowed types: ${accept.replace(/\./g, '').toUpperCase()}`;
                setError(errorMsg);
                message.error(errorMsg);
                return;
            }

            // Check file size
            if (selectedFile.size > maxSize) {
                const errorMsg = `File size exceeds ${maxSize/1024/1024}MB limit`;
                setError(errorMsg);
                message.error(errorMsg);
                return;
            }

            // If dimensions are specified, check them
            if (dimensions) {
                const img = new Image();
                const objectUrl = URL.createObjectURL(selectedFile);
                img.src = objectUrl;
                
                img.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                    
                    if (img.width !== dimensions.width || img.height !== dimensions.height) {
                        const errorMsg = `Image must be exactly ${dimensions.width}x${dimensions.height} pixels. Current: ${img.width}x${img.height}`;
                        setError(errorMsg);
                        message.error(errorMsg);
                        return;
                    }
                    
                    // All validations passed
                    onFileChange(selectedFile);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreview(e.target.result);
                    };
                    reader.readAsDataURL(selectedFile);
                    setError(null);
                };
                
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    const errorMsg = 'Failed to load image';
                    setError(errorMsg);
                    message.error(errorMsg);
                };
            } else {
                // No dimension validation needed
                onFileChange(selectedFile);
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreview(e.target.result);
                };
                reader.readAsDataURL(selectedFile);
                setError(null);
            }
        }
    };

    // Handle file removal
    const handleRemove = () => {
        onFileRemove();
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Function to check if file is a string (path) or File object
    const isFileObject = (file) => {
        return file && typeof file === 'object' && file instanceof File;
    };

    // Simple placeholder image as data URL to avoid 404 errors
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M20,20 L80,20 L80,80 L20,80 Z' fill='none' stroke='%23ccc' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%23ccc' stroke-width='2'/%3E%3C/svg%3E";

    return (
        <div className="mt-2">
            {preview || (file && isFileObject(file)) ? (
                // Preview mode for File objects
                <div className="border rounded-lg p-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img 
                                src={preview || (file && URL.createObjectURL(file))} 
                                alt="Preview" 
                                className="h-16 w-16 object-cover rounded-md border"
                                onError={(e) => {
                                    e.target.src = placeholderImage; // Fallback to data URL placeholder
                                }}
                            />
                            <div>
                                <p className="text-sm text-gray-700 font-medium truncate">
                                    {file ? file.name : 'Uploaded Image'}
                                </p>
                                {file && (
                                    <p className="text-xs text-gray-500">
                                        {(file.size/1024).toFixed(1)} KB
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : file && typeof file === 'string' ? (
                // Preview mode for file paths (existing images)
                <div className="border rounded-lg p-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img 
                                src={`${file}`} 
                                alt="Preview" 
                                className="h-16 w-16 object-cover rounded-md border"
                                onError={(e) => {
                                    e.target.src = placeholderImage; // Fallback to data URL placeholder
                                }}
                            />
                            <div>
                                <p className="text-sm text-gray-700 font-medium">
                                    Uploaded Image
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                // Upload mode
                <div className="flex items-center justify-between border rounded-lg p-2 bg-white shadow-sm w-full cursor-pointer hover:bg-gray-50"
                     onClick={() => fileInputRef.current?.click()}>
                    <div className="flex items-center space-x-3">
                        <button 
                            type='button' 
                            className="text-gray-400 bg-gray-100 p-3 rounded-md"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="size-5"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M12 4.5v15m7.5-7.5h-15" 
                                />
                            </svg>
                        </button>
                        <div>
                            <p className='mb-0'>
                                <span className="text-sm text-gray-700 font-medium">
                                    Upload Image
                                </span>
                            </p>
                            <p className='text-xs text-gray-500'>
                                {accept.replace(/\./g, '').toUpperCase()} up to {maxSize/1024/1024}MB
                                {dimensions && ` (${dimensions.width}×${dimensions.height}px)`}
                            </p>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}