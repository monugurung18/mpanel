import { useState, useRef, useEffect } from 'react';

/**
 * Dropdown Component
 * 
 * A modern, themed dropdown/select component with search functionality,
 * multi-select support, and custom styling using the #00895f theme color.
 * 
 * @param {array} options - Array of {value, label} objects
 * @param {string|array} value - Selected value(s)
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} multiple - Enable multi-select
 * @param {boolean} searchable - Enable search functionality
 * @param {string} className - Additional CSS classes
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {boolean} disabled - Disabled state
 * @param {string} size - Dropdown size: 'sm', 'md', 'lg'
 * @param {string} icon - Font Awesome icon class
 * @param {boolean} clearable - Show clear button
 * @param {string} emptyMessage - Message when no options available
 */
export default function Dropdown({
    options = [],
    value = null,
    onChange,
    placeholder = 'Select an option',
    multiple = false,
    searchable = false,
    className = '',
    error = null,
    helperText = null,
    disabled = false,
    size = 'md',
    icon = null,
    clearable = true,
    emptyMessage = 'No options available',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Get selected label(s)
    const getSelectedLabel = () => {
        if (!value) return placeholder;
        
        if (multiple) {
            const selectedOptions = options.filter(opt => value.includes(opt.value));
            if (selectedOptions.length === 0) return placeholder;
            if (selectedOptions.length === 1) return selectedOptions[0].label;
            return `${selectedOptions.length} selected`;
        }
        
        const selected = options.find(opt => opt.value === value);
        return selected ? selected.label : placeholder;
    };

    // Filter options based on search
    const filteredOptions = searchable && searchTerm
        ? options.filter(opt => 
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    // Handle option selection
    const handleSelect = (optionValue) => {
        if (multiple) {
            const newValue = value || [];
            if (newValue.includes(optionValue)) {
                onChange(newValue.filter(v => v !== optionValue));
            } else {
                onChange([...newValue, optionValue]);
            }
        } else {
            onChange(optionValue);
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    // Check if option is selected
    const isSelected = (optionValue) => {
        if (multiple) {
            return value && value.includes(optionValue);
        }
        return value === optionValue;
    };

    // Clear selection
    const handleClear = (e) => {
        e.stopPropagation();
        onChange(multiple ? [] : null);
        setSearchTerm('');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2 text-sm',
    };

    const hasValue = multiple ? (value && value.length > 0) : value;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={` mt-1 
                    w-full rounded-lg border transition-all duration-200
                    flex items-center justify-between 
                    ${error 
                        ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20' 
                        : isOpen 
                            ? 'border-[#00895f] ring-2 ring-[#00895f]/20'
                            : 'border-gray-300 hover:border-[#00895f]'
                    }
                    ${disabled 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-white text-gray-900'
                    }
                    ${sizeClasses[size]}
                    
                    ${className}
                `.trim().replace(/\s+/g, ' ')}
            >
              

                {/* Selected Value */}
                <span className={`flex-1 text-left truncate ${!hasValue ? 'text-gray-400' : ''}`}>
                    {getSelectedLabel()}
                </span>

                {/* Clear Button */}
                {clearable && hasValue && !disabled && (
                    <span
                        onClick={handleClear}
                        className="mr-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <i className="fa fa-times-circle"></i>
                    </span>
                )}

                {/* Arrow Icon */}
                <i className={`fa fa-chevron-down text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                }`}></i>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`
                    absolute z-50 mt-2 w-full
                    bg-white rounded-lg shadow-xl border border-gray-200
                    max-h-64 overflow-hidden
                    animate-in fade-in slide-in-from-top-2 duration-200
                `}>
                    {/* Search Input */}
                    {searchable && (
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00895f] focus:ring-2 focus:ring-[#00895f]/20 outline-none transition-all"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-48">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                <i className="fa fa-inbox text-2xl mb-2"></i>
                                <p>{emptyMessage}</p>
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        w-full px-4 py-3 text-left transition-colors
                                        flex items-center justify-between
                                        ${isSelected(option.value)
                                            ? 'bg-emerald-50 text-[#00895f] font-medium'
                                            : 'text-gray-900 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <span className="flex-1">{option.label}</span>
                                    {isSelected(option.value) && (
                                        <i className="fa fa-check text-[#00895f]"></i>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

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
}
