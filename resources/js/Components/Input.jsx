import { forwardRef, useEffect, useRef } from 'react';

/**
 * Input Component
 * 
 * A modern, themed input component with support for various types,
 * icons, and custom styling using the #00895f theme color.
 * 
 * @param {string} type - Input type (text, email, password, number, etc.)
 * @param {string} className - Additional CSS classes
 * @param {boolean} isFocused - Auto-focus on mount
 * @param {string} icon - Font Awesome icon class (e.g., 'fa-user')
 * @param {string} iconPosition - Icon position: 'left' or 'right'
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text below input
 * @param {string} size - Input size: 'sm', 'md', 'lg'
 * @param {boolean} disabled - Disabled state
 * @param {object} ...props - Other input props
 */
export default forwardRef(function Input(
    { 
        type = 'text', 
        className = '', 
        isFocused = false, 
        icon = null,
        iconPosition = 'left',
        error = null,
        helperText = null,
        size = 'md',
        disabled = false,
        ...props 
    }, 
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    const sizeClasses = {
        sm: ' py-1 text-sm',
        md: 'py-1.5 text-sm',
        lg: 'py-2 text-sm',
    };

    const baseClasses = `
        w-full rounded-lg border transition-all duration-200
        ${error 
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20' 
            : 'border-gray-300 focus:border-[#00895f] focus:ring-2 focus:ring-[#00895f]/20'
        }
        ${disabled 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'bg-white text-gray-900'
        }
       
        ${sizeClasses[size]}
        placeholder:text-gray-400
        disabled:opacity-60
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className="relative">          

            {/* Input Field */}
            <input
                {...props}
                type={type}
                className={`mt-1 ${baseClasses}`}
                ref={input}
                disabled={disabled}
            />

            {/* Error Message */}
            {error && (
                <div className="mt-1.5 flex items-center space-x-1 text-sm text-red-600">
                    <i className="fa fa-exclamation-circle"></i>
                    <span>{error}</span>
                </div>
            )}

            {/* Helper Text */}
            {!error && helperText && (
                <div className="mt-1.5 text-sm text-gray-500">
                    {helperText}
                </div>
            )}
        </div>
    );
});
