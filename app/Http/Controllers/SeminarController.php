<?php

namespace App\Http\Controllers;

use App\Models\Seminar;
use App\Models\SponsorPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SeminarController extends Controller
{
    /**
     * Display a listing of the seminars.
     */
    public function index()
    {
        $seminars = Seminar::active()
            ->orderBy('schedule_timestamp', 'DESC')
            ->get()
            ->map(function ($seminar) {
                return [
                    'id' => $seminar->seminar_no,
                    'title' => $seminar->seminar_title,
                    'desc' => $seminar->seminar_desc,
                    'video_status' => $seminar->video_status,
                    'videoSource' => $seminar->videoSource,
                    'schedule_timestamp' => $seminar->schedule_timestamp,
                    'custom_url' => $seminar->custom_url,
                    'shorten_url' => $seminar->shorten_url,
                    'video_image' => $seminar->video_image,
                    'speakerids' => $seminar->speakerids,
                    'seminar_speciality' => $seminar->seminar_speciality,
                    'isFeatured' => $seminar->isFeatured,
                    'type_display' => $seminar->type_display,
                ];
            });

        return Inertia::render('Seminars/Index', [
            'seminars' => $seminars,
        ]);
    }

    /**
     * Show the form for creating a new seminar.
     */
    public function create()
    {
        return Inertia::render('Seminars/Form', [
            'seminar' => null,
            'sponsorPages' => $this->getSponsorPages(),
            'specialities' => $this->getSpecialities(),
            'educationPartners' => $this->getEducationPartners(),
        ]);
    }

    /**
     * Store a newly created seminar in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'seminar_title' => 'required|string|max:250',
            'custom_url' => 'required|string|max:256|unique:seminar,custom_url',
            'seminar_desc' => 'nullable|string',
            'seminar_auth' => 'nullable|string|max:245',
            'video_url' => 'nullable|string|max:250',
            'video_url2' => 'nullable|string|max:250',
            'video_url3' => 'nullable|string|max:250',
            'stream_url' => 'nullable|string|max:200',
            'offline_url' => 'nullable|string',
            'video_status' => 'required|in:live,schedule,archive,new,deleted',
            'videoSource' => 'required|in:youTube,faceBook,mp4,other',
            'schedule_timestamp' => 'required|date',
            'uploade_date' => 'nullable|string|max:150',
            'countdown' => 'nullable|in:yes,no',
            'countdowntime' => 'nullable|string|max:250',
            'seminar_speciality' => 'nullable|string|max:15',
            'speakerids' => 'nullable|array',
            'sponsor_ids' => 'nullable|string|max:256',
            'shorten_url' => 'nullable|string|max:255',
            'video_button' => 'boolean',
            'isFeatured' => 'nullable|in:0,1',
            'sand_notifaction' => 'nullable|in:yes,no',
            'featured' => 'nullable|integer',
            'chatBox' => 'nullable|in:0,1',
            'showArchive' => 'nullable|in:0,1',
            'businessSponsered' => 'nullable|in:0,1',
            'questionBox' => 'nullable|in:0,1',
            'is_registered' => 'boolean',
            'is_custom_registration' => 'boolean',
            'hasMCQ' => 'nullable|string|max:100',
            're_attempts' => 'nullable|integer|min:0|max:127',
            'seminar_type' => 'nullable|string|max:255',
            'poll_link' => 'nullable|string|max:255',
            'alt_image' => 'nullable|string|max:200',
            'seo_pageTitle' => 'nullable|string|max:256',
            'seo_metaKeywords' => 'nullable|string|max:256',
            'seo_metaDesctiption' => 'nullable|string|max:256',
            'seo_metaImage' => 'nullable|string|max:256',
            'seo_OgTitle' => 'nullable|string|max:256',
            'seo_canonical' => 'nullable|string|max:255',
            'education_partners' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=700,height=393',
            's_image1' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=640,height=360',
            's_image2' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=400,height=400',
        ], [
            'image.dimensions' => 'Featured image dimensions must be exactly 700 x 393 pixels.',
            's_image1.dimensions' => 'App banner dimensions must be exactly 640 x 360 pixels.',
            's_image2.dimensions' => 'App square image dimensions must be exactly 400 x 400 pixels.',
            'image.max' => 'Image size must be less than 1MB.',
        ]);

        $validated['custom_url'] = Str::lower($validated['custom_url']);
        $validated['created_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['created_ip'] = $request->ip();
        $validated['countdown'] = $validated['video_status'] == 'schedule' ? 'yes' : 'no';
        
        // Convert arrays to comma-separated strings
        if (isset($validated['speakerids']) && is_array($validated['speakerids'])) {
            $validated['speakerids'] = implode(',', $validated['speakerids']);
        }

        // Handle education partners
        if (isset($validated['education_partners'])) {
            $validated['education_partners'] = json_encode($validated['education_partners']);
        }

        // Handle featured image upload
        if ($request->hasFile('image')) {
            $validated['video_image'] = $this->handleImageUpload($request->file('image'));
        }

        // Handle app banner upload
        if ($request->hasFile('s_image1')) {
            $validated['s_image1'] = $this->handleImageUpload($request->file('s_image1'), 'app_banner');
        }

        // Handle app square image upload
        if ($request->hasFile('s_image2')) {
            $validated['s_image2'] = $this->handleImageUpload($request->file('s_image2'), 'app_square');
        }

        Seminar::create($validated);

        return redirect()->route('seminars.index')
            ->with('success', 'Seminar created successfully.');
    }

    /**
     * Show the form for editing the specified seminar.
     */
    public function edit(Seminar $seminar)
    {
        return Inertia::render('Seminars/Form', [
            'seminar' => [
                'id' => $seminar->seminar_no,
                'seminar_title' => $seminar->seminar_title,
                'seminar_desc' => $seminar->seminar_desc,
                'stream_url' => $seminar->stream_url,
                'offline_url' => $seminar->offline_url,
                'video_image' => $seminar->video_image,
                'schedule_timestamp' => $seminar->schedule_timestamp,
                'video_status' => $seminar->video_status,
                'videoSource' => $seminar->videoSource,
                'custom_url' => $seminar->custom_url,
                'shorten_url' => $seminar->shorten_url,
                'seminar_speciality' => $seminar->seminar_speciality,
                'speakerids' => $seminar->speakers_ids_array,
                'sponsor_ids' => $seminar->sponsor_ids,
                'video_button' => $seminar->video_button,
                'chatBox' => $seminar->chatBox,
                'showArchive' => $seminar->showArchive,
                'isFeatured' => $seminar->isFeatured,
                'featured' => $seminar->featured,
                'businessSponsered' => $seminar->businessSponsered,
                'questionBox' => $seminar->questionBox,
                'is_registered' => $seminar->is_registered,
                's_image1' => $seminar->s_image1,
                's_image2' => $seminar->s_image2,
                'education_partners' => $seminar->education_partners ?? [],
            ],
            'sponsorPages' => $this->getSponsorPages(),
            'specialities' => $this->getSpecialities(),
            'educationPartners' => $this->getEducationPartners(),
        ]);
    }

    /**
     * Update the specified seminar in storage.
     */
    public function update(Request $request, Seminar $seminar)
    {
        $validated = $request->validate([
            'seminar_title' => 'required|string|max:250',
            'custom_url' => 'required|string|max:256|unique:seminar,custom_url,' . $seminar->seminar_no . ',seminar_no',
            'seminar_desc' => 'nullable|string',
            'seminar_auth' => 'nullable|string|max:245',
            'video_url' => 'nullable|string|max:250',
            'video_url2' => 'nullable|string|max:250',
            'video_url3' => 'nullable|string|max:250',
            'stream_url' => 'nullable|string|max:200',
            'offline_url' => 'nullable|string',
            'video_status' => 'required|in:live,schedule,archive,new,deleted',
            'videoSource' => 'required|in:youTube,faceBook,mp4,other',
            'schedule_timestamp' => 'required|date',
            'uploade_date' => 'nullable|string|max:150',
            'countdown' => 'nullable|in:yes,no',
            'countdowntime' => 'nullable|string|max:250',
            'seminar_speciality' => 'nullable|string|max:15',
            'speakerids' => 'nullable|array',
            'sponsor_ids' => 'nullable|string|max:256',
            'shorten_url' => 'nullable|string|max:255',
            'video_button' => 'boolean',
            'isFeatured' => 'nullable|in:0,1',
            'sand_notifaction' => 'nullable|in:yes,no',
            'featured' => 'nullable|integer',
            'chatBox' => 'nullable|in:0,1',
            'showArchive' => 'nullable|in:0,1',
            'businessSponsered' => 'nullable|in:0,1',
            'questionBox' => 'nullable|in:0,1',
            'is_registered' => 'boolean',
            'is_custom_registration' => 'boolean',
            'hasMCQ' => 'nullable|string|max:100',
            're_attempts' => 'nullable|integer|min:0|max:127',
            'seminar_type' => 'nullable|string|max:255',
            'poll_link' => 'nullable|string|max:255',
            'alt_image' => 'nullable|string|max:200',
            'seo_pageTitle' => 'nullable|string|max:256',
            'seo_metaKeywords' => 'nullable|string|max:256',
            'seo_metaDesctiption' => 'nullable|string|max:256',
            'seo_metaImage' => 'nullable|string|max:256',
            'seo_OgTitle' => 'nullable|string|max:256',
            'seo_canonical' => 'nullable|string|max:255',
            'education_partners' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=700,height=393',
            's_image1' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=640,height=360',
            's_image2' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=400,height=400',
        ], [
            'image.dimensions' => 'Featured image dimensions must be exactly 700 x 393 pixels.',
            's_image1.dimensions' => 'App banner dimensions must be exactly 640 x 360 pixels.',
            's_image2.dimensions' => 'App square image dimensions must be exactly 400 x 400 pixels.',
            'image.max' => 'Image size must be less than 1MB.',
        ]);

        $validated['custom_url'] = Str::lower($validated['custom_url']);
        $validated['modified_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['modified_on'] = now()->format('Y-m-d H:i:s');
        $validated['modified_ip'] = $request->ip();
        $validated['countdown'] = $validated['video_status'] == 'schedule' ? 'yes' : 'no';
        
        // Convert arrays to comma-separated strings
        if (isset($validated['speakerids']) && is_array($validated['speakerids'])) {
            $validated['speakerids'] = implode(',', $validated['speakerids']);
        }

        // Handle education partners
        if (isset($validated['education_partners'])) {
            $validated['education_partners'] = json_encode($validated['education_partners']);
        }

        // Handle featured image upload
        if ($request->hasFile('image')) {
            if ($seminar->video_image) {
                Storage::delete('public/seminar/' . $seminar->video_image);
            }
            $validated['video_image'] = $this->handleImageUpload($request->file('image'));
        }

        // Handle app banner upload
        if ($request->hasFile('s_image1')) {
            if ($seminar->s_image1) {
                Storage::delete('public/seminar/' . $seminar->s_image1);
            }
            $validated['s_image1'] = $this->handleImageUpload($request->file('s_image1'), 'app_banner');
        }

        // Handle app square image upload
        if ($request->hasFile('s_image2')) {
            if ($seminar->s_image2) {
                Storage::delete('public/seminar/' . $seminar->s_image2);
            }
            $validated['s_image2'] = $this->handleImageUpload($request->file('s_image2'), 'app_square');
        }

        $seminar->update($validated);

        return redirect()->route('seminars.index')
            ->with('success', 'Seminar updated successfully.');
    }

    /**
     * Remove the specified seminar from storage.
     */
    public function destroy(Seminar $seminar)
    {
        $seminar->update(['video_status' => 'deleted']);
        
        return redirect()->route('seminars.index')
            ->with('success', 'Seminar deleted successfully.');
    }

    /**
     * Handle image upload and WebP conversion
     */
    private function handleImageUpload($file, $prefix = 'featured')
    {
        $fileName = time() . '_' . $prefix . '_' . str_replace(' ', '-', $file->getClientOriginalName());
        $file->storeAs('public/seminar', $fileName);

        // Convert to WebP if needed
        $filePath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'seminar' . DIRECTORY_SEPARATOR . $fileName);
        $fileExt = strtolower($file->getClientOriginalExtension());
        
        // Check if file exists before processing
        if (!file_exists($filePath)) {
            return $fileName;
        }
        
        if (in_array($fileExt, ['jpeg', 'jpg', 'png'])) {
            $fileNameWebp = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
            $webpPath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'seminar' . DIRECTORY_SEPARATOR . $fileNameWebp);
            
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

        return $sponsorPages;
    }

    /**
     * Get specialities for dropdown
     */
    private function getSpecialities()
    {
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
     * Get education partners for dropdown
     */
    private function getEducationPartners()
    {
        $partners = DB::table('education_partners')
            ->select('id as value', 'name as label')
            ->orderBy('name')
            ->get()
            ->map(function ($partner) {
                return [
                    'value' => (string) $partner->value,
                    'label' => $partner->label,
                ];
            })
            ->toArray();

        return $partners;
    }

    /**
     * Get speakers for dropdown
     */
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
}
