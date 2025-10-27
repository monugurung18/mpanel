# Authentication System Update

This document describes the updates made to use the existing `zc_mindpress_users` table for authentication instead of the default Laravel `users` table.

## Database Structure

### Table: `zc_mindpress_users`

The authentication system now uses the `zc_mindpress_users` table with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `no` | BIGINT (Primary Key) | User ID |
| `username` | VARCHAR | User's username (unique) |
| `password` | VARCHAR | Hashed password |
| `userid` | VARCHAR | Additional user identifier |
| `userlevel` | VARCHAR | User level/role (default: 'user') |
| `email` | VARCHAR | User's email (unique) |
| `timestamp` | TIMESTAMP | Record timestamp |
| `usser_Type` | VARCHAR | User type (default: 'admin') |
| `action` | VARCHAR | User status (default: 'active') |
| `mobile_no` | VARCHAR | Mobile phone number |
| `display_name` | VARCHAR | Display name for the user |
| `user_registered` | TIMESTAMP | Registration date |
| `image_url` | VARCHAR | Profile image URL |
| `frontend_users` | VARCHAR | Frontend user reference |
| `frontend_users_id` | BIGINT | Frontend user ID |
| `remember_token` | VARCHAR(100) | Remember me token |
| `email_verified_at` | TIMESTAMP | Email verification timestamp |

## Files Modified

### 1. User Model (`app/Models/User.php`)

**Key Changes:**
- Set table name to `zc_mindpress_users`
- Set primary key to `no`
- Disabled automatic timestamps (`$timestamps = false`)
- Updated fillable fields to match table structure
- Added custom attribute accessor for `name` (returns `display_name` or `username`)
- Configured authentication identifier to use `no` field
- Added proper casting for datetime fields

**Important Methods:**
```php
getAuthIdentifierName()  // Returns 'no' as primary key
getAuthPassword()        // Returns password field
getNameAttribute()       // Returns display_name or username
```

### 2. Profile Update Request (`app/Http/Requests/ProfileUpdateRequest.php`)

**Changes:**
- Updated email unique validation to use `zc_mindpress_users` table
- Changed primary key reference from `id` to `no`

### 3. Profile Controller (`app/Http/Controllers/ProfileController.php`)

**Changes:**
- Modified `update()` method to map `name` field to both `username` and `display_name`
- Ensures proper field updates for the custom table structure

### 4. Registered User Controller (`app/Http/Controllers/Auth/RegisteredUserController.php`)

**Changes:**
- Updated validation to use correct table name
- Modified user creation to populate:
  - `username` (from name input)
  - `display_name` (from name input)
  - `email`
  - `password` (auto-hashed by model)
  - `userlevel` (default: 'user')
  - `usser_Type` (default: 'admin')
  - `action` (default: 'active')
  - `user_registered` (current timestamp)

### 5. Episode Controller (`app/Http/Controllers/EpisodeController.php`)

**Changes:**
- Updated to use `username` or `display_name` instead of `name` for tracking
- Modified in `store()` and `update()` methods for `created_by` and `modified_by` fields

### 6. Migration (`database/migrations/2025_10_27_000000_create_zc_mindpress_users_table.php`)

**Purpose:**
- Creates `zc_mindpress_users` table if it doesn't exist
- Ensures all required fields are present
- Provides backup if table needs to be recreated

## Authentication Flow

### Login Process
1. User enters email and password
2. `LoginRequest` validates credentials
3. Laravel Auth attempts login using email and password
4. On success, user is authenticated with `no` as primary identifier

### Registration Process
1. User provides name, email, and password
2. `RegisteredUserController` validates input
3. User record created with:
   - `username` = name
   - `display_name` = name
   - `email` = email
   - `password` = hashed password
   - Default values for `userlevel`, `usser_Type`, `action`
4. User is automatically logged in

### Profile Update Process
1. User updates name and/or email
2. System updates both `username` and `display_name` fields
3. If email changed, `email_verified_at` is reset to null

## Configuration

### Auth Config (`config/auth.php`)
No changes required. The system uses:
- Guard: `web` (session-based)
- Provider: `users` (Eloquent)
- Model: `App\Models\User`

The User model handles the custom table mapping internally.

## Migration Instructions

### If Table Already Exists
If you already have a `zc_mindpress_users` table:

1. **Skip the migration or mark it as run:**
   ```bash
   php artisan migrate --skip-migration=2025_10_27_000000_create_zc_mindpress_users_table.php
   ```

2. **Verify table structure:**
   Make sure your existing table has all required fields, especially:
   - `remember_token` (VARCHAR 100)
   - `email_verified_at` (TIMESTAMP)

3. **Add missing fields if needed:**
   ```sql
   ALTER TABLE `zc_mindpress_users` 
   ADD COLUMN `remember_token` VARCHAR(100) NULL AFTER `frontend_users_id`,
   ADD COLUMN `email_verified_at` TIMESTAMP NULL AFTER `remember_token`;
   ```

### If Table Doesn't Exist
Run migrations normally:
```bash
php artisan migrate
```

## Testing

### Test Login
1. Ensure you have a user in `zc_mindpress_users` table
2. Password should be hashed using bcrypt
3. Try logging in with email and password

### Test Registration
1. Go to `/register`
2. Fill in name, email, password, and password confirmation
3. Verify user is created in `zc_mindpress_users`
4. Check that both `username` and `display_name` are populated

### Test Profile Update
1. Login and go to `/profile`
2. Update name and/or email
3. Verify changes in database

## Important Notes

### Password Hashing
- Passwords are automatically hashed by Laravel's `hashed` cast
- Uses bcrypt by default
- No need for manual `Hash::make()` in most cases

### User Identification
- Primary key is `no` (not `id`)
- Username field is `username` (not `name`)
- Display name is in `display_name` field
- The model provides a `name` accessor that returns `display_name ?? username`

### Timestamps
- Model has `$timestamps = false`
- Custom timestamp fields: `timestamp`, `user_registered`
- Standard Laravel timestamp tracking is disabled

### User Levels and Types
Default values for new registrations:
- `userlevel`: 'user'
- `usser_Type`: 'admin'
- `action`: 'active'

You may want to customize these based on your requirements.

## Compatibility

### Episode Management
The episode system now correctly tracks users using `username` or `display_name` for:
- `created_by` field
- `modified_by` field

### Laravel Breeze
All Laravel Breeze features remain functional:
- Login
- Registration
- Password Reset (uses email)
- Email Verification
- Profile Management

## Troubleshooting

### Login Issues
**Problem:** Can't login with existing users
**Solution:** 
1. Check if passwords are hashed with bcrypt
2. Verify email field is populated
3. Ensure `action` field is 'active'

### Registration Issues
**Problem:** Error creating new users
**Solution:**
1. Check `username` and `email` are unique
2. Verify all required fields allow null or have defaults
3. Check database collation for varchar fields

### Profile Update Issues
**Problem:** Name doesn't update
**Solution:**
1. Verify both `username` and `display_name` are being updated
2. Check field lengths in database (should be VARCHAR 255)

## Security Considerations

1. **Password Hashing**: Always uses bcrypt (Laravel default)
2. **Remember Token**: Properly implemented for "remember me" functionality
3. **Email Verification**: Supported via `email_verified_at` field
4. **Rate Limiting**: Maintained for login attempts
5. **CSRF Protection**: Enabled for all forms

## Future Enhancements

Consider implementing:
1. **Role-Based Access Control (RBAC)**: Using `userlevel` field
2. **User Status Management**: Using `action` field (active/inactive/banned)
3. **Two-Factor Authentication**: Additional security layer
4. **Social Login**: OAuth integration
5. **User Activity Logging**: Track logins and actions

## Support

For issues or questions regarding the authentication system:
1. Check this documentation
2. Review Laravel authentication documentation
3. Inspect the User model configuration
4. Verify database table structure matches requirements
