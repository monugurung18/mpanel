# Table Component - Advanced Features Guide

This guide covers the advanced features of the Table component including live search, filters, export, and pagination.

## 🔍 Live Search

### Basic Usage

```jsx
<Table
    columns={columns}
    dataSource={data}
    showSearch={true}
    searchPlaceholder="Search records..."
/>
```

### Search Specific Columns

```jsx
<Table
    columns={columns}
    dataSource={users}
    showSearch={true}
    searchableColumns={['name', 'email', 'username']}
    searchPlaceholder="Search by name, email, or username..."
/>
```

### Disable Search

```jsx
<Table
    columns={columns}
    dataSource={data}
    showSearch={false}
/>
```

### Features

- ✅ **Real-time filtering** - Filters as you type
- ✅ **Case-insensitive** - Matches regardless of case
- ✅ **Multi-column** - Searches across specified columns
- ✅ **Clear button** - X button to clear search
- ✅ **Search icon** - Visual search indicator
- ✅ **Results count** - Shows filtered results count

## 🎯 Filters

### Auto-Generated Filters

Automatically generates filter options from unique values in the data:

```jsx
<Table
    columns={columns}
    dataSource={episodes}
    filters={{
        status: [],          // Empty array = auto-generate options
        category: [],        // from unique values in data
    }}
/>
```

### Manual Filter Options

Specify exact filter values:

```jsx
<Table
    columns={columns}
    dataSource={users}
    filters={{
        role: ['admin', 'user', 'moderator'],
        status: ['active', 'inactive', 'pending'],
        department: ['sales', 'marketing', 'engineering'],
    }}
/>
```

### Filter Change Callback

```jsx
const [activeFilters, setActiveFilters] = useState({});

<Table
    columns={columns}
    dataSource={data}
    filters={{
        status: ['active', 'inactive'],
        category: [],
    }}
    onFilterChange={(filters) => {
        console.log('Active filters:', filters);
        setActiveFilters(filters);
        // Can also trigger API call here
    }}
/>
```

### Filter Features

- ✅ **Dropdown filters** - Clean UI with select dropdowns
- ✅ **Multiple filters** - Stack multiple filter conditions
- ✅ **Auto-clear** - "All" option clears filter
- ✅ **Visual feedback** - Shows filtered count
- ✅ **Combines with search** - Works alongside search

## 📤 Export to CSV

### Basic Export

```jsx
<Table
    columns={columns}
    dataSource={products}
    showExport={true}
    exportFileName="products"
/>
```

### Custom Export Filename

```jsx
<Table
    columns={columns}
    dataSource={orders}
    showExport={true}
    exportFileName={`orders_${new Date().toISOString().split('T')[0]}`}
/>
```

### Disable Export

```jsx
<Table
    columns={columns}
    dataSource={data}
    showExport={false}
/>
```

### Export Features

- ✅ **CSV format** - Compatible with Excel, Google Sheets
- ✅ **Filtered data** - Exports only visible/filtered data
- ✅ **Sorted data** - Exports in current sort order
- ✅ **Auto-filename** - Includes date stamp
- ✅ **Proper escaping** - Handles commas, quotes, newlines
- ✅ **All columns** - Exports all table columns
- ✅ **Download button** - Disabled when no data

## 📄 Pagination

### Server-Side Pagination

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [total, setTotal] = useState(0);
const pageSize = 10;

const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Fetch data from server
    router.get(route('items.index'), {
        page: page,
        perPage: pageSize,
    }, {
        preserveState: true,
        preserveScroll: true,
    });
};

<Table
    columns={columns}
    dataSource={items}
    pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: handlePageChange,
    }}
/>
```

### Client-Side Pagination

```jsx
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 20;

<Table
    columns={columns}
    dataSource={allData}
    pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: allData.length,
        onChange: (page) => setCurrentPage(page),
    }}
/>
```

### Disable Pagination

```jsx
<Table
    columns={columns}
    dataSource={data}
    pagination={false}
/>
```

### Pagination Features

- ✅ **Page numbers** - Clickable page numbers
- ✅ **Previous/Next** - Navigation buttons
- ✅ **Ellipsis** - Shows ... for large page counts
- ✅ **Results count** - "Showing X to Y of Z results"
- ✅ **Mobile responsive** - Simplified mobile view
- ✅ **First/Last pages** - Always shows first and last page

## 🎨 Complete Example

```jsx
import Table from '@/Components/Table';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';

export default function Episodes({ episodes }) {
    const { baseImagePath } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
        
        router.get(route('episodes.index'), 
            { page }, 
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm('Delete this episode?')) {
            setLoading(true);
            router.delete(route('episodes.destroy', id), {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            });
        }
    };

    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'feature_image_banner',
            key: 'image',
            width: '100px',
            render: (image, record) => (
                image && (
                    <img
                        src={getEpisodeImageUrl(image, baseImagePath)}
                        alt={record.title}
                        className="h-12 w-20 rounded object-cover"
                    />
                )
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
        },
        {
            title: 'Type',
            dataIndex: 'episode_type',
            key: 'episode_type',
        },
        {
            title: 'Date',
            dataIndex: 'date_time',
            key: 'date',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'video_status',
            key: 'status',
            render: (status) => (
                <span className={`badge badge-${status}`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
                    <button onClick={() => router.visit(route('episodes.edit', record.id))}>
                        Edit
                    </button>
                    <button onClick={() => handleDelete(record.id)}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Table
                columns={columns}
                dataSource={episodes}
                loading={loading}
                
                // Search
                showSearch={true}
                searchPlaceholder="Search episodes by title, description, type..."
                searchableColumns={['title', 'desc', 'episode_type']}
                
                // Filters
                filters={{
                    video_status: ['live', 'schedule', 'archive', 'new'],
                    episode_type: [], // Auto-generate from data
                }}
                onFilterChange={(filters) => {
                    console.log('Filters applied:', filters);
                }}
                
                // Export
                showExport={true}
                exportFileName="episodes"
                
                // Pagination
                pagination={{
                    current: currentPage,
                    pageSize: 10,
                    total: episodes.length,
                    onChange: handlePageChange,
                }}
                
                // Styling
                bordered
                striped
                size="default"
                
                emptyText="No episodes found."
            />
        </div>
    );
}
```

## 🎯 Feature Combinations

### Search + Filter + Export

```jsx
<Table
    columns={columns}
    dataSource={data}
    showSearch={true}
    searchableColumns={['name', 'email']}
    filters={{
        status: ['active', 'inactive'],
        role: ['admin', 'user'],
    }}
    showExport={true}
    exportFileName="filtered_users"
/>
```

The export will include only the filtered and searched results!

### All Features Combined

```jsx
<Table
    columns={columns}
    dataSource={data}
    
    // Search
    showSearch={true}
    searchPlaceholder="Search..."
    searchableColumns={['name', 'email', 'company']}
    
    // Filters
    filters={{
        status: ['active', 'inactive', 'pending'],
        department: [],
    }}
    onFilterChange={(f) => console.log(f)}
    
    // Export
    showExport={true}
    exportFileName="data_export"
    
    // Pagination
    pagination={{
        current: 1,
        pageSize: 25,
        total: 100,
        onChange: (p) => loadPage(p),
    }}
    
    // Styling
    bordered
    striped
    size="default"
/>
```

## 📊 Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSearch` | Boolean | `true` | Show search input |
| `searchPlaceholder` | String | `'Search...'` | Search input placeholder |
| `searchableColumns` | Array | `null` | Columns to search (null = all) |
| `showExport` | Boolean | `true` | Show export button |
| `exportFileName` | String | `'export'` | Base filename for CSV |
| `filters` | Object | `{}` | Filter configuration |
| `onFilterChange` | Function | - | Filter change callback |
| `pagination` | Object\|false | `false` | Pagination config |

## 🎨 Styling Customization

### Search Input

The search input uses Tailwind classes and can be customized via global CSS:

```css
/* Custom search input styling */
.table-wrapper input[type="text"] {
    /* Your custom styles */
}
```

### Filter Dropdowns

```css
.table-wrapper select {
    /* Your custom dropdown styles */
}
```

### Export Button

```css
.table-wrapper button[disabled] {
    /* Disabled export button */
}
```

## 💡 Tips & Best Practices

### Performance

1. **Use searchableColumns** - Don't search all columns unnecessarily
2. **Server-side pagination** - For large datasets (> 1000 records)
3. **Debounce search** - For API-based filtering (not needed for client-side)

### UX

1. **Clear placeholder text** - Tell users what they can search
2. **Meaningful filters** - Only add useful filters
3. **Export button placement** - Always visible, disabled when empty
4. **Show filtered count** - Users should see how many results match

### Data Structure

```jsx
// Good - clean data structure
const data = [
    { id: 1, name: 'John', status: 'active' },
    { id: 2, name: 'Jane', status: 'inactive' },
];

// Avoid - nested objects in filterable columns
const data = [
    { id: 1, user: { name: 'John' }, status: 'active' }, // harder to filter
];
```

## 🐛 Troubleshooting

### Search not working

- Check `searchableColumns` prop includes the columns you want to search
- Verify column `dataIndex` or `key` matches your data structure

### Filters not showing options

- For auto-generated filters `filters={{ status: [] }}`, ensure data has values
- For manual filters, pass array of values: `filters={{ status: ['active', 'inactive'] }}`

### Export includes wrong data

- Export uses currently visible/filtered data
- Check if your filters and search are working correctly

### Pagination not updating

- Ensure `onChange` callback updates the `current` prop
- For server-side, make sure API returns correct data

---

**Last Updated:** October 27, 2025
**Component:** `resources/js/Components/Table.jsx`
