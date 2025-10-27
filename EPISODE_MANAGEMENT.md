# Episode Management System

This feature provides a complete episode management system for MedTalks TV, migrated from the legacy PHP system to Laravel 12 with Inertia.js and React.

## Features

### Episode Management
- **View Episodes**: List all active episodes with search functionality
- **Add Episode**: Create new episodes with complete metadata
- **Edit Episode**: Update existing episode information
- **Delete Episode**: Soft delete episodes (mark as deleted)

### Episode Properties
- Title
- Custom URL (auto-generated from title)
- Description (rich text)
- Episode Number
- Episode Type (Sponsored/Non-sponsored)
- Video URL
- Video Source (YouTube, Facebook, MP4, Other)
- Video Status (Live, Scheduled, Archive, New)
- Episode Date/Time
- Featured Image (1200x750, auto-converts to WebP)
- Speakers (comma-separated IDs)
- Specialities (comma-separated IDs)
- Question Required (Yes/No)
- Login Required (Yes/No)

## Installation

### 1. Run Migration
```bash
php artisan migrate
```

### 2. Storage Setup
Make sure the storage is linked:
```bash
php artisan storage:link
```

Create the medtalks_tv directory:
```bash
mkdir -p storage/app/public/medtalks_tv
```

### 3. Install Dependencies
If not already done:
```bash
composer install
npm install
npm run build
```

## File Structure

### Backend
- **Model**: `app/Models/Episode.php`
- **Controller**: `app/Http/Controllers/EpisodeController.php`
- **Migration**: `database/migrations/2025_10_27_000001_create_medtalks_tv_table.php`
- **Routes**: Added to `routes/web.php`

### Frontend
- **Index Page**: `resources/js/Pages/Episodes/Index.jsx`
- **Form Page**: `resources/js/Pages/Episodes/Form.jsx`
- **Navigation**: Updated `resources/js/Layouts/AuthenticatedLayout.jsx`

## Routes

All routes are protected by authentication middleware:

- `GET /episodes` - List all episodes (`episodes.index`)
- `GET /episodes/create` - Show create form (`episodes.create`)
- `POST /episodes` - Store new episode (`episodes.store`)
- `GET /episodes/{episode}/edit` - Show edit form (`episodes.edit`)
- `PUT /episodes/{episode}` - Update episode (`episodes.update`)
- `DELETE /episodes/{episode}` - Delete episode (`episodes.destroy`)
- `POST /episodes/search-speakers` - Search speakers AJAX endpoint

## Usage

### Accessing Episodes
After logging in, click on "Episodes" in the navigation menu.

### Creating an Episode
1. Click "Add Episode" button
2. Fill in required fields (marked with *)
3. Select episode type
4. Upload featured image (minimum 1200x750)
5. Set video URL and source
6. Choose video status and date
7. Click "Create Episode"

### Editing an Episode
1. Click the pencil icon on any episode row
2. Modify the fields as needed
3. Click "Update Episode"

### Deleting an Episode
1. Click the trash icon on any episode row
2. Confirm the deletion
3. Episode will be soft deleted (video_status set to 'deleted')

## Image Handling

Images are automatically processed:
- Validation: Only JPG, JPEG, PNG, GIF, WEBP allowed
- Minimum dimensions: 1200 x 750 pixels
- Auto-conversion to WebP format for better performance
- Stored in: `storage/app/public/medtalks_tv/`
- Accessible via: `/storage/medtalks_tv/filename.jpg`

## Database Schema

The `medtalks_tv` table includes:
- Standard Laravel timestamps (created_at, updated_at)
- Soft deletes (deleted_at)
- User tracking (created_by, modified_by, created_ip, modified_ip)
- Episode metadata (title, desc, video_url, etc.)
- Episode settings (video_status, episode_type, episode_status)
- Media (feature_image_banner)

## Validation Rules

### Required Fields
- Title
- Custom URL (unique)
- Episode Type
- Video Status
- Video Source
- Episode Date/Time

### Optional Fields
- Episode Number
- Description
- Video URL
- Featured Image
- Speakers
- Specialities
- Question Required (defaults to No)
- Login Required (defaults to No)

## Future Enhancements

The following features from the original PHP system need to be implemented:

1. **Speaker Management**
   - Search and add speakers from database
   - Display speaker list with ability to remove
   - Integration with `frontend_users` table

2. **Speciality Management**
   - Multi-select dropdown from `user_specialty` table
   - Better UI for selecting multiple specialities

3. **Sponsor Pages**
   - Dynamic loading from `sponsor_pages` table
   - Better categorization of episode types

4. **Rich Text Editor**
   - Summernote or similar WYSIWYG editor for description
   - Image upload within description

5. **Meta Tags Editor**
   - SEO meta title and description
   - Link to meta-edit page

6. **Q&A Management**
   - Link to episode-qa page
   - Question management for episodes

7. **Email Notifications**
   - Send email when episode is archived
   - Notification system for new episodes

8. **Push Notifications**
   - Firebase Cloud Messaging integration
   - Notify users when new episode is published

## Troubleshooting

### Images not displaying
Make sure storage is linked:
```bash
php artisan storage:link
```

### Permission errors
Set proper permissions:
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Migration errors
If table already exists, you can skip the migration or drop it first:
```bash
php artisan migrate:fresh  # WARNING: This drops all tables
```

## Notes

- The system maintains backward compatibility with the existing database structure
- User tracking (created_by, modified_by) uses authenticated user's name
- IP addresses are automatically captured for audit purposes
- All episode operations require authentication

## Support

For issues or questions, please contact the development team.
