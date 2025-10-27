# Table Component - Quick Start Guide

## 🎯 Overview

A fully-featured, reusable table component similar to Ant Design, built for the MedTalks Panel application.

## ✅ Features

- ✨ **Sorting** - Click column headers to sort data
- 📄 **Pagination** - Built-in pagination with page numbers
- 🎨 **Styling Options** - Bordered, striped, size variants
- 🔄 **Loading State** - Show spinner during data fetch
- 📱 **Responsive** - Mobile-friendly pagination
- 🎭 **Custom Render** - Full control over cell rendering
- 📌 **Fixed Columns** - Sticky left/right columns
- 🔍 **Empty State** - Customizable no-data message

## 🚀 Quick Start

### 1. Import the Component

```jsx
import Table from '@/Components/Table';
```

### 2. Define Columns

```jsx
const columns = [
    {
        title: 'Name',           // Column header
        dataIndex: 'name',       // Data field
        key: 'name',             // Unique key
        sorter: true,            // Enable sorting
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <button onClick={() => handleEdit(record)}>Edit</button>
        ),
    },
];
```

### 3. Use the Table

```jsx
<Table
    columns={columns}
    dataSource={data}
    bordered
/>
```

## 📋 Column Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | String | Column header text |
| `dataIndex` | String | Data field key |
| `key` | String | Unique identifier |
| `width` | String | Column width (e.g., '200px') |
| `align` | String | 'left', 'center', 'right' |
| `sorter` | Boolean\|Function | Enable sorting |
| `render` | Function | Custom cell renderer |
| `ellipsis` | Boolean | Truncate long text |
| `fixed` | String | 'left' or 'right' for sticky |

## 🎨 Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | Array | `[]` | Column definitions |
| `dataSource` | Array | `[]` | Data to display |
| `loading` | Boolean | `false` | Show loading state |
| `pagination` | Object\|false | `false` | Pagination config |
| `bordered` | Boolean | `false` | Show borders |
| `striped` | Boolean | `false` | Alternate row colors |
| `size` | String | `'default'` | Table size |
| `emptyText` | String | `'No data available'` | Empty message |

## 💡 Common Examples

### Basic Table

```jsx
<Table columns={columns} dataSource={users} />
```

### With Pagination

```jsx
<Table
    columns={columns}
    dataSource={users}
    pagination={{
        current: page,
        pageSize: 10,
        total: 100,
        onChange: (p) => setPage(p),
    }}
/>
```

### With Loading

```jsx
<Table
    columns={columns}
    dataSource={users}
    loading={isLoading}
/>
```

### Bordered & Striped

```jsx
<Table
    columns={columns}
    dataSource={users}
    bordered
    striped
/>
```

## 🎯 Real-World Usage

See the Episodes page for a complete example:
- **File:** `resources/js/Pages/Episodes/Index.jsx`
- **Features Used:** Image rendering, status badges, action buttons, sorting

## 📁 Files

- **Component:** `resources/js/Components/Table.jsx`
- **Documentation:** `docs/TABLE_COMPONENT.md`
- **Example:** `resources/js/Pages/Examples/UsersListExample.jsx`

## 🔗 Related

- Uses [getEpisodeImageUrl()](file://c:\wamp64\www\mpanel\resources\js\Utils\imageHelper.js) for image URLs
- Styled with Tailwind CSS
- Icons from Font Awesome

---

**Created:** October 27, 2025
**Status:** Production Ready ✅
