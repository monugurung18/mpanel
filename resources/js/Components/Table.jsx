import { useState, useMemo } from 'react';

/**
 * Reusable Table Component with Advanced Features
 * Similar to Ant Design Table with sorting, pagination, search, filters, and export
 * 
 * @param {Array} columns - Column configuration array
 * @param {Array} dataSource - Data array to display
 * @param {Function} onRow - Row click handler
 * @param {Boolean} loading - Loading state
 * @param {Object} pagination - Pagination config { current, pageSize, total, onChange }
 * @param {String} rowKey - Unique key for each row (default: 'id')
 * @param {String} size - Table size: 'default', 'small', 'large'
 * @param {Boolean} bordered - Show borders
 * @param {Boolean} striped - Alternate row colors
 * @param {String} emptyText - Text to show when no data
 * @param {Boolean} showSearch - Show search input (default: true)
 * @param {String} searchPlaceholder - Search input placeholder
 * @param {Array} searchableColumns - Column keys to search in (default: all)
 * @param {Boolean} showExport - Show export button (default: true)
 * @param {String} exportFileName - Export file name (default: 'export')
 * @param {Object} filters - Filter configuration { columnKey: [values] }
 * @param {Function} onFilterChange - Filter change callback
 */
export default function Table({
    columns = [],
    dataSource = [],
    onRow,
    loading = false,
    pagination = false,
    rowKey = 'id',
    size = 'default',
    bordered = false,
    striped = false,
    emptyText = 'No data available',
    className = '',
    showSearch = true,
    searchPlaceholder = 'Search...',
    searchableColumns = null,
    showExport = true,
    exportFileName = 'export',
    filters = {},
    onFilterChange,
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});

    // Get size classes
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'text-xs';
            case 'large':
                return 'text-base';
            default:
                return 'text-sm';
        }
    };

    // Get padding classes based on size
    const getPaddingClasses = () => {
        switch (size) {
            case 'small':
                return 'px-3 py-2';
            case 'large':
                return 'px-8 py-5';
            default:
                return 'px-6 py-4';
        }
    };

    // Handle filter change
    const handleFilterChange = (columnKey, value) => {
        const newFilters = { ...activeFilters };
        
        if (value === '' || value === null || value === undefined) {
            delete newFilters[columnKey];
        } else {
            newFilters[columnKey] = value;
        }
        
        setActiveFilters(newFilters);
        
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    // Filter data based on active filters
    const getFilteredData = (data) => {
        if (Object.keys(activeFilters).length === 0) return data;

        return data.filter((record) => {
            return Object.entries(activeFilters).every(([columnKey, filterValue]) => {
                const column = columns.find((col) => col.key === columnKey || col.dataIndex === columnKey);
                if (!column) return true;

                const recordValue = record[column.dataIndex || column.key];

                if (Array.isArray(filterValue)) {
                    return filterValue.includes(recordValue);
                }

                if (typeof recordValue === 'string') {
                    return recordValue.toLowerCase().includes(String(filterValue).toLowerCase());
                }

                return recordValue === filterValue;
            });
        });
    };

    // Search functionality
    const getSearchedData = (data) => {
        if (!searchTerm || searchTerm.trim() === '') return data;

        const searchLower = searchTerm.toLowerCase();
        const columnsToSearch = searchableColumns || columns.map((col) => col.dataIndex || col.key);

        return data.filter((record) => {
            return columnsToSearch.some((columnKey) => {
                const value = record[columnKey];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchLower);
            });
        });
    };
    const handleSort = (columnKey) => {
        const column = columns.find((col) => col.key === columnKey || col.dataIndex === columnKey);
        if (!column || !column.sorter) return;

        let direction = 'asc';
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === columnKey && sortConfig.direction === 'desc') {
            direction = null;
        }

        setSortConfig({ key: columnKey, direction });
    };

    // Sort data
    const getSortedData = () => {
        const filteredData = getFilteredData(dataSource);
        const searchedData = getSearchedData(filteredData);
        
        if (!sortConfig.key || !sortConfig.direction) return searchedData;

        const column = columns.find((col) => col.key === sortConfig.key || col.dataIndex === sortConfig.key);
        if (!column || !column.sorter) return searchedData;

        const sorted = [...searchedData].sort((a, b) => {
            const aVal = a[column.dataIndex || column.key];
            const bVal = b[column.dataIndex || column.key];

            if (typeof column.sorter === 'function') {
                return column.sorter(a, b);
            }

            // Default sort
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    };

    // Export to CSV
    const handleExport = () => {
        const dataToExport = getSortedData();
        
        // Get column headers
        const headers = columns
            .filter((col) => col.dataIndex || col.key)
            .map((col) => col.title);
        
        // Get column keys
        const keys = columns
            .filter((col) => col.dataIndex || col.key)
            .map((col) => col.dataIndex || col.key);
        
        // Build CSV content
        let csvContent = headers.join(',') + '\n';
        
        dataToExport.forEach((record) => {
            const row = keys.map((key) => {
                let value = record[key];
                
                // Handle null/undefined
                if (value === null || value === undefined) return '';
                
                // Handle objects/arrays
                if (typeof value === 'object') return JSON.stringify(value);
                
                // Escape quotes and wrap in quotes if contains comma
                value = String(value).replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                    return `"${value}"`;
                }
                
                return value;
            });
            
            csvContent += row.join(',') + '\n';
        });
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${exportFileName}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Render cell content
    const renderCell = (column, record, index) => {
        const value = record[column.dataIndex || column.key];

        if (column.render) {
            return column.render(value, record, index);
        }

        return value;
    };

    // Get row key
    const getRowKey = (record, index) => {
        if (typeof rowKey === 'function') {
            return rowKey(record, index);
        }
        return record[rowKey] || index;
    };

    const sortedData = getSortedData();
    const paddingClass = getPaddingClasses();
    const sizeClass = getSizeClasses();
    
    // Get unique filter options for a column
    const getFilterOptions = (columnKey) => {
        const column = columns.find((col) => col.key === columnKey || col.dataIndex === columnKey);
        if (!column) return [];
        
        const dataIndex = column.dataIndex || column.key;
        const uniqueValues = [...new Set(dataSource.map((record) => record[dataIndex]))];
        
        return uniqueValues
            .filter((val) => val !== null && val !== undefined && val !== '')
            .sort()
            .map((val) => ({ label: String(val), value: val }));
    };

    return (
        <div className={`table-wrapper ${className}`}>
            {/* Toolbar */}
            {(showSearch || showExport || Object.keys(filters).length > 0) && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        {/* Search Input */}
                        {showSearch && (
                            <div className="relative flex-1 min-w-[200px] max-w-md text-wrap">
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Filter Dropdowns */}
                        {Object.keys(filters).map((columnKey) => {
                            const column = columns.find((col) => col.key === columnKey || col.dataIndex === columnKey);
                            if (!column) return null;

                            const filterOptions = Array.isArray(filters[columnKey])
                                ? filters[columnKey].map((val) => ({ label: String(val), value: val }))
                                : getFilterOptions(columnKey);

                            return (
                                <div key={columnKey} className="min-w-[150px]">
                                    <select
                                        value={activeFilters[columnKey] || ''}
                                        onChange={(e) => handleFilterChange(columnKey, e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All {column.title}</option>
                                        {filterOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    {/* Export Button */}
                    {showExport && (
                        <button
                            onClick={handleExport}
                            disabled={sortedData.length === 0}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fa fa-download mr-2"></i>
                            Export CSV
                        </button>
                    )}
                </div>
            )}

            {/* Results Count */}
            {(searchTerm || Object.keys(activeFilters).length > 0) && (
                <div className="mb-3 text-sm text-gray-600">
                    Showing {sortedData.length} of {dataSource.length} results
                    {searchTerm && (
                        <span className="ml-2">
                            for "<strong>{searchTerm}</strong>"
                        </span>
                    )}
                </div>
            )}
            <div className="overflow-x-auto">
                <table
                    className={`min-w-full divide-y divide-gray-200 ${sizeClass} ${
                        bordered ? 'border border-gray-200' : ''
                    }`}
                >
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || column.dataIndex || index}
                                    className={`
                                        ${paddingClass}
                                        text-left font-medium uppercase tracking-wider text-gray-500 text-xs
                                        ${column.sorter ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                                        ${column.align === 'center' ? 'text-center' : ''}
                                        ${column.align === 'right' ? 'text-right' : ''}
                                        ${column.width ? `w-[${column.width}]` : ''}
                                        ${column.fixed === 'left' ? 'sticky left-0 bg-gray-50 z-10' : ''}
                                        ${column.fixed === 'right' ? 'sticky right-0 bg-gray-50 z-10' : ''}
                                        ${bordered ? 'border-r border-gray-200' : ''}
                                    `}
                                    onClick={() => column.sorter && handleSort(column.key || column.dataIndex)}
                                    style={column.width ? { width: column.width } : {}}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{column.title}</span>
                                        {column.sorter && (
                                            <span className="flex flex-col">
                                                <i
                                                    className={`fa fa-caret-up -mb-1 ${
                                                        sortConfig.key === (column.key || column.dataIndex) &&
                                                        sortConfig.direction === 'asc'
                                                            ? 'text-blue-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                ></i>
                                                <i
                                                    className={`fa fa-caret-down ${
                                                        sortConfig.key === (column.key || column.dataIndex) &&
                                                        sortConfig.direction === 'desc'
                                                            ? 'text-blue-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                ></i>
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200 bg-white ${loading ? 'opacity-50' : ''}`}>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="py-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                                        <span className="ml-3 text-gray-500">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((record, index) => (
                                <tr
                                    key={getRowKey(record, index)}
                                    className={`
                                        ${onRow ? 'cursor-pointer hover:bg-gray-50' : ''}
                                        ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                                    `}
                                    onClick={() => onRow && onRow(record, index)}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.key || column.dataIndex || colIndex}
                                            className={`text-wrap text-xs
                                                ${paddingClass}
                                                ${column.align === 'center' ? 'text-center' : ''}
                                                ${column.align === 'right' ? 'text-right' : ''}
                                                ${column.ellipsis ? 'truncate' : ''}
                                                ${column.fixed === 'left' ? 'sticky left-0 bg-white z-10' : ''}
                                                ${column.fixed === 'right' ? 'sticky right-0 bg-white z-10' : ''}
                                                ${bordered ? 'border-r border-gray-200' : ''}
                                            `}
                                        >
                                            {renderCell(column, record, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() =>
                                pagination.onChange &&
                                pagination.onChange(Math.max(1, pagination.current - 1))
                            }
                            disabled={pagination.current === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                pagination.onChange &&
                                pagination.onChange(
                                    Math.min(
                                        Math.ceil(pagination.total / pagination.pageSize),
                                        pagination.current + 1,
                                    ),
                                )
                            }
                            disabled={
                                pagination.current >= Math.ceil(pagination.total / pagination.pageSize)
                            }
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">
                                    {(pagination.current - 1) * pagination.pageSize + 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                                </span>{' '}
                                of <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                <button
                                    onClick={() =>
                                        pagination.onChange &&
                                        pagination.onChange(Math.max(1, pagination.current - 1))
                                    }
                                    disabled={pagination.current === 1}
                                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <i className="fa fa-chevron-left"></i>
                                </button>
                                {Array.from(
                                    { length: Math.ceil(pagination.total / pagination.pageSize) },
                                    (_, i) => i + 1,
                                )
                                    .filter((page) => {
                                        const current = pagination.current;
                                        return (
                                            page === 1 ||
                                            page === Math.ceil(pagination.total / pagination.pageSize) ||
                                            (page >= current - 2 && page <= current + 2)
                                        );
                                    })
                                    .map((page, index, array) => {
                                        if (index > 0 && array[index - 1] !== page - 1) {
                                            return (
                                                <span
                                                    key={`ellipsis-${page}`}
                                                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                                                >
                                                    ...
                                                </span>
                                            );
                                        }
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => pagination.onChange && pagination.onChange(page)}
                                                className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                                    pagination.current === page
                                                        ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                                                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                <button
                                    onClick={() =>
                                        pagination.onChange &&
                                        pagination.onChange(
                                            Math.min(
                                                Math.ceil(pagination.total / pagination.pageSize),
                                                pagination.current + 1,
                                            ),
                                        )
                                    }
                                    disabled={
                                        pagination.current >= Math.ceil(pagination.total / pagination.pageSize)
                                    }
                                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <i className="fa fa-chevron-right"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
