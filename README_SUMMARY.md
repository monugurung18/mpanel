# MPanel - Authentication & Episode Management System

## Project Summary

This Laravel 12 + Inertia.js + React application has been configured to use an existing database structure (`zc_mindpress_users`) for authentication and includes a complete episode management system for MedTalks TV.

---

## 📋 What's Included

### 1. Custom Authentication System
✅ **Modified to use existing `zc_mindpress_users` table**
- Custom User model with proper field mapping
- Login, Registration, Profile Management
- Email verification support
- Password reset functionality
- Remember me functionality

### 2. Episode Management System
✅ **Complete CRUD operations for episodes**
- View all episodes with search
- Create new episodes
- Edit existing episodes
- Delete episodes (soft delete)
- Image upload with WebP conversion
- Rich metadata support

---

## 📁 File Structure

### Backend Files Created/Modified

**Models:**
- ✅ `app/Models/User.php` - Modified for `zc_mindpress_users` table
- ✅ `app/Models/Episode.php` - New episode model

**Controllers:**
- ✅ `app/Http/Controllers/EpisodeController.php` - Episode CRUD
- ✅ `app/Http/Controllers/ProfileController.php` - Modified for custom user fields
- ✅ `app/Http/Controllers/Auth/RegisteredUserController.php` - Modified for custom fields

**Requests:**
- ✅ `app/Http/Requests/ProfileUpdateRequest.php` - Modified validation

**Migrations:**
- ✅ `database/migrations/2025_10_27_000000_create_zc_mindpress_users_table.php`
- ✅ `database/migrations/2025_10_27_000001_create_medtalks_tv_table.php`

**Seeders:**
- ✅ `database/seeders/UserSeeder.php` - Test user seeder
- ✅ `database/seeders/DatabaseSeeder.php` - Modified

**Routes:**
- ✅ `routes/web.php` - Added episode routes

### Frontend Files Created/Modified

**Episode Pages:**
- ✅ `resources/js/Pages/Episodes/Index.jsx` - Episode listing
- ✅ `resources/js/Pages/Episodes/Form.jsx` - Add/Edit form

**Layouts:**
- ✅ `resources/js/Layouts/AuthenticatedLayout.jsx` - Added Episodes navigation

### Documentation
- ✅ `AUTHENTICATION_UPDATE.md` - Detailed auth documentation
- ✅ `EPISODE_MANAGEMENT.md` - Episode feature documentation
- ✅ `SETUP_GUIDE.md` - Quick setup instructions
- ✅ `README_SUMMARY.md` - This file

---

## 🗄️ Database Structure

### `zc_mindpress_users` Table
Primary authentication table with fields:
- `no` (Primary Key)
- `username`, `display_name`, `email`
- `password` (bcrypt hashed)
- `userlevel`, `usser_Type`, `action`
- `mobile_no`, `image_url`
- `remember_token`, `email_verified_at`

### `medtalks_tv` Table
Episode management table with fields:
- `id` (Primary Key)
- `title`, `desc`, `custom_url`
- `video_url`, `videoSource`, `video_status`
- `feature_image_banner`
- `episode_type`, `episode_no`, `episode_status`
- `speakers_ids`, `speciality_id`
- `question_required`, `login_required`
- `date_time`
- User tracking fields

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
php artisan key:generate
```

### 3. Setup Database
```bash
# Run migrations
php artisan migrate

# Seed test users
php artisan db:seed --class=UserSeeder
```

### 4. Build Assets
```bash
# For development
npm run dev

# For production
npm run build
```

### 5. Start Server
```bash
php artisan serve
```

### 6. Login
- URL: `http://localhost:8000/login`
- Email: `admin@medtalks.in`
- Password: `password`

---

## 🎯 Key Features

### Authentication
- ✅ Login with email/password
- ✅ User registration
- ✅ Password reset via email
- ✅ Email verification
- ✅ Profile management
- ✅ Remember me functionality
- ✅ Rate limiting for security

### Episode Management
- ✅ List all episodes with pagination
- ✅ Search episodes by title/description
- ✅ Create episodes with rich metadata
- ✅ Edit episode information
- ✅ Upload and manage episode images
- ✅ Auto-generate custom URLs
- ✅ Soft delete episodes
- ✅ User activity tracking

### Image Handling
- ✅ Dimension validation (1200x750 minimum)
- ✅ Format validation (JPG, PNG, GIF, WEBP)
- ✅ Automatic WebP conversion
- ✅ Secure storage in `/storage/medtalks_tv/`

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ CSRF protection on all forms
- ✅ Rate limiting on login attempts
- ✅ SQL injection protection (Eloquent ORM)
- ✅ XSS protection (React escaping)
- ✅ File upload validation
- ✅ Authentication middleware

---

## 📝 Usage Examples

### Creating an Episode
1. Login to the application
2. Click "Episodes" in navigation
3. Click "Add Episode" button
4. Fill in the form:
   - Select episode type
   - Enter title (URL auto-generates)
   - Add description
   - Upload featured image
   - Set video URL and source
   - Choose status and date
5. Click "Create Episode"

### Managing Users
```php
// Using Tinker
php artisan tinker

// Create user
$user = new App\Models\User();
$user->username = 'johndoe';
$user->email = 'john@example.com';
$user->password = 'password';
$user->display_name = 'John Doe';
$user->userlevel = 'user';
$user->usser_Type = 'admin';
$user->action = 'active';
$user->user_registered = now();
$user->save();
```

---

## 🛠️ Configuration

### Environment Variables
Key variables to configure in `.env`:

```env
# Application
APP_NAME=MPanel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mpanel
DB_USERNAME=root
DB_PASSWORD=

# Mail (for password reset)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@medtalks.in"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Registration creates new user
- [ ] Logout works correctly
- [ ] Password reset email sent
- [ ] Profile update works
- [ ] Email verification works

**Episodes:**
- [ ] Can view episode list
- [ ] Search filters episodes
- [ ] Can create new episode
- [ ] Image upload validates dimensions
- [ ] Can edit existing episode
- [ ] Can delete episode
- [ ] User tracking works (created_by, modified_by)

### Test Users
After running `UserSeeder`:

**Admin:**
- Email: `admin@medtalks.in`
- Password: `password`

**Test User:**
- Email: `test@medtalks.in`
- Password: `password`

---

## 📊 Routes

### Authentication Routes
```
POST   /login           - Login
POST   /register        - Register
POST   /logout          - Logout
GET    /forgot-password - Password reset form
POST   /forgot-password - Send reset link
GET    /reset-password  - Reset password form
POST   /reset-password  - Update password
```

### Episode Routes
```
GET    /episodes              - List episodes
GET    /episodes/create       - Create form
POST   /episodes              - Store episode
GET    /episodes/{id}/edit    - Edit form
PUT    /episodes/{id}         - Update episode
DELETE /episodes/{id}         - Delete episode
```

### Profile Routes
```
GET    /profile         - Profile page
PATCH  /profile         - Update profile
DELETE /profile         - Delete account
```

---

## 🔄 Data Flow

### Authentication Flow
```
Login Form → LoginRequest → Auth Attempt → User Model → zc_mindpress_users
```

### Episode Creation Flow
```
Episode Form → EpisodeController → Validation → Image Upload → 
Episode Model → medtalks_tv → Success Response
```

---

## 📦 Dependencies

### PHP (Composer)
- Laravel Framework 12.x
- Laravel Breeze (Auth scaffolding)
- Laravel Sanctum (API authentication)
- Inertia.js Laravel Adapter

### JavaScript (NPM)
- React 18.x
- Inertia.js React Adapter
- Vite (Build tool)
- Tailwind CSS
- @headlessui/react (UI components)

---

## 🚨 Common Issues & Solutions

### Issue: Login fails
**Solution**: 
1. Verify password is hashed
2. Check `action` field is 'active'
3. Ensure email exists

### Issue: Image won't upload
**Solution**:
1. Check storage permissions: `chmod -R 775 storage`
2. Verify storage is linked: `php artisan storage:link`
3. Check image dimensions (min 1200x750)

### Issue: "Table doesn't exist"
**Solution**:
1. Run migrations: `php artisan migrate`
2. Check database connection in `.env`

### Issue: 404 on episode routes
**Solution**:
1. Clear route cache: `php artisan route:clear`
2. Verify routes with: `php artisan route:list`

---

## 📈 Future Enhancements

Potential features to add:

1. **Advanced Episode Features**
   - Rich text editor for descriptions
   - Speaker search and management
   - Speciality multi-select
   - Q&A management
   - Email notifications
   - Push notifications

2. **User Management**
   - Role-based access control
   - User activity logs
   - Bulk user operations
   - User profile images

3. **Dashboard**
   - Analytics and statistics
   - Recent episodes widget
   - User activity feed
   - Quick actions

4. **API**
   - RESTful API for episodes
   - API authentication with Sanctum
   - API documentation

---

## 🤝 Contributing

To contribute to this project:

1. Make changes in a feature branch
2. Follow PSR-12 coding standards
3. Write clear commit messages
4. Test thoroughly before committing
5. Update documentation as needed

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review Laravel logs in `storage/logs/`
3. Verify database structure
4. Check environment configuration

---

## 📜 License

This project uses the Laravel framework which is open-sourced software licensed under the MIT license.

---

## ✅ Verification Steps

After setup, verify everything works:

```bash
# 1. Check migrations
php artisan migrate:status

# 2. Verify routes
php artisan route:list | grep episodes

# 3. Test database connection
php artisan tinker
>>> DB::table('zc_mindpress_users')->count()

# 4. Check users
>>> App\Models\User::all()

# 5. Check episodes
>>> App\Models\Episode::count()
```

---

## 📝 Notes

- **Database**: Uses existing `zc_mindpress_users` table
- **Primary Key**: `no` instead of `id` for users
- **Timestamps**: Custom timestamp handling for users
- **Images**: Stored in `storage/app/public/medtalks_tv/`
- **Password**: Auto-hashed using bcrypt
- **User Name**: Accessible via `name` attribute (returns `display_name` or `username`)

---

**Project Status**: ✅ Ready for Development
**Last Updated**: October 27, 2025
**Framework**: Laravel 12 + Inertia.js + React
**Database**: MySQL/MariaDB

---

For detailed information, refer to:
- `AUTHENTICATION_UPDATE.md` - Authentication details
- `EPISODE_MANAGEMENT.md` - Episode feature details
- `SETUP_GUIDE.md` - Setup instructions
