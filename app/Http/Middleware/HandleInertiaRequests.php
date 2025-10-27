<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'menuItems' => $this->getMenuItems($request),
            'baseImagePath' => config('app.base_image_path'),
        ];
    }

    /**
     * Get menu items from database
     *
     * @return array
     */
    private function getMenuItems(Request $request): array
    {
        if (!$request->user()) {
            return [];
        }

        // For now, return empty array
        // In production, this would query the zc_pages table
        // based on user permissions from role_mapping table
        
        // Example structure:
        // return DB::table('zc_pages')
        //     ->where('zc_page_parent', 0)
        //     ->where('zc_page_type', 'backend')
        //     ->where('page_status', 'active')
        //     ->orderBy('zc_page_id')
        //     ->get()
        //     ->map(function ($page) {
        //         return [
        //             'id' => $page->zc_page_id,
        //             'title' => $page->zc_pageTitle,
        //             'icon' => $this->getPageIcon($page->pageICON),
        //             'children' => $this->getSubMenu($page->zc_page_id)
        //         ];
        //     })->toArray();

        return [];
    }
}
