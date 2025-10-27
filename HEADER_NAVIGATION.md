# Header Navigation Implementation

This document describes the new Laravel/Inertia.js header navigation that replaces the PHP-based header.php file.

## Overview

The header has been completely rebuilt using React/Inertia.js while maintaining the same visual structure and functionality as the original PHP header.

## Features Implemented

### ✅ 1. Two-Tier Navigation Structure

**Top Bar (Dark Gray):**
- Logo: "Medtalks India"
- Notifications dropdown with badge
- User profile dropdown with avatar

**Main Navigation Bar (White):**
- Dashboard link
- Episodes link  
- Dynamic menu items from database (ready for implementation)
- Mobile responsive hamburger menu

### ✅ 2. Notifications System

- Bell icon with notification count badge
- Dropdown showing notification list
- Sample notifications included (can be replaced with real data)
- Each notification has:
  - Icon with color
  - Title
  - Description
  - Click action

### ✅ 3. Profile Dropdown

- User avatar (auto-generated from user name)
- Profile menu items:
  - Profile (with user icon)
  - Settings (with cog icon)
  - Lock screen (with lock icon)
  - Logout (with power icon, red color)

### ✅ 4. Dynamic Menu System

The layout is prepared to load dynamic menu items from the `zc_pages` table, just like the PHP version.

**Database Structure Expected:**
- `zc_pages` table with parent-child relationships
- `role_mapping` table for user permissions
- `zc_page_icons` table for menu icons

### ✅ 5. Mobile Responsive

- Hamburger menu for mobile devices
- Collapsible submenus
- Touch-friendly interface
- Full menu functionality on small screens

## File Changes

### 1. AuthenticatedLayout.jsx
**Location:** `resources/js/Layouts/AuthenticatedLayout.jsx`

**Key Features:**
```jsx
- Top bar with logo, notifications, and profile
- Main navigation bar with dynamic menu support
- Notification dropdown with badge
- Profile dropdown with icons
- Mobile responsive menu
- Submenu support (hover on desktop, click on mobile)
```

### 2. HandleInertiaRequests Middleware
**Location:** `app/Http/Middleware/HandleInertiaRequests.php`

**Added:**
- `menuItems` prop shared globally
- `getMenuItems()` method (ready for database integration)
- User permission checking structure

### 3. App Blade Template
**Location:** `resources/views/app.blade.php`

**Added:**
- Font Awesome 4.7.0 CDN link for icons

## Usage

### Basic Usage

The header is automatically included in all authenticated pages:

```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MyPage() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold">Page Title</h2>
            }
        >
            {/* Page content */}
        </AuthenticatedLayout>
    );
}
```

### Adding Custom Notifications

Modify the `notifications` array in `AuthenticatedLayout.jsx`:

```jsx
const notifications = [
    {
        id: 1,
        icon: 'fa-diamond',
        color: 'text-blue-600',
        title: 'New Order',
        description: 'Order #12345 received',
    },
    // Add more notifications
];
```

### Implementing Database Menu Items

To load menu from database, update `HandleInertiaRequests.php`:

```php
private function getMenuItems(Request $request): array
{
    if (!$request->user()) {
        return [];
    }

    $userId = $request->user()->no;

    // Get user's allowed pages
    $pagesQuery = DB::table('role_mapping')
        ->where('admin_user_id', $userId)
        ->where('is_active', '1')
        ->pluck('page_id')
        ->implode(',');

    if (empty($pagesQuery)) {
        // User has all permissions
        $pages = DB::table('zc_pages')
            ->where('zc_page_parent', 0)
            ->where('zc_page_type', 'backend')
            ->where('page_status', 'active')
            ->orderBy('zc_page_id')
            ->get();
    } else {
        // User has limited permissions
        $pages = DB::table('zc_pages')
            ->where('zc_page_parent', 0)
            ->where('zc_page_type', 'backend')
            ->where('page_status', 'active')
            ->whereIn('zc_page_id', explode(',', $pagesQuery))
            ->orderBy('zc_page_id')
            ->get();
    }

    return $pages->map(function ($page) use ($pagesQuery) {
        return [
            'id' => $page->zc_page_id,
            'title' => $page->zc_pageTitle,
            'icon' => $this->getPageIcon($page->pageICON),
            'children' => $this->getSubMenu($page->zc_page_id, $pagesQuery)
        ];
    })->toArray();
}

private function getPageIcon($iconId)
{
    $icon = DB::table('zc_page_icons')
        ->where('icon_id', $iconId)
        ->first();
    
    return $icon ? $icon->icon_class : 'fa-circle';
}

private function getSubMenu($parentId, $allowedPages)
{
    $query = DB::table('zc_pages')
        ->where('zc_page_parent', $parentId)
        ->where('page_status', 'active');

    if (!empty($allowedPages)) {
        $query->whereIn('zc_page_id', explode(',', $allowedPages));
    }

    return $query->get()->map(function ($child) {
        return [
            'id' => $child->zc_page_id,
            'title' => $child->zc_pageTitle,
        ];
    })->toArray();
}
```

## Styling

### Colors Used

- **Top Bar Background:** `bg-gray-800` (Dark Gray)
- **Top Bar Text:** `text-white`
- **Main Nav Background:** `bg-white`
- **Main Nav Text:** `text-gray-700`
- **Hover Background:** `hover:bg-gray-100`
- **Notification Badge:** `bg-red-600`
- **Icons Blue:** `text-blue-600`
- **Logout Red:** `text-red-600`

### Icons

All icons use Font Awesome 4.7.0:
- `fa-bell` - Notifications
- `fa-dashboard` - Dashboard
- `fa-video-camera` - Episodes
- `fa-user` - Profile
- `fa-cog` - Settings
- `fa-lock` - Lock Screen
- `fa-power-off` - Logout
- `fa-angle-down` - Dropdown arrows

## Menu Structure Example

```jsx
menuItems = [
    {
        id: 1,
        title: 'Content',
        icon: 'fa-file',
        children: [
            { id: 10, title: 'Articles' },
            { id: 11, title: 'Pages' },
            { id: 12, title: 'Media' }
        ]
    },
    {
        id: 2,
        title: 'Users',
        icon: 'fa-users',
        children: [
            { id: 20, title: 'All Users' },
            { id: 21, title: 'Roles' },
            { id: 22, title: 'Permissions' }
        ]
    },
    {
        id: 3,
        title: 'Settings',
        icon: 'fa-cog',
        children: []
    }
]
```

## Responsive Behavior

### Desktop (md and up):
- Horizontal navigation bar
- Hover to show submenus
- Notifications and profile in top right
- All menu items visible

### Mobile (below md):
- Hamburger menu icon
- Slide-down menu
- Click to expand submenus
- Stacked layout
- Full-width dropdown

## Migration from PHP Header

### Before (PHP):
```php
// header.php
<nav>
    <?php
    $sql = "SELECT * FROM zc_pages...";
    while($row = ...) {
        echo "<li>...</li>";
    }
    ?>
</nav>
```

### After (React/Inertia):
```jsx
// AuthenticatedLayout.jsx
<nav>
    {menuItems && menuItems.map((item) => (
        <NavLink key={item.id} href={item.url}>
            {item.title}
        </NavLink>
    ))}
</nav>
```

## Benefits

1. ✅ **No Page Reloads:** Inertia.js SPA navigation
2. ✅ **Type Safety:** React component props
3. ✅ **Maintainable:** Single source of truth for navigation
4. ✅ **Responsive:** Built-in mobile support
5. ✅ **Consistent:** Tailwind CSS styling
6. ✅ **Testable:** React component testing
7. ✅ **Fast:** Client-side rendering after initial load

## Next Steps

To fully integrate with your existing database:

1. **Create zc_pages Migration:**
   ```bash
   php artisan make:migration create_zc_pages_table
   ```

2. **Create zc_page_icons Migration:**
   ```bash
   php artisan make:migration create_zc_page_icons_table
   ```

3. **Create role_mapping Migration:**
   ```bash
   php artisan make:migration create_role_mapping_table
   ```

4. **Seed Initial Data:**
   - Import existing pages from old database
   - Import icons mapping
   - Import user role mappings

5. **Update HandleInertiaRequests:**
   - Uncomment and complete the `getMenuItems()` method
   - Add `getPageIcon()` method
   - Add `getSubMenu()` method

6. **Test:**
   - Login with different user roles
   - Verify menu items appear correctly
   - Test submenu functionality
   - Test mobile responsiveness

## Troubleshooting

### Icons not showing:
- Verify Font Awesome CDN is loaded in `app.blade.php`
- Check browser console for CSS errors
- Clear browser cache

### Menu items not loading:
- Check `HandleInertiaRequests` middleware
- Verify database connection
- Check user permissions in `role_mapping`
- Inspect Inertia props in browser DevTools

### Dropdown not working:
- Ensure Tailwind CSS is compiled
- Check JavaScript console for errors
- Verify React state management

## Support

For issues or questions:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for JavaScript errors
3. Verify database tables exist
4. Check Inertia version compatibility

---

**Last Updated:** October 27, 2025
**Laravel Version:** 12.x
**Inertia Version:** Latest
**React Version:** 18.x
**Tailwind CSS Version:** Latest
