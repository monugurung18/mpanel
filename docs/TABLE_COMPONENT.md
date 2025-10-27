# Table Component Documentation

A reusable, feature-rich table component similar to Ant Design's Table, built with React and Tailwind CSS.

## Features

- ✅ **Column Configuration** - Flexible column definitions
- ✅ **Sorting** - Click column headers to sort
- ✅ **Pagination** - Built-in pagination controls
- ✅ **Loading State** - Show loading spinner
- ✅ **Empty State** - Customizable empty message
- ✅ **Row Actions** - Custom render functions
- ✅ **Responsive** - Mobile-friendly pagination
- ✅ **Bordered/Striped** - Visual style options
- ✅ **Size Options** - Small, default, large
- ✅ **Fixed Columns** - Sticky left/right columns

## Basic Usage

```jsx
import Table from '@/Components/Table';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
];

const dataSource = [
    { id: 1, name: 'John Doe', age: 32, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 28, email: 'jane@example.com' },
];

export default function MyPage() {
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
        />
    );
}
```

## Column Configuration

### Basic Column Properties

```jsx
const columns = [
    {
        title: 'Column Title',        // Header text
        dataIndex: 'fieldName',       // Data field key
        key: 'unique-key',            // Unique key (optional if dataIndex exists)
        width: '200px',               // Column width
        align: 'left',                // 'left', 'center', 'right'
        ellipsis: true,               // Truncate long text
        fixed: 'left',                // 'left', 'right', or false
        sorter: true,                 // Enable sorting
    },
];
```

### Custom Render Function

```jsx
const columns = [
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value, record, index) => (
            <span className={`badge ${value === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                {value}
            </span>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <div className="flex gap-2">
                <button onClick={() => handleEdit(record)}>Edit</button>
                <button onClick={() => handleDelete(record)}>Delete</button>
            </div>
        ),
    },
];
```

### Sorting

**Enable default sorting:**
```jsx
{
    title: 'Name',
    dataIndex: 'name',
    sorter: true,  // Simple alphabetical/numerical sort
}
```

**Custom sorting function:**
```jsx
{
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,  // Custom comparator
}
```

## Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | Array | `[]` | Column configuration array |
| `dataSource` | Array | `[]` | Data to display |
| `rowKey` | String\|Function | `'id'` | Unique key for each row |
| `loading` | Boolean | `false` | Show loading state |
| `pagination` | Object\|false | `false` | Pagination configuration |
| `onRow` | Function | - | Row click handler |
| `size` | String | `'default'` | `'small'`, `'default'`, `'large'` |
| `bordered` | Boolean | `false` | Show table borders |
| `striped` | Boolean | `false` | Alternate row colors |
| `emptyText` | String | `'No data available'` | Empty state message |
| `className` | String | `''` | Additional CSS classes |

## Pagination

```jsx
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;
const totalRecords = 100;

<Table
    columns={columns}
    dataSource={dataSource}
    pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalRecords,
        onChange: (page) => setCurrentPage(page),
    }}
/>
```

## Examples

### Simple Table

```jsx
<Table
    columns={columns}
    dataSource={data}
/>
```

### Table with Pagination

```jsx
<Table
    columns={columns}
    dataSource={data}
    pagination={{
        current: 1,
        pageSize: 10,
        total: 50,
        onChange: (page) => console.log(page),
    }}
/>
```

### Table with Row Click

```jsx
<Table
    columns={columns}
    dataSource={data}
    onRow={(record) => {
        console.log('Row clicked:', record);
    }}
/>
```

### Bordered & Striped Table

```jsx
<Table
    columns={columns}
    dataSource={data}
    bordered
    striped
/>
```

### Small Size Table

```jsx
<Table
    columns={columns}
    dataSource={data}
    size="small"
/>
```

### Loading State

```jsx
<Table
    columns={columns}
    dataSource={data}
    loading={isLoading}
/>
```

### Image Column Example

```jsx
import { getEpisodeImageUrl } from '@/Utils/imageHelper';
import { usePage } from '@inertiajs/react';

const columns = [
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        width: '100px',
        render: (image) => {
            const { baseImagePath } = usePage().props;
            return (
                <img
                    src={getEpisodeImageUrl(image, baseImagePath)}
                    alt="Preview"
                    className="h-12 w-20 rounded object-cover"
                />
            );
        },
    },
];
```

### Status Badge Column

```jsx
const columns = [
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            const colors = {
                active: 'bg-green-100 text-green-800',
                inactive: 'bg-gray-100 text-gray-800',
                pending: 'bg-yellow-100 text-yellow-800',
            };
            
            return (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}>
                    {status}
                </span>
            );
        },
    },
];
```

### Action Buttons Column

```jsx
import { Link } from '@inertiajs/react';

const columns = [
    {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        width: '150px',
        render: (_, record) => (
            <div className="flex items-center justify-center gap-2">
                <Link
                    href={route('items.edit', record.id)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <i className="fa fa-pencil"></i>
                </Link>
                <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        ),
    },
];
```

### Date Format Column

```jsx
const columns = [
    {
        title: 'Created Date',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: true,
        render: (date) => new Date(date).toLocaleDateString(),
    },
];
```

### Truncated Text Column

```jsx
const columns = [
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        render: (text) => (
            <div className="max-w-md truncate" title={text}>
                {text}
            </div>
        ),
    },
];
```

## Complete Example: Episodes Table

```jsx
import Table from '@/Components/Table';
import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { getEpisodeImageUrl } from '@/Utils/imageHelper';

export default function Episodes({ episodes }) {
    const { baseImagePath } = usePage().props;
    const [loading, setLoading] = useState(false);

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            setLoading(true);
            router.delete(route('episodes.destroy', id), {
                onFinish: () => setLoading(false),
            });
        }
    };

    const columns = [
        {
            title: 'Image',
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
            title: 'Date',
            dataIndex: 'date_time',
            key: 'date_time',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'video_status',
            key: 'status',
            render: (status) => (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    status === 'live' ? 'bg-green-100 text-green-800' :
                    status === 'archive' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '100px',
            align: 'center',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Link
                        href={route('episodes.edit', record.id)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <i className="fa fa-trash-o"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={episodes}
            loading={loading}
            bordered
            pagination={{
                current: 1,
                pageSize: 10,
                total: episodes.length,
            }}
        />
    );
}
```

## Styling

The table uses Tailwind CSS classes. You can customize the appearance by:

1. **Passing custom className:**
   ```jsx
   <Table className="my-custom-table" />
   ```

2. **Using table props:**
   ```jsx
   <Table bordered striped size="small" />
   ```

3. **Custom column styling in render:**
   ```jsx
   {
       render: (value) => (
           <span className="font-bold text-blue-600">{value}</span>
       )
   }
   ```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Tailwind CSS
- Requires Font Awesome for icons

---

**Location:** `resources/js/Components/Table.jsx`
**Last Updated:** October 27, 2025
