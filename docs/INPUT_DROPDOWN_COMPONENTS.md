# Input & Dropdown Components Documentation

## Overview

Modern, themed reusable components for form inputs and dropdowns with **#00895f** (emerald green) theme color integration.

## 📦 Components

### 1. **Input Component** (`resources/js/Components/Input.jsx`)
### 2. **Dropdown Component** (`resources/js/Components/Dropdown.jsx`)

---

## 🎯 Input Component

A feature-rich input component with icons, validation, and custom styling.

### **Features**

- ✅ Multiple input types (text, email, password, number, etc.)
- ✅ Icon support (left or right position)
- ✅ Error state with messages
- ✅ Helper text support
- ✅ Three sizes (sm, md, lg)
- ✅ Disabled state
- ✅ Auto-focus capability
- ✅ Theme color integration (#00895f)
- ✅ Smooth transitions and animations

### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'text' | Input type (text, email, password, number, etc.) |
| `className` | string | '' | Additional CSS classes |
| `isFocused` | boolean | false | Auto-focus on mount |
| `icon` | string | null | Font Awesome icon class (e.g., 'fa-user') |
| `iconPosition` | string | 'left' | Icon position: 'left' or 'right' |
| `error` | string | null | Error message to display |
| `helperText` | string | null | Helper text below input |
| `size` | string | 'md' | Input size: 'sm', 'md', 'lg' |
| `disabled` | boolean | false | Disabled state |
| `placeholder` | string | '' | Placeholder text |
| `value` | string | '' | Input value |
| `onChange` | function | - | Change handler |
| `...props` | object | - | Other standard input props |

### **Usage Examples**

#### **Basic Input**
```jsx
import Input from '@/Components/Input';

<Input
    type="text"
    value={data.title}
    onChange={(e) => setData('title', e.target.value)}
    placeholder="Enter title"
/>
```

#### **Input with Icon**
```jsx
<Input
    type="email"
    value={data.email}
    onChange={(e) => setData('email', e.target.value)}
    icon="fa-envelope"
    placeholder="Enter email"
    size="lg"
/>
```

#### **Input with Error**
```jsx
<Input
    type="text"
    value={data.username}
    onChange={(e) => setData('username', e.target.value)}
    icon="fa-user"
    error={errors.username}
    helperText="Username must be unique"
    size="lg"
/>
```

#### **Password Input**
```jsx
<Input
    type="password"
    value={data.password}
    onChange={(e) => setData('password', e.target.value)}
    icon="fa-lock"
    iconPosition="left"
    error={errors.password}
    size="lg"
    placeholder="Enter password"
/>
```

#### **Disabled Input**
```jsx
<Input
    type="text"
    value={data.readonly}
    disabled
    icon="fa-info-circle"
    helperText="This field is read-only"
/>
```

### **Sizes**

```jsx
// Small
<Input size="sm" placeholder="Small input" />

// Medium (default)
<Input size="md" placeholder="Medium input" />

// Large
<Input size="lg" placeholder="Large input" />
```

---

## 🎯 Dropdown Component

A modern dropdown/select component with search, multi-select, and custom styling.

### **Features**

- ✅ Single and multi-select modes
- ✅ Search functionality
- ✅ Icon support
- ✅ Clear button
- ✅ Error state with messages
- ✅ Helper text support
- ✅ Three sizes (sm, md, lg)
- ✅ Disabled state
- ✅ Custom empty message
- ✅ Click-outside to close
- ✅ Theme color integration (#00895f)
- ✅ Smooth animations

### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | array | [] | Array of {value, label} objects |
| `value` | string\|array | null | Selected value(s) |
| `onChange` | function | - | Change handler |
| `placeholder` | string | 'Select an option' | Placeholder text |
| `multiple` | boolean | false | Enable multi-select |
| `searchable` | boolean | false | Enable search functionality |
| `className` | string | '' | Additional CSS classes |
| `error` | string | null | Error message |
| `helperText` | string | null | Helper text |
| `disabled` | boolean | false | Disabled state |
| `size` | string | 'md' | Size: 'sm', 'md', 'lg' |
| `icon` | string | null | Font Awesome icon class |
| `clearable` | boolean | true | Show clear button |
| `emptyMessage` | string | 'No options available' | Message when no options |

### **Usage Examples**

#### **Basic Dropdown**
```jsx
import Dropdown from '@/Components/Dropdown';

<Dropdown
    options={[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ]}
    value={data.status}
    onChange={(value) => setData('status', value)}
    placeholder="Select status"
/>
```

#### **Dropdown with Icon**
```jsx
<Dropdown
    options={[
        { value: 'live', label: 'Live' },
        { value: 'schedule', label: 'Scheduled' },
        { value: 'archive', label: 'Archive' },
    ]}
    value={data.video_status}
    onChange={(value) => setData('video_status', value)}
    icon="fa-video-camera"
    placeholder="Select video status"
    size="lg"
/>
```

#### **Searchable Dropdown**
```jsx
<Dropdown
    options={sponsorPages}
    value={data.episode_type}
    onChange={(value) => setData('episode_type', value)}
    searchable
    icon="fa-th-large"
    placeholder="Select episode type"
    size="lg"
/>
```

#### **Multi-Select Dropdown**
```jsx
<Dropdown
    options={[
        { value: '1', label: 'Cardiology' },
        { value: '2', label: 'Neurology' },
        { value: '3', label: 'Pediatrics' },
    ]}
    value={data.specialities}
    onChange={(value) => setData('specialities', value)}
    multiple
    searchable
    icon="fa-stethoscope"
    placeholder="Select specialities"
    size="lg"
/>
```

#### **Dropdown with Error**
```jsx
<Dropdown
    options={videoSources}
    value={data.source}
    onChange={(value) => setData('source', value)}
    error={errors.source}
    helperText="Choose video source"
    icon="fa-play-circle"
    size="lg"
/>
```

#### **Yes/No Dropdown**
```jsx
<Dropdown
    options={[
        { value: false, label: 'No' },
        { value: true, label: 'Yes' },
    ]}
    value={data.question_required}
    onChange={(value) => setData('question_required', value)}
    icon="fa-question-circle"
    size="lg"
/>
```

---

## 🎨 Styling & Theme

Both components use the **#00895f** (emerald green) theme color for:

### **Focus State**
```css
border-color: #00895f
ring-color: rgba(0, 137, 95, 0.2)
```

### **Selected/Active State**
```css
background-color: #e6f7f1 (emerald-50)
text-color: #00895f
```

### **Error State**
```css
border-color: #ef4444 (red-500)
ring-color: rgba(239, 68, 68, 0.2)
```

---

## 📊 Size Comparison

| Size | Padding | Text Size | Use Case |
|------|---------|-----------|----------|
| **sm** | px-3 py-2 | text-sm | Compact forms, inline inputs |
| **md** | px-4 py-3 | text-base | Standard forms (default) |
| **lg** | px-5 py-4 | text-lg | Prominent forms, main inputs |

---

## 🎯 Form Integration Example

### **Episode Form (Complete Example)**

```jsx
import Input from '@/Components/Input';
import Dropdown from '@/Components/Dropdown';

export default function EpisodeForm() {
    const { data, setData, errors } = useForm({
        title: '',
        episode_type: '',
        video_status: 'schedule',
        video_url: '',
    });

    return (
        <form>
            {/* Title Input */}
            <div>
                <InputLabel value="Title *" />
                <Input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    icon="fa-file-text"
                    error={errors.title}
                    size="lg"
                    placeholder="Enter episode title"
                />
            </div>

            {/* Episode Type Dropdown */}
            <div>
                <InputLabel value="Type *" />
                <Dropdown
                    options={sponsorPages}
                    value={data.episode_type}
                    onChange={(value) => setData('episode_type', value)}
                    searchable
                    icon="fa-th-large"
                    error={errors.episode_type}
                    size="lg"
                />
            </div>

            {/* Video Status Dropdown */}
            <div>
                <InputLabel value="Video Status *" />
                <Dropdown
                    options={[
                        { value: 'live', label: 'Live' },
                        { value: 'schedule', label: 'Scheduled' },
                        { value: 'archive', label: 'Archive' },
                        { value: 'new', label: 'New' },
                    ]}
                    value={data.video_status}
                    onChange={(value) => setData('video_status', value)}
                    icon="fa-video-camera"
                    error={errors.video_status}
                    size="lg"
                />
            </div>

            {/* Video URL Input */}
            <div>
                <InputLabel value="Video URL" />
                <Input
                    type="text"
                    value={data.video_url}
                    onChange={(e) => setData('video_url', e.target.value)}
                    icon="fa-youtube-play"
                    error={errors.video_url}
                    size="lg"
                    placeholder="https://youtube.com/watch?v=..."
                />
            </div>
        </form>
    );
}
```

---

## 🔧 Advanced Features

### **Input - Auto-lowercase**
```jsx
<Input
    value={data.custom_url}
    onChange={(e) => setData('custom_url', e.target.value.toLowerCase())}
    icon="fa-link"
    helperText="Auto-generated from title"
/>
```

### **Dropdown - Dynamic Options**
```jsx
const [options, setOptions] = useState([]);

useEffect(() => {
    fetch('/api/options')
        .then(res => res.json())
        .then(data => setOptions(data));
}, []);

<Dropdown
    options={options}
    searchable
    emptyMessage="Loading options..."
/>
```

### **Input - Date/Time**
```jsx
<Input
    type="datetime-local"
    value={data.date_time}
    onChange={(e) => setData('date_time', e.target.value)}
    icon="fa-calendar"
    error={errors.date_time}
    size="lg"
/>
```

---

## 🎨 Custom Styling

### **Input with Custom Class**
```jsx
<Input
    className="shadow-lg"
    icon="fa-search"
    placeholder="Search..."
/>
```

### **Dropdown with Custom Width**
```jsx
<Dropdown
    className="w-64"
    options={options}
/>
```

---

## ✅ Validation Examples

### **Required Field**
```jsx
<Input
    type="text"
    value={data.title}
    onChange={(e) => setData('title', e.target.value)}
    required
    error={errors.title}
    icon="fa-asterisk"
/>
```

### **Email Validation**
```jsx
<Input
    type="email"
    value={data.email}
    onChange={(e) => setData('email', e.target.value)}
    icon="fa-envelope"
    error={errors.email}
    helperText="Enter a valid email address"
/>
```

---

## 📦 Files Created

1. ✅ `resources/js/Components/Input.jsx` - Input component
2. ✅ `resources/js/Components/Dropdown.jsx` - Dropdown component
3. ✅ Updated `resources/js/Pages/Episodes/Form.jsx` - Using new components

---

## 🔗 Related Components

- **InputLabel** - Label for form fields
- **InputError** - Error message display
- **PrimaryButton** - Themed button component
- **Select (Ant Design)** - For multi-select with advanced features

---

## 🎯 Best Practices

1. **Always use size="lg"** for main form inputs
2. **Add icons** for better visual context
3. **Include error handling** for all inputs
4. **Use helper text** for additional guidance
5. **Enable searchable** for dropdowns with 5+ options
6. **Use clearable** for optional dropdowns

---

**Last Updated:** 2025-10-27  
**Status:** ✅ Production Ready  
**Theme Color:** #00895f (Emerald Green)
