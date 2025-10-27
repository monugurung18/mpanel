# Quick Setup Guide - Authentication with zc_mindpress_users

## Overview
This guide will help you quickly set up the authentication system using the `zc_mindpress_users` table.

## Prerequisites
- PHP 8.2+
- Composer installed
- MySQL/MariaDB database
- Node.js and NPM

## Step 1: Database Configuration

Update your `.env` file with database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Step 2: Run Migrations

### Option A: Fresh Database (No existing users table)
```bash
php artisan migrate
```

### Option B: Existing Database (Table already exists)
If `zc_mindpress_users` already exists, ensure it has these fields:
- `remember_token` (VARCHAR 100, NULL)
- `email_verified_at` (TIMESTAMP, NULL)

Add them if missing:
```sql
ALTER TABLE `zc_mindpress_users` 
ADD COLUMN `remember_token` VARCHAR(100) NULL,
ADD COLUMN `email_verified_at` TIMESTAMP NULL;
```

Then run:
```bash
php artisan migrate
```

## Step 3: Create Test Users

Run the seeder to create admin and test users:
```bash
php artisan db:seed --class=UserSeeder
```

This creates:
1. **Admin User**
   - Email: `admin@medtalks.in`
   - Password: `password`

2. **Test User**
   - Email: `test@medtalks.in`
   - Password: `password`

⚠️ **Important**: Change these passwords in production!

## Step 4: Build Frontend Assets

```bash
npm install
npm run build
```

For development with hot reload:
```bash
npm run dev
```

## Step 5: Start the Application

```bash
php artisan serve
```

Visit: `http://localhost:8000`

## Step 6: Test Authentication

### Test Login
1. Go to `http://localhost:8000/login`
2. Login with:
   - Email: `admin@medtalks.in`
   - Password: `password`

### Test Registration
1. Go to `http://localhost:8000/register`
2. Create a new account
3. Verify user appears in `zc_mindpress_users` table

### Test Episode Management
1. After logging in, click "Episodes" in navigation
2. Try creating, editing, and viewing episodes

## Verification Checklist

- [ ] Database connection successful
- [ ] Migrations run without errors
- [ ] Test users created
- [ ] Can login with test credentials
- [ ] Can register new user
- [ ] Profile page loads correctly
- [ ] Can update profile
- [ ] Episodes page accessible
- [ ] Can create/edit episodes

## Common Issues

### Issue: "Table already exists" error
**Solution**: Skip the user table migration or ensure your existing table has all required fields.

### Issue: Login fails
**Check**:
1. Password is hashed with bcrypt
2. `action` field is 'active'
3. Email exists in database
4. Database connection is correct

### Issue: "Remember me" doesn't work
**Check**: `remember_token` column exists (VARCHAR 100)

### Issue: Registration fails
**Check**:
1. Email is unique
2. Username is unique
3. All required fields have values or defaults

## Database Field Mapping

| Laravel Expected | Actual Field | Notes |
|-----------------|--------------|-------|
| `id` | `no` | Primary key |
| `name` | `username` + `display_name` | Model has accessor |
| `email` | `email` | Used for login |
| `password` | `password` | Auto-hashed |
| `created_at` | `user_registered` | Custom timestamp |
| `updated_at` | N/A | Disabled |

## Next Steps

After setup:
1. Change default passwords
2. Configure email settings for password reset
3. Set up proper user roles using `userlevel` field
4. Configure episode types and specialities
5. Add real user data

## Production Deployment

Before deploying to production:

1. **Change default passwords**:
   ```bash
   php artisan tinker
   ```
   ```php
   $user = DB::table('zc_mindpress_users')->where('email', 'admin@medtalks.in')->first();
   DB::table('zc_mindpress_users')->where('no', $user->no)->update(['password' => Hash::make('secure_password')]);
   ```

2. **Set environment to production**:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

3. **Optimize**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   npm run build
   ```

4. **Set proper permissions**:
   ```bash
   chmod -R 775 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

## Security Recommendations

1. ✅ Use strong passwords
2. ✅ Enable HTTPS in production
3. ✅ Keep Laravel and dependencies updated
4. ✅ Use environment variables for sensitive data
5. ✅ Enable email verification for new users
6. ✅ Implement rate limiting (already configured)
7. ✅ Regular database backups

## Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check web server error logs
3. Review database connection settings
4. Verify table structure matches requirements
5. Refer to `AUTHENTICATION_UPDATE.md` for detailed documentation

## Quick Commands Reference

```bash
# Run migrations
php artisan migrate

# Seed test users
php artisan db:seed --class=UserSeeder

# Build assets
npm run build

# Start dev server
npm run dev

# Start Laravel server
php artisan serve

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Check routes
php artisan route:list

# Access database
php artisan tinker
```

## Testing Authentication

### Using Tinker
```bash
php artisan tinker
```

```php
// Check if user exists
$user = App\Models\User::where('email', 'admin@medtalks.in')->first();

// View user data
$user->toArray();

// Check password
Hash::check('password', $user->password); // Should return true

// Create new user
$user = new App\Models\User();
$user->username = 'newuser';
$user->email = 'newuser@example.com';
$user->password = 'password';
$user->display_name = 'New User';
$user->userlevel = 'user';
$user->usser_Type = 'admin';
$user->action = 'active';
$user->user_registered = now();
$user->save();
```

## Success Indicators

You'll know everything is working when:
1. ✅ Login page loads
2. ✅ Can login with test credentials
3. ✅ Dashboard appears after login
4. ✅ User name shows in navigation
5. ✅ Can access Episodes page
6. ✅ Can logout successfully
7. ✅ Can register new users
8. ✅ Profile update works

---

**Last Updated**: October 27, 2025
**Laravel Version**: 12.x
**Inertia Version**: Latest with React
