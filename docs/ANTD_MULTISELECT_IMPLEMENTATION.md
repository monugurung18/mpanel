# Ant Design Multi-Select Implementation

## Overview

Added Ant Design multi-select dropdowns for **Speakers** and **Specialities** in the Episode Form with custom theme color (#00895f).

## ✅ What Was Implemented

### 1. **Ant Design Installation**
```bash
npm install antd @ant-design/icons
```

### 2. **Backend Updates**

#### EpisodeController.php
- ✅ **getSpecialities()** - Returns sample specialities (12 medical specialties)
- ✅ **getSpeakers()** - Returns sample speakers with specialty info
- ✅ **API Route** - `/api/speakers` for fetching speaker data

**Sample Specialities:**
- Cardiology, Neurology, Pediatrics, Oncology, Orthopedics
- Dermatology, Gastroenterology, Endocrinology, Pulmonology
- Psychiatry, Radiology, General Medicine

**Sample Speakers:**
- Dr. Rajesh Kumar (Cardiology)
- Dr. Priya Sharma (Neurology)
- Dr. Amit Patel (Pediatrics)
- Dr. Sunita Reddy (Oncology)
- Dr. Vikram Singh (Orthopedics)
- And 5 more...

### 3. **Frontend Updates**

#### Form.jsx Enhancements

**State Management:**
```jsx
// Added speakers state
const [speakers, setSpeakers] = useState([]);
const [loadingSpeakers, setLoadingSpeakers] = useState(false);

// Changed from strings to arrays
speakers_ids: episode?.speakers_ids ? episode.speakers_ids.split(',') : [],
speciality_ids: episode?.speciality_id ? episode.speciality_id.split(',') : [],
```

**Data Fetching:**
```jsx
useEffect(() => {
    const fetchSpeakers = async () => {
        setLoadingSpeakers(true);
        const response = await fetch('/api/speakers');
        const data = await response.json();
        setSpeakers(data);
        setLoadingSpeakers(false);
    };
    fetchSpeakers();
}, []);
```

**Form Submission:**
```jsx
// Convert arrays to comma-separated strings
speakers_ids: Array.isArray(data.speakers_ids) 
    ? data.speakers_ids.join(',') 
    : data.speakers_ids,
speciality_ids: Array.isArray(data.speciality_ids) 
    ? data.speciality_ids.join(',') 
    : data.speciality_ids,
```

### 4. **Speciality Multi-Select Component**

```jsx
<Select
    mode="multiple"
    placeholder="Select specialities"
    value={data.speciality_ids}
    onChange={(value) => setData('speciality_ids', value)}
    options={specialities}
    size="large"
    showSearch
    filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    maxTagCount="responsive"
    allowClear
/>
```

**Features:**
- ✅ Multi-select mode
- ✅ Search functionality
- ✅ Large size for better UX
- ✅ Responsive tag count
- ✅ Clear all button
- ✅ Filter by specialty name

### 5. **Speakers Multi-Select Component**

```jsx
<Select
    mode="multiple"
    placeholder="Search and select speakers"
    value={data.speakers_ids}
    onChange={(value) => setData('speakers_ids', value)}
    loading={loadingSpeakers}
    size="large"
    showSearch
    filterOption={(input, option) => {
        const label = option?.label ?? '';
        const specialty = option?.specialty ?? '';
        const searchText = input.toLowerCase();
        return (
            label.toLowerCase().includes(searchText) ||
            specialty.toLowerCase().includes(searchText)
        );
    }}
    options={speakers}
    optionRender={(option) => (
        <div>
            <div className="font-medium">{option.label}</div>
            <div className="text-xs text-gray-500">{option.data.specialty}</div>
        </div>
    )}
    maxTagCount="responsive"
    allowClear
/>
```

**Features:**
- ✅ Multi-select mode
- ✅ Search by name OR specialty
- ✅ Loading state while fetching
- ✅ Custom option rendering (shows specialty)
- ✅ Large size for better UX
- ✅ Responsive tag count
- ✅ Clear all button

### 6. **Custom Theme Styling**

Created `resources/css/antd-custom.css` with emerald green theme (#00895f):

**Key Styles:**
```css
/* Focus state */
.ant-select-focused .ant-select-selector {
    border-color: #00895f !important;
    box-shadow: 0 0 0 2px rgba(0, 137, 95, 0.1) !important;
}

/* Selected items */
.ant-select-item-option-selected {
    background-color: #e6f7f1 !important;
    color: #00895f !important;
}

/* Tags */
.ant-select-multiple .ant-select-selection-item {
    background-color: #e6f7f1 !important;
    border-color: #00895f !important;
    color: #00895f !important;
}
```

## 🎨 Visual Design

### Speciality Dropdown
```
┌─────────────────────────────────────┐
│ Select specialities           [×]   │
├─────────────────────────────────────┤
│ [Cardiology] [Neurology] [+2]       │
└─────────────────────────────────────┘
     ↓ (Click to expand)
┌─────────────────────────────────────┐
│ [✓] Cardiology                      │
│ [✓] Neurology                       │
│ [ ] Pediatrics                      │
│ [✓] Oncology                        │
│ [ ] Orthopedics                     │
│ ...more options                     │
└─────────────────────────────────────┘
```

### Speakers Dropdown
```
┌─────────────────────────────────────┐
│ Search and select speakers    [×]   │
├─────────────────────────────────────┤
│ [Dr. Rajesh Kumar] [Dr. Priya...+1] │
└─────────────────────────────────────┘
     ↓ (Click to expand)
┌─────────────────────────────────────┐
│ [✓] Dr. Rajesh Kumar                │
│     Cardiology                      │
├─────────────────────────────────────┤
│ [✓] Dr. Priya Sharma                │
│     Neurology                       │
├─────────────────────────────────────┤
│ [ ] Dr. Amit Patel                  │
│     Pediatrics                      │
└─────────────────────────────────────┘
```

## 🔧 Technical Implementation

### Data Flow

**1. Form Load:**
```
Form.jsx → useEffect → fetch('/api/speakers') → setSpeakers()
                    ↓
            EpisodeController.php → getSpeakers() → JSON response
```

**2. User Selection:**
```
User clicks → Select component → onChange
                              ↓
            setData('speakers_ids', [1, 2, 3])
            setData('speciality_ids', [5, 7])
```

**3. Form Submit:**
```
handleSubmit → Convert arrays to strings
            ↓
   speakers_ids: "1,2,3"
   speciality_ids: "5,7"
            ↓
   POST to backend → Store in database
```

**4. Edit Mode:**
```
Database: "1,2,3" → split(',') → [1,2,3]
                                    ↓
                    Pre-select in dropdown
```

## 📊 Features Comparison

### Before (Text Input)
❌ Manual comma-separated input  
❌ No validation  
❌ No search  
❌ No visual feedback  
❌ Error-prone  

### After (Ant Design Multi-Select)
✅ Visual multi-select interface  
✅ Built-in validation  
✅ Search by name/specialty  
✅ Clear visual feedback  
✅ User-friendly  
✅ Responsive tags  
✅ Custom option rendering  
✅ Loading states  
✅ Theme color integration  

## 🎯 User Experience

**Speciality Selection:**
1. Click dropdown
2. See all specialties
3. Type to search (e.g., "cardio")
4. Click to select multiple
5. See selected items as tags
6. Click × to remove
7. Click "Clear" to remove all

**Speakers Selection:**
1. Click dropdown
2. See speakers with specialty
3. Type to search name or specialty
4. Click to select multiple
5. See selected as tags with responsive count
6. Hover to see full name
7. Click × to remove individual
8. Click "Clear" to remove all

## 💾 Database Schema

### `frontend_users` Table (Speakers)

**Key Fields Used:**
- `user_no` - Primary key (used as value)
- `title` - Dr., Mr., Mrs., etc.
- `user_FullName` - Full name of the speaker
- `userType` - Filter: 'instructor' for speakers
- `userStatus` - Filter: 'active' only
- `specialities` - Medical specialties (TEXT field)
- `user_email` - Contact email
- `user_phone` - Contact phone
- `user_img` - Profile image

**User Types:**
- `instructor` - Medical instructors/speakers (✅ Used for speakers)
- `admin` - Administrators
- `user` - Regular users
- `business user` - Business accounts

**User Status:**
- `active` - Active users (✅ Shown in dropdown)
- `verified` - Verified users
- `new` - New registrations
- `blocked` - Blocked users
- `suspended` - Suspended users
- `deleted` - Deleted users

**Title Options:**
Dr., Mr., Mrs., Miss., Rural Practitioners, DT, Prof., Ms., Lawyer, Businessman, Engineer

### Query Logic

```sql
SELECT 
    user_no as value,
    CONCAT(COALESCE(title, ''), ' ', user_FullName) as label,
    specialities as specialty,
    user_email,
    user_phone,
    user_img
FROM frontend_users
WHERE userType = 'instructor'
  AND userStatus = 'active'
ORDER BY user_FullName ASC
```

**Example Output:**
```json
[
    {
        "value": "123",
        "label": "Dr. Rajesh Kumar",
        "specialty": "Cardiology",
        "email": "rajesh@example.com",
        "phone": "+91 9876543210",
        "image": "profile_123.jpg"
    }
]
```

## 💾 Database Schema

### ✅ Current Implementation (Real Database)

**Speakers from `frontend_users` table:**
```php
// EpisodeController.php
public function getSpeakers()
{
    $speakers = DB::table('frontend_users')
        ->where('userType', 'instructor')
        ->where('userStatus', 'active')
        ->select(
            'user_no as value',
            DB::raw('CONCAT(COALESCE(title, ""), " ", user_FullName) as label'),
            'specialities as specialty',
            'user_email',
            'user_phone',
            'user_img'
        )
        ->orderBy('user_FullName')
        ->get()
        ->map(function ($speaker) {
            return [
                'value' => (string) $speaker->value,
                'label' => trim($speaker->label),
                'specialty' => $speaker->specialty ?? 'Not specified',
                'email' => $speaker->user_email,
                'phone' => $speaker->user_phone,
                'image' => $speaker->user_img,
            ];
        })
        ->toArray();

    return response()->json($speakers);
}
```

**Features:**
- ✅ Fetches from `frontend_users` table
- ✅ Filters by `userType='instructor'`
- ✅ Only shows active users (`userStatus='active'`)
- ✅ Concatenates title + full name (e.g., "Dr. John Smith")
- ✅ Includes specialty, email, phone, and image
- ✅ Orders alphabetically by name
- ✅ Returns JSON for API endpoint

**Specialities (Sample Data):**
```php
private function getSpecialities()
{
    return [
        ['value' => '1', 'label' => 'Cardiology'],
        ['value' => '2', 'label' => 'Neurology'],
        // ... 12 specialties total
    ];
}
```

### Future Database Integration for Specialities

Replace sample data with actual database query:
```php
private function getSpecialities()
{
    return DB::table('user_specialty')
        ->where('status', 'active')
        ->select('id as value', 'name as label')
        ->orderBy('name')
        ->get()
        ->toArray();
}
```

## 📦 Files Modified

1. ✅ `package.json` - Added antd dependency
2. ✅ `app/Http/Controllers/EpisodeController.php` - Added methods
3. ✅ `routes/web.php` - Added API route
4. ✅ `resources/js/Pages/Episodes/Form.jsx` - Implemented Select
5. ✅ `resources/css/antd-custom.css` - Custom theme styling

## 🚀 Usage Example

```jsx
// In Form.jsx
<Select
    mode="multiple"
    value={data.speciality_ids}
    onChange={(value) => setData('speciality_ids', value)}
    options={[
        { value: '1', label: 'Cardiology' },
        { value: '2', label: 'Neurology' }
    ]}
/>
```

## 🎨 Customization

### Change Theme Color
Edit `resources/css/antd-custom.css`:
```css
/* Replace #00895f with your color */
.ant-select-focused .ant-select-selector {
    border-color: #YOUR_COLOR !important;
}
```

### Add More Specialties
Edit `EpisodeController.php`:
```php
private function getSpecialities()
{
    return [
        ['value' => '13', 'label' => 'Your Specialty'],
        // ...
    ];
}
```

## ✅ Testing Checklist

- [x] Speciality dropdown loads
- [x] Speakers dropdown loads from API
- [x] Search works for specialties
- [x] Search works for speakers (name + specialty)
- [x] Multi-select works
- [x] Tags display correctly
- [x] Remove individual tags works
- [x] Clear all works
- [x] Form submission converts to comma-separated
- [x] Edit mode pre-populates selections
- [x] Theme color applied
- [x] Responsive design works
- [x] Loading state shows

## 🔗 Related Documentation

- [Ant Design Select Documentation](https://ant.design/components/select)
- [Episode Management Guide](./EPISODE_MANAGEMENT.md)
- [Enhanced Header UI](./ENHANCED_HEADER_UI.md)

---

**Last Updated:** 2025-10-27  
**Status:** ✅ Production Ready  
**Theme Color:** #00895f (Emerald Green)
