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

    // Handle file validation
    const validateFile = (file) => {
        // Check file type
        const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase());
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExt)) {
            const errorMsg = `Invalid file type. Allowed types: ${accept.replace(/\./g, '').toUpperCase()}`;
            setError(errorMsg);
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            const errorMsg = `File size exceeds ${maxSize/1024/1024}MB limit`;
            setError(errorMsg);
            return false;
        }

        // If dimensions are specified, check them
        if (dimensions) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width !== dimensions.width || img.height !== dimensions.height) {
                    const errorMsg = `Image must be exactly ${dimensions.width}x${dimensions.height} pixels`;
                    setError(errorMsg);
                    URL.revokeObjectURL(img.src);
                    return false;
                }
                URL.revokeObjectURL(img.src);
                setError(null);
                return true;
            };
        }

        setError(null);
        return true;
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // For dimension validation, we need to use a promise-based approach
            if (dimensions) {
                const img = new Image();
                img.src = URL.createObjectURL(selectedFile);
                img.onload = () => {
                    if (img.width !== dimensions.width || img.height !== dimensions.height) {
                        const errorMsg = `Image must be exactly ${dimensions.width}x${dimensions.height} pixels`;
                        setError(errorMsg);
                        message.error(errorMsg);
                        URL.revokeObjectURL(img.src);
                        return;
                    }
                    URL.revokeObjectURL(img.src);
                    
                    // Continue with other validations
                    if (selectedFile.size > maxSize) {
                        const errorMsg = `File size exceeds ${maxSize/1024/1024}MB limit`;
                        setError(errorMsg);
                        message.error(errorMsg);
                        return;
                    }
                    
                    const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase());
                    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
                    if (!allowedTypes.includes(fileExt)) {
                        const errorMsg = `Invalid file type. Allowed types: ${accept.replace(/\./g, '').toUpperCase()}`;
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
                    URL.revokeObjectURL(img.src);
                    const errorMsg = 'Failed to load image';
                    setError(errorMsg);
                    message.error(errorMsg);
                };
            } else {
                // No dimension validation needed
                if (validateFile(selectedFile)) {
                    onFileChange(selectedFile);
                    // Create preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreview(e.target.result);
                    };
                    reader.readAsDataURL(selectedFile);
                } else {
                    // Show error message
                    message.error(error || 'Invalid file');
                }
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
                                    e.target.src = '/path/to/placeholder-image.png'; // Fallback image
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
                                src={`/storage/${file}`} 
                                alt="Preview" 
                                className="h-16 w-16 object-cover rounded-md border"
                                onError={(e) => {
                                    e.target.src = '/path/to/placeholder-image.png'; // Fallback image
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