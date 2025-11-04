<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\FrontendUser;
use App\Models\Specialty;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ConferenceController extends Controller
{
    /**
     * Display a listing of the conferences.
     */
    public function index()
    {
        $conferences = Conference::active()
            ->orderBy('conference_id', 'DESC')
            ->get()
            ->map(function ($conference) {
                // Get subscriber count
                $subscriberCount = DB::table('zc_subscribe')
                    ->where('type', 'conference')
                    ->where('ref_id', $conference->conference_id)
                    ->where('status', 'subscribed')
                    ->distinct('user_id')
                    ->count('user_id');

                return [
                    'id' => $conference->conference_id,
                    'title' => $conference->conference_title,
                    'description' => $conference->conference_description,
                    'agenda' => $conference->conference_agenda,
                    'schedule_date' => $conference->conference_date,
                    'end_date' => $conference->conference_endDate,
                    'start_time' => $conference->conference_start_time,
                    'end_time' => $conference->conference_end_time,
                    'banner' => $conference->conference_banner,
                    'status' => $conference->status,
                    'custom_url' => $conference->conference_customURL,
                    'subscribers' => $subscriberCount,
                    'conference_name' => $conference->conferenceName,
                ];
            });

        return Inertia::render('Conferences/Index', [
            'conferences' => $conferences,
        ]);
    }

    /**
     * Show the form for creating a new conference.
     */
    public function create()
    {
        return Inertia::render('Conferences/Form', [
            'conference' => null,
            'speakers' => $this->getSpeakers(),
            'specialities' => $this->getSpecialities(),
        ]);
    }

    /**
     * Store a newly created conference in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'conference_title' => 'required|string|max:256',
            'conference_subtile' => 'nullable|string|max:256',
            'conference_customURL' => 'required|string|max:256|unique:conference,conference_customURL',
            'conference_description' => 'nullable|string',
            'conference_address' => 'nullable|string',
            'conference_agenda' => 'nullable|string',
            'conference_whyAttend' => 'nullable|string',
            'conference_replay' => 'nullable|string',
            'stream_source' => 'required|in:youtube,facebook,s3Direct,other',
            'conferenceName' => 'required|string',
            'hall' => 'nullable|string|max:255',
            'status' => 'required|in:live,schedule,archive',
            'conference_date' => 'nullable|string|max:255',
            'conference_endDate' => 'nullable|string|max:255',
            'conference_start_time' => 'nullable|string|max:255',
            'conference_end_time' => 'nullable|string|max:255',
            'speakerids' => 'nullable|array',
            'search_specialty' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'frame_image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        $validated['conference_customURL'] = Str::lower($validated['conference_customURL']);
        
        // Convert arrays to comma-separated strings
        if (isset($validated['speakerids']) && is_array($validated['speakerids'])) {
            $validated['speakerids'] = implode(',', $validated['speakerids']);
        }

        if (isset($validated['search_specialty']) && is_array($validated['search_specialty'])) {
            $validated['speciality_id'] = implode(',', $validated['search_specialty']);
        }

        // Handle banner image upload
        if ($request->hasFile('image')) {
            $validated['conference_banner'] = $this->handleImageUpload($request->file('image'), 'confImg');
        }

        // Handle frame image upload
        if ($request->hasFile('frame_image')) {
            $validated['frame_image'] = $this->handleImageUpload($request->file('frame_image'), 'frameImg');
        }

        $conference = Conference::create($validated);

        return redirect()->route('conferences.index')
            ->with('success', 'Conference created successfully.');
    }

    /**
     * Show the form for editing the specified conference.
     */
    public function edit(Conference $conference)
    {
        // Convert comma-separated values to arrays for the form
        $conference->speakerids = $conference->speakerids ? explode(',', $conference->speakerids) : [];
        $conference->speciality_id = $conference->speciality_id ? explode(',', $conference->speciality_id) : [];

        return Inertia::render('Conferences/Form', [
            'conference' => $conference,
            'speakers' => $this->getSpeakers(),
            'specialities' => $this->getSpecialities(),
        ]);
    }

    /**
     * Update the specified conference in storage.
     */
    public function update(Request $request, Conference $conference)
    {
        $validated = $request->validate([
            'conference_title' => 'required|string|max:256',
            'conference_subtile' => 'nullable|string|max:256',
            'conference_customURL' => 'required|string|max:256|unique:conference,conference_customURL,' . $conference->conference_id . ',conference_id',
            'conference_description' => 'nullable|string',
            'conference_address' => 'nullable|string',
            'conference_agenda' => 'nullable|string',
            'conference_whyAttend' => 'nullable|string',
            'conference_replay' => 'nullable|string',
            'stream_source' => 'required|in:youtube,facebook,s3Direct,other',
            'conferenceName' => 'required|string',
            'hall' => 'nullable|string|max:255',
            'status' => 'required|in:live,schedule,archive',
            'conference_date' => 'nullable|string|max:255',
            'conference_endDate' => 'nullable|string|max:255',
            'conference_start_time' => 'nullable|string|max:255',
            'conference_end_time' => 'nullable|string|max:255',
            'speakerids' => 'nullable|array',
            'search_specialty' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'frame_image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        $validated['conference_customURL'] = Str::lower($validated['conference_customURL']);
        
        // Convert arrays to comma-separated strings
        if (isset($validated['speakerids']) && is_array($validated['speakerids'])) {
            $validated['speakerids'] = implode(',', $validated['speakerids']);
        }

        if (isset($validated['search_specialty']) && is_array($validated['search_specialty'])) {
            $validated['speciality_id'] = implode(',', $validated['search_specialty']);
        }

        // Handle banner image upload
        if ($request->hasFile('image')) {
            $validated['conference_banner'] = $this->handleImageUpload($request->file('image'), 'confImg');
        }

        // Handle frame image upload
        if ($request->hasFile('frame_image')) {
            $validated['frame_image'] = $this->handleImageUpload($request->file('frame_image'), 'frameImg');
        }

        $conference->update($validated);

        return redirect()->route('conferences.index')
            ->with('success', 'Conference updated successfully.');
    }

    /**
     * Remove the specified conference from storage.
     */
    public function destroy(Conference $conference)
    {
        $conference->update(['status' => 'deleted']);
        
        return redirect()->route('conferences.index')
            ->with('success', 'Conference deleted successfully.');
    }

    /**
     * Handle image upload and WebP conversion
     */
    private function handleImageUpload($file, $prefix = 'confImg')
    {
        $fileName = time() . '_' . $prefix . '_' . str_replace(' ', '-', $file->getClientOriginalName());
        $fileExt = strtolower($file->getClientOriginalExtension());
        
        // Define destination path
        $destinationPath = public_path('../../uploads/conference');
        
        // Create directory if it doesn't exist
        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }
        
        // Move uploaded file
        $file->move($destinationPath, $fileName);
        
        // Convert to WebP if needed
        $webpFileName = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
        $webpPath = $destinationPath . '/' . $webpFileName;
        
        if (in_array($fileExt, ['jpeg', 'jpg', 'png'])) {
            try {
                $img = null;
                if ($fileExt === 'jpeg' || $fileExt === 'jpg') {
                    $img = imagecreatefromjpeg($destinationPath . '/' . $fileName);
                } elseif ($fileExt === 'png') {
                    $img = imagecreatefrompng($destinationPath . '/' . $fileName);
                }
                
                if ($img !== false && $img !== null) {
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    imagewebp($img, $webpPath, 100);
                    imagedestroy($img);
                    // Return WebP version
                    return $webpFileName;
                }
            } catch (\Exception $e) {
                // If conversion fails, return original
                return $fileName;
            }
        }
        
        return $fileName;
    }

    /**
     * Get speakers for dropdown
     */
    private function getSpeakers()
    {
        $speakers = FrontendUser::where('userType', 'instructor')
            ->where('userStatus', 'active')
            ->select(
                'user_id as value',
                DB::raw('CONCAT(COALESCE(title, ""), " ", user_FullName) as label')
            )
            ->orderBy('user_FullName')
            ->get()
            ->map(function ($speaker) {
                return [
                    'value' => (string) $speaker->value,
                    'label' => trim($speaker->label),
                ];
            })
            ->toArray();

        return $speakers;
    }

    /**
     * Get specialities for dropdown
     */
    private function getSpecialities()
    {
        $specialities = Specialty::where(['speciality_type' => 'speciality', 'parentID' => 0, 'parentID2' => 0])
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
}