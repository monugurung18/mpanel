# Image Configuration Guide

This document describes how images are handled in the MedTalks Panel application.

## Configuration

### Environment Variable

Add to your `.env` file:

```env
BASE_IMAGE_PATH=https://www.medtalks.in/uploads
```

This URL points to the external MedTalks image server.

### Config File

The configuration is stored in `config/app.php`:

```php
'base_image_path' => env('BASE_IMAGE_PATH', 'https://www.medtalks.in/uploads'),
```

### Inertia Shared Data

The `BASE_IMAGE_PATH` is automatically shared with all React components via `HandleInertiaRequests` middleware:

```php
'baseImagePath' => config('app.base_image_path'),
```

## Usage in React Components

### Method 1: Using Helper Functions (Recommended)

Import the helper:

```jsx
import { getEpisodeImageUrl, getSponsorBannerUrl } from '@/Utils/imageHelper';
import { usePage } from '@inertiajs/react';

export default function MyComponent() {
    const { baseImagePath } = usePage().props;
    
    // For episode images
    const episodeImageUrl = getEpisodeImageUrl('image.jpg', baseImagePath);
    
    // For sponsor banners
    const sponsorBannerUrl = getSponsorBannerUrl('banner.png', baseImagePath);
    
    return <img src={episodeImageUrl} alt="Episode" />;
}
```

### Method 2: Direct Usage

```jsx
import { usePage } from '@inertiajs/react';

export default function MyComponent({ episode }) {
    const { baseImagePath } = usePage().props;
    
    return (
        <img 
            src={`${baseImagePath}/medtalks_tv/${episode.feature_image_banner}`} 
            alt={episode.title} 
        />
    );
}
```

## Image Paths

### Episode Images

- **Storage Location:** `https://www.medtalks.in/uploads/medtalks_tv/`
- **Helper Function:** `getEpisodeImageUrl(filename, baseImagePath)`
- **Example:** `https://www.medtalks.in/uploads/medtalks_tv/episode-banner.jpg`

### Sponsor Page Banners

- **Storage Location:** `https://www.medtalks.in/uploads/sponsor_pages/`
- **Helper Function:** `getSponsorBannerUrl(filename, baseImagePath)`
- **Example:** `https://www.medtalks.in/uploads/sponsor_pages/sponsor-logo.png`

## Helper Functions

Located in `resources/js/Utils/imageHelper.js`

### Available Functions

#### `getImageUrl(filename, folder, baseImagePath)`

Generic function to get full image URL.

**Parameters:**
- `filename` (string) - The image filename
- `folder` (string) - The folder name (default: 'medtalks_tv')
- `baseImagePath` (string) - Base URL for images

**Returns:** Full image URL

**Example:**
```jsx
const url = getImageUrl('banner.jpg', 'custom_folder', baseImagePath);
// Returns: https://www.medtalks.in/uploads/custom_folder/banner.jpg
```

#### `getEpisodeImageUrl(filename, baseImagePath)`

Get episode image URL (shortcut for `medtalks_tv` folder).

**Example:**
```jsx
const url = getEpisodeImageUrl('episode.jpg', baseImagePath);
// Returns: https://www.medtalks.in/uploads/medtalks_tv/episode.jpg
```

#### `getSponsorBannerUrl(filename, baseImagePath)`

Get sponsor banner URL (shortcut for `sponsor_pages` folder).

**Example:**
```jsx
const url = getSponsorBannerUrl('logo.png', baseImagePath);
// Returns: https://www.medtalks.in/uploads/sponsor_pages/logo.png
```

#### `isValidImageUrl(url)`

Check if URL has a valid image extension.

**Example:**
```jsx
isValidImageUrl('image.jpg'); // true
isValidImageUrl('document.pdf'); // false
```

## Image Upload

When uploading images through the admin panel:

1. Images are stored locally in `storage/app/public/medtalks_tv/`
2. For production, these files should be synced to the external server
3. The database stores only the filename, not the full path
4. The frontend constructs the full URL using `BASE_IMAGE_PATH`

## Local Development

For local development, you can change the `.env` to point to local storage:

```env
# Production
BASE_IMAGE_PATH=https://www.medtalks.in/uploads

# Local Development
BASE_IMAGE_PATH=http://localhost:8000/storage
```

Remember to run `php artisan config:clear` after changing `.env`.

## Files Modified

1. **`.env`** - Added `BASE_IMAGE_PATH` variable
2. **`config/app.php`** - Added configuration entry
3. **`app/Http/Middleware/HandleInertiaRequests.php`** - Share with Inertia
4. **`resources/js/Pages/Episodes/Index.jsx`** - Updated to use new image path
5. **`resources/js/Pages/Episodes/Form.jsx`** - Updated to use new image path
6. **`resources/js/Utils/imageHelper.js`** - Created helper functions

## Testing

To verify the configuration:

1. Visit the Episodes page
2. Check that episode images load from `https://www.medtalks.in/uploads/medtalks_tv/`
3. Open browser DevTools → Network tab
4. Verify image requests go to the correct URL

## Troubleshooting

### Images not loading

1. **Check .env file:** Ensure `BASE_IMAGE_PATH` is set correctly
2. **Clear config cache:** Run `php artisan config:clear`
3. **Check image filename:** Ensure the filename matches the database value
4. **Check CORS:** External server must allow cross-origin requests
5. **Check browser console:** Look for CORS or 404 errors

### Mixed content warnings (HTTP/HTTPS)

Ensure `BASE_IMAGE_PATH` uses `https://` if your app is served over HTTPS.

---

**Last Updated:** October 27, 2025
