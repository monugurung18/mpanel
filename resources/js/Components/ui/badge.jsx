import React from 'react';

const Badge = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-100 text-gray-800',
    dark: 'bg-gray-800 text-gray-100'
  };

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export { Badge };