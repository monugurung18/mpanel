import React from 'react';

export default function UploadCard({ title, description }) {
    return (
        <div className="flex items-center justify-between border rounded-lg p-2 bg-white shadow-sm w-full max-w-md mt-2 cursor-pointer">
            <div className="flex items-center space-x-3">
                <button 
                    type='button' 
                    className="text-gray-400 hover:text-red-500 bg-gray-300 p-4 rounded-md"
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
                        <span className="text-sm text-gray-700 font-medium truncate">
                            {title}
                        </span>
                    </p>
                    <p className='text-xs text-gray-400'>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}