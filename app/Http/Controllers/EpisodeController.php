<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use App\Models\SponsorPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EpisodeController extends Controller
{
    /**
     * Display a listing of episodes.
     */
    public function index()
    {
        $episodes = Episode::active()
            ->orderBy('date_time', 'desc')
            ->get()
            ->map(function ($episode) {
                return [
                    'id' => $episode->id,
                    'title' => $episode->title,
                    'desc' => $episode->desc,
                    'date_time' => $episode->date_time, // Already a string in database
                    'feature_image_banner' => $episode->feature_image_banner,
                    'custom_url' => $episode->custom_url,
                    'video_status' => $episode->video_status,
                    'episode_type' => $episode->episode_type,
                    'type_display' => $episode->type_display,
                ];
            });

        return Inertia::render('Episodes/Index', [
            'episodes' => $episodes,
        ]);
    }

    /**
     * Show the form for creating a new episode.
     */
    public function create()
    {
        return Inertia::render('Episodes/Form', [
            'episode' => null,
            'sponsorPages' => 
            
            $this->getSponsorPages(),
            'specialities' => $this->getSpecialities(),
        ]);
    }

    /**
     * Store a newly created episode in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'custom_url' => 'required|string|unique:medtalks_tv,custom_url',
            'desc' => 'required|string',
            'video_url' => 'required|string',
            'video_status' => 'required|in:live,schedule,archive,new',
            'videoSource' => 'required|in:youTube,faceBook,mp4,other',
            'date_time' => 'required|date',
            'episode_type' => 'required|string',
            'speakers_ids' => 'nullable|array',
            'episode_no' => 'nullable|string',
            'speciality_ids' => 'nullable|array',
            'question_required' => 'boolean',
            'login_required' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=733,height=370',
        ], [
            'image.dimensions' => 'Image dimensions must be exactly 733 x 370 pixels.',
            'image.max' => 'Image size must be less than 1MB.',
        ]);

        $validated['custom_url'] = Str::lower($validated['custom_url']);
        $validated['created_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['created_ip'] = $request->ip();
        $validated['episode_status'] = 'active';
        
        // Convert arrays to comma-separated strings
        if (isset($validated['speakers_ids']) && is_array($validated['speakers_ids'])) {
            $validated['speakers_ids'] = implode(',', $validated['speakers_ids']);
        }
        
        if (isset($validated['speciality_ids']) && is_array($validated['speciality_ids'])) {
            $validated['speciality_id'] = implode(',', $validated['speciality_ids']);
            unset($validated['speciality_ids']); // Remove array version
        } else {
            $validated['speciality_id'] = null;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['feature_image_banner'] = $this->handleImageUpload($request->file('image'));
        }

        Episode::create($validated);

        return redirect()->route('episodes.index')
            ->with('success', 'Episode created successfully.');
    }

    /**
     * Show the form for editing the specified episode.
     */
    public function edit(Episode $episode)
    {  
        // Get specialty IDs as array
        $specialityIds = $episode->speciality_ids_array;
        
        // Get speaker IDs as array  
        $speakerIds = $episode->speakers_ids_array;
        
        return Inertia::render('Episodes/Form', [
            'episode' => [
                'id' => $episode->id,
                'title' => $episode->title,
                'desc' => $episode->desc,
                'speakers_ids' => $speakerIds,
                'episode_type' => $episode->episode_type,
                'video_status' => $episode->video_status,
                'videoSource' => $episode->videoSource,
                'video_url' => $episode->video_url,
                'date_time' => $episode->date_time, // Already a string in database
                'feature_image_banner' => $episode->feature_image_banner,
                'custom_url' => $episode->custom_url,
                'episode_no' => $episode->episode_no,
                'speciality_id' => $specialityIds,
                'question_required' => $episode->question_required,
                'login_required' => $episode->login_required,
            ],
            'sponsorPages' => $this->getSponsorPages(),
            'specialities' => $this->getSpecialities(),
        ]);
    }

    /**
     * Update the specified episode in storage.
     */
    public function updateEpisode(Request $request, Episode $episode)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'custom_url' => 'required|string',
            'desc' => 'nullable|string',
            'video_url' => 'nullable|string',
            'video_status' => 'required|in:live,schedule,archive,new',
            'videoSource' => 'required|in:youTube,faceBook,mp4,other',
            'date_time' => 'required|date',
            'episode_type' => 'required|string',
            'speakers_ids' => 'nullable|array',
            'episode_no' => 'nullable|string',
            'speciality_ids' => 'nullable|array',
            'question_required' => 'boolean',
            'login_required' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=700,height=393',
        ], [
            'image.dimensions' => 'Image dimensions must be exactly 700 x 393 pixels.',
            'image.max' => 'Image size must be less than 1MB.',
        ]);

        $validated['custom_url'] = Str::lower($validated['custom_url']);
        $validated['modified_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['modified_on'] = now()->format('Y-m-d H:i:s'); // Store as string
        $validated['modified_ip'] = $request->ip();
        
        // Convert arrays to comma-separated strings
        if (isset($validated['speakers_ids']) && is_array($validated['speakers_ids'])) {
            $validated['speakers_ids'] = implode(',', $validated['speakers_ids']);
        }
        
        if (isset($validated['speciality_ids']) && is_array($validated['speciality_ids'])) {
            $validated['speciality_id'] = implode(',', $validated['speciality_ids']);
            unset($validated['speciality_ids']); // Remove array version
        } else {
            $validated['speciality_id'] = null;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($episode->feature_image_banner) {
                Storage::delete('public/medtalks_tv/' . $episode->feature_image_banner);
            }
            $validated['feature_image_banner'] = $this->handleImageUpload($request->file('image'));
        }

        $episode->update($validated);

        return redirect()->route('episodes.index')
            ->with('success', 'Episode updated successfully.');
    }

    /**
     * Remove the specified episode from storage.
     */
    public function destroy(Episode $episode)
    {
        $episode->update(['video_status' => 'deleted']);
        
        return redirect()->route('episodes.index')
            ->with('success', 'Episode deleted successfully.');
    }

    /**
     * Handle image upload and WebP conversion
     */
    private function handleImageUpload($file)
    {
        $fileName = time() . '_' . str_replace(' ', '-', $file->getClientOriginalName());
        $file->storeAs('public/medtalks_tv', $fileName);

        // Convert to WebP if needed
        $filePath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'medtalks_tv' . DIRECTORY_SEPARATOR . $fileName);
        $fileExt = strtolower($file->getClientOriginalExtension());
        
        // Check if file exists before processing
        if (!file_exists($filePath)) {
            return $fileName; // Return original filename if file doesn't exist
        }
        
        if (in_array($fileExt, ['jpeg', 'jpg', 'png'])) {
            $fileNameWebp = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
            $webpPath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'medtalks_tv' . DIRECTORY_SEPARATOR . $fileNameWebp);
            
            $img = null;
            
            try {
                if ($fileExt === 'jpeg' || $fileExt === 'jpg') {
                    $img = @imagecreatefromjpeg($filePath);
                } elseif ($fileExt === 'png') {
                    $img = @imagecreatefrompng($filePath);
                }
                
                if ($img !== false && $img !== null) {
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    imagewebp($img, $webpPath, 100);
                    imagedestroy($img);
                }
            } catch (\Exception $e) {
                // If conversion fails, just use the original file
                \Log::error('Image conversion failed: ' . $e->getMessage());
            }
        }

        return $fileName;
    }

    /**
     * Get sponsor pages for dropdown
     */
    private function getSponsorPages()
    {
        $sponsorPages = SponsorPage::seminar()
            ->sponsor()
            ->withCustomUrl()
            ->active()
            ->get(['id', 'title', 'custom_url'])
            ->map(function ($page) {
                return [
                    'value' => $page->custom_url,
                    'label' => $page->title,
                ];
            })
            ->toArray();

        // Add default episode types
        return array_merge($sponsorPages, [
            [
                'value' => 'afternoon',
                'label' => 'Chat With Dr KK Aragwal',
            ],
            [
                'value' => 'evening',
                'label' => 'Medtalks With Dr KK Agarwal',
            ],
        ]);
    }

    /**
     * Get specialities for dropdown
     */
    private function getSpecialities()
    {
        // Fetch specialities from user_specialty table
        $specialities = DB::table('user_specialty')
            ->where(['speciality_type'=> 'speciality','parentID'=> 0,'parentID2'=>0])
            ->where('status', 'on')

            ->select('no as value', 'title as label')
            ->orderBy('title')
            ->get()
            ->map(function ($specialty) {
                return [
                    'value' => (string) $specialty->value,
                    'label' => $specialty->label,
                ];
            })
            ->toArray();

        return $specialities;
    }

    /**
     * Get speakers for dropdown
     */
    public function getSpeakers()
    {
        // Fetch speakers from frontend_users table where userType='instructor'
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
}
