<?php

namespace App\Http\Controllers;

use App\Models\FrontendUser;
use App\Models\Seminar;
use App\Models\SponsorPage;
use App\Models\EducationPartner;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class SeminarController extends Controller
{
    /**
     * Display a listing of the seminars.
     */
    public function index()
    {
        $seminars = Seminar::where('video_status', '!=', 'deleted')
            ->orderBy('schedule_timestamp', 'desc')
            ->paginate(10)
            ->through(fn ($seminar) => [
                'id' => $seminar->seminar_no,
                'title' => $seminar->seminar_title,
                'speciality' => $seminar->seminar_speciality,
                'video_status' => $seminar->video_status,
                'schedule_timestamp' => $seminar->schedule_timestamp,
                'video_image' => $seminar->video_image,
            ]);

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
            'html_json' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=700,height=393',
            's_image1' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=640,height=360',
            's_image2' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=400,height=400',
            'ads_banner' => 'nullable|array',
            'ads_banner.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            // Participants
            'moderators' => 'nullable|array',
            'panelists' => 'nullable|array',
            'speakers' => 'nullable|array',
            'chief_guests' => 'nullable|array',
        ], [
            'image.dimensions' => 'Featured image dimensions must be exactly 700 x 393 pixels.',
            's_image1.dimensions' => 'App banner dimensions must be exactly 640 x 360 pixels.',
            's_image2.dimensions' => 'App square image dimensions must be exactly 400 x 400 pixels.',
            'image.max' => 'Image size must be less than 1MB.',
        ]);

        $validated['custom_url'] = Str::lower($validated['custom_url']);
        $validated['created_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['modified_by'] = $validated['created_by'];
        $validated['created_ip'] = $request->ip();
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
        
        // Initialize htmlJsonData
        $htmlJsonData = [];
        if (isset($validated['html_json'])) {
            $htmlJsonData = json_decode($validated['html_json'], true) ?: [];
            // Ensure it's an array
            if (!is_array($htmlJsonData)) {
                $htmlJsonData = [];
            }
        }
        
        // Handle registration form configuration fields for new seminars
        if ($request->currentStep == 3) {
            // Title field
            if ($request->has('reg_title_enabled')) {
                $htmlJsonData['title'] = [
                    'required' => $request->reg_title_required ? "1" : "0",
                    'titles' => $request->reg_title_options ?? ['Dr.', 'Mr.', 'Miss.', 'Mrs.']
                ];
            } else {
                $htmlJsonData['title'] = [];
            }
            
            // First name field
            if ($request->has('reg_first_name_enabled')) {
                $htmlJsonData['first_name'] = [
                    'required' => $request->reg_first_name_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['first_name'] = [];
            }
            
            // Last name field
            if ($request->has('reg_last_name_enabled')) {
                $htmlJsonData['last_name'] = [
                    'required' => $request->reg_last_name_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['last_name'] = [];
            }
            
            // Email field
            if ($request->has('reg_email_enabled')) {
                $htmlJsonData['email'] = [
                    'required' => $request->reg_email_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['email'] = [];
            }
            
            // Mobile field
            if ($request->has('reg_mobile_enabled')) {
                $htmlJsonData['mobile'] = [
                    'required' => $request->reg_mobile_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['mobile'] = [];
            }
            
            // City field
            if ($request->has('reg_city_enabled')) {
                $htmlJsonData['city'] = [
                    'required' => $request->reg_city_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['city'] = [];
            }
            
            // State field
            if ($request->has('reg_state_enabled')) {
                $htmlJsonData['state'] = [
                    'required' => $request->reg_state_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['state'] = [];
            }
            
            // Specialty field
            if ($request->has('reg_specialty_enabled')) {
                $htmlJsonData['specialty'] = [
                    'required' => $request->reg_specialty_required ? "1" : "0",
                    'specialities' => $request->reg_specialty_options ?? []
                ];
            } else {
                $htmlJsonData['specialty'] = [];
            }
            
            // Medical registration number field
            if ($request->has('reg_medical_reg_enabled')) {
                $htmlJsonData['medical_regisration_no'] = [
                    'required' => $request->reg_medical_reg_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['medical_regisration_no'] = [];
            }
            
            // Medical council field
            if ($request->has('reg_medical_council_enabled')) {
                $htmlJsonData['medical_council'] = [
                    'required' => $request->reg_medical_council_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['medical_council'] = [];
            }
            
            // Profession field
            if ($request->has('reg_profession_enabled')) {
                $htmlJsonData['profession'] = [
                    'required' => $request->reg_profession_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['profession'] = [];
            }
            
            // DRL code field
            if ($request->has('reg_drl_code_enabled')) {
                $htmlJsonData['drl_code'] = [
                    'required' => $request->reg_drl_code_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['drl_code'] = [];
            }
            
            // Country field
            if ($request->has('reg_country_enabled')) {
                $htmlJsonData['country'] = [
                    'required' => $request->reg_country_required ? "1" : "0"
                ];
            } else {
                $htmlJsonData['country'] = [];
            }
            
            // Additional text fields
            $htmlJsonData['left_text'] = [
                'text' => $request->left_text ?? ''
            ];
            
            $htmlJsonData['note_text'] = [
                'text' => $request->note_text ?? ''
            ];
            
            // Theme and registration settings
            $htmlJsonData['theme_color'] = $request->theme_color ?? '#5d9cec';
            $htmlJsonData['allowed_by'] = $request->allowed_by ?? 'email';
            
            // Process participants data to ensure proper structure
            if (isset($request->moderators) && is_array($request->moderators)) {
                $moderatorIds = array_filter($request->moderators, function($id) {
                    return !empty($id);
                });
                if (!empty($moderatorIds)) {
                    $htmlJsonData['moderators'] = [
                        'moderators_list' => $this->getParticipantData($moderatorIds)
                    ];
                }
            }
            
            if (isset($request->panelists) && is_array($request->panelists)) {
                $panelistIds = array_filter($request->panelists, function($id) {
                    return !empty($id);
                });
                if (!empty($panelistIds)) {
                    $htmlJsonData['panelists'] = [
                        'panelists_list' => $this->getParticipantData($panelistIds)
                    ];
                }
            }
            
            if (isset($request->speakers) && is_array($request->speakers)) {
                $speakerIds = array_filter($request->speakers, function($id) {
                    return !empty($id);
                });
                if (!empty($speakerIds)) {
                    $htmlJsonData['speakers'] = [
                        'speakers_list' => $this->getParticipantData($speakerIds)
                    ];
                }
            }
            
            if (isset($request->chief_guests) && is_array($request->chief_guests)) {
                $chiefGuestIds = array_filter($request->chief_guests, function($id) {
                    return !empty($id);
                });
                if (!empty($chiefGuestIds)) {
                    $htmlJsonData['chief_guests'] = [
                        'chief_guests_list' => $this->getParticipantData($chiefGuestIds)
                    ];
                }
            }
            
            // Handle banner image uploads
            // Handle ads banner upload (multiple files)
            if ($request->hasFile('ads_banner')) {
                $adsBannerUrls = [];
                
                // Handle new file uploads
                $adsBannerFiles = $request->file('ads_banner');
                if (!is_array($adsBannerFiles)) {
                    $adsBannerFiles = [$adsBannerFiles];
                }
                
                foreach ($adsBannerFiles as $file) {
                    if ($file && $file->isValid()) {
                        // Generate filename
                        $fileName = time() . '-ads-banner-' . str_replace(' ', '-', $file->getClientOriginalName());
                        $fileExt = strtolower($file->getClientOriginalExtension());
                        
                        // Define destination path
                        $destinationPath = public_path('../../uploads/webcast-banners');
                        
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
                                    
                                    // Add WebP URL to the list
                                    $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $webpFileName;
                                } else {
                                    // If conversion fails, use original file
                                    $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName;
                                }
                            } catch (\Exception $e) {
                                \Log::error('Image conversion failed: ' . $e->getMessage());
                                // If conversion fails, use original file
                                $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName;
                            }
                        } else {
                            // For non-image files, use original file
                            $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName;
                        }
                    }
                }
                
                // Update the ads_banner field in html_json
                $htmlJsonData['ads_banner'] = implode(',', $adsBannerUrls);
            }
            
            // Handle other banner image uploads
            $bannerFields = [
                'invite_banner',
                'responsive_invite_banner',
                'timezone_banner',
                'responsive_timezone_banner',
                'certificate',
                'video_banner',
                'strip_banner'
            ];
            
            foreach ($bannerFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    if ($file && $file->isValid()) {
                        // Generate filename
                        $fileName = time() . '-' . $field . '-' . str_replace(' ', '-', $file->getClientOriginalName());
                        $fileExt = strtolower($file->getClientOriginalExtension());
                        
                        // Define destination path
                        $destinationPath = public_path('../../uploads/webcast-banners');
                        
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
                                    
                                    // Update the field in html_json
                                    $htmlJsonData[$field] = [
                                        'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $webpFileName
                                    ];
                                } else {
                                    // If conversion fails, use original file
                                    $htmlJsonData[$field] = [
                                        'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName
                                    ];
                                }
                            } catch (\Exception $e) {
                                \Log::error('Image conversion failed: ' . $e->getMessage());
                                // If conversion fails, use original file
                                $htmlJsonData[$field] = [
                                    'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName
                                ];
                            }
                        } else {
                            // For non-image files, use original file
                            $htmlJsonData[$field] = [
                                'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName
                            ];
                        }
                    }
                }
            }
        }
        
        // Update html_json with the modified data
        $validated['html_json'] = json_encode($htmlJsonData);

        Seminar::create($validated);

        return redirect()->route('seminars.index')
            ->with('success', 'Seminar created successfully.');
    }

    /**
     * Show the form for editing the specified seminar.
     */
    public function edit(Seminar $seminar)
    {
        // Parse html_json for Step 3 fields
        $htmlJsonData = [];
        if ($seminar->html_json) {
            $htmlJsonData = json_decode($seminar->html_json, true);
            // Ensure it's an array
            if (!is_array($htmlJsonData)) {
                $htmlJsonData = [];
            }
        }

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
                // Step 3 data from html_json
                'reg_title_enabled' => isset($htmlJsonData['title']) && !empty($htmlJsonData['title']),
                'reg_title_required' => isset($htmlJsonData['title']['required']) && $htmlJsonData['title']['required'] === "1",
                'reg_title_options' => isset($htmlJsonData['title']['titles']) ? $htmlJsonData['title']['titles'] : ['Dr.', 'Mr.', 'Miss.', 'Mrs.'],
                'reg_first_name_enabled' => isset($htmlJsonData['first_name']) && !empty($htmlJsonData['first_name']),
                'reg_first_name_required' => isset($htmlJsonData['first_name']['required']) && $htmlJsonData['first_name']['required'] === "1",
                'reg_last_name_enabled' => isset($htmlJsonData['last_name']) && !empty($htmlJsonData['last_name']),
                'reg_last_name_required' => isset($htmlJsonData['last_name']['required']) && $htmlJsonData['last_name']['required'] === "1",
                'reg_email_enabled' => isset($htmlJsonData['email']) && !empty($htmlJsonData['email']),
                'reg_email_required' => isset($htmlJsonData['email']['required']) && $htmlJsonData['email']['required'] === "1",
                'reg_mobile_enabled' => isset($htmlJsonData['mobile']) && !empty($htmlJsonData['mobile']),
                'reg_mobile_required' => isset($htmlJsonData['mobile']['required']) && $htmlJsonData['mobile']['required'] === "1",
                'reg_city_enabled' => isset($htmlJsonData['city']) && !empty($htmlJsonData['city']),
                'reg_city_required' => isset($htmlJsonData['city']['required']) && $htmlJsonData['city']['required'] === "1",
                'reg_state_enabled' => isset($htmlJsonData['state']) && !empty($htmlJsonData['state']),
                'reg_state_required' => isset($htmlJsonData['state']['required']) && $htmlJsonData['state']['required'] === "1",
                'reg_specialty_enabled' => isset($htmlJsonData['specialty']) && !empty($htmlJsonData['specialty']),
                'reg_specialty_required' => isset($htmlJsonData['specialty']['required']) && $htmlJsonData['specialty']['required'] === "1",
                'reg_specialty_options' => isset($htmlJsonData['specialty']['specialities']) ? $htmlJsonData['specialty']['specialities'] : [],
                'reg_medical_reg_enabled' => isset($htmlJsonData['medical_regisration_no']) && !empty($htmlJsonData['medical_regisration_no']),
                'reg_medical_reg_required' => isset($htmlJsonData['medical_regisration_no']['required']) && $htmlJsonData['medical_regisration_no']['required'] === "1",
                'reg_medical_council_enabled' => isset($htmlJsonData['medical_council']) && !empty($htmlJsonData['medical_council']),
                'reg_medical_council_required' => isset($htmlJsonData['medical_council']['required']) && $htmlJsonData['medical_council']['required'] === "1",
                'reg_profession_enabled' => isset($htmlJsonData['profession']) && !empty($htmlJsonData['profession']),
                'reg_profession_required' => isset($htmlJsonData['profession']['required']) && $htmlJsonData['profession']['required'] === "1",
                'reg_drl_code_enabled' => isset($htmlJsonData['drl_code']) && !empty($htmlJsonData['drl_code']),
                'reg_drl_code_required' => isset($htmlJsonData['drl_code']['required']) && $htmlJsonData['drl_code']['required'] === "1",
                'reg_country_enabled' => isset($htmlJsonData['country']) && !empty($htmlJsonData['country']),
                'reg_country_required' => isset($htmlJsonData['country']['required']) && $htmlJsonData['country']['required'] === "1",
                'note_text' => isset($htmlJsonData['note_text']['text']) ? $htmlJsonData['note_text']['text'] : '',
                'left_text' => isset($htmlJsonData['left_text']['text']) ? $htmlJsonData['left_text']['text'] : '',
                'theme_color' => isset($htmlJsonData['theme_color']) ? $htmlJsonData['theme_color'] : '#5d9cec',
                'allowed_by' => isset($htmlJsonData['allowed_by']) ? $htmlJsonData['allowed_by'] : 'email',
                // Process participants data in the required JSON structure format
                'moderators' => $this->processParticipantsData($htmlJsonData, 'moderators'),
                'panelists' => $this->processParticipantsData($htmlJsonData, 'panelists'),
                'speakers' => $this->processParticipantsData($htmlJsonData, 'speakers'),
                'chief_guests' => $this->processParticipantsData($htmlJsonData, 'chief_guests'),
                // Safe access to banner data with proper fallbacks
                'invite_banner' => isset($htmlJsonData['invite_banner']) ? 
                    (is_array($htmlJsonData['invite_banner']) ? 
                        ($htmlJsonData['invite_banner']['url'] ?? '') : 
                        (is_string($htmlJsonData['invite_banner']) ? $htmlJsonData['invite_banner'] : '')) : '',
                'timezone_banner' => isset($htmlJsonData['timezone_banner']) ? 
                    (is_array($htmlJsonData['timezone_banner']) ? 
                        ($htmlJsonData['timezone_banner']['url'] ?? '') : 
                        (is_string($htmlJsonData['timezone_banner']) ? $htmlJsonData['timezone_banner'] : '')) : '',
                'responsive_invite_banner' => isset($htmlJsonData['responsive_invite_banner']) ? 
                    (is_array($htmlJsonData['responsive_invite_banner']) ? 
                        ($htmlJsonData['responsive_invite_banner']['url'] ?? '') : 
                        (is_string($htmlJsonData['responsive_invite_banner']) ? $htmlJsonData['responsive_invite_banner'] : '')) : '',
                'responsive_timezone_banner' => isset($htmlJsonData['responsive_timezone_banner']) ? 
                    (is_array($htmlJsonData['responsive_timezone_banner']) ? 
                        ($htmlJsonData['responsive_timezone_banner']['url'] ?? '') : 
                        (is_string($htmlJsonData['responsive_timezone_banner']) ? $htmlJsonData['responsive_timezone_banner'] : '')) : '',
                'certificate' => isset($htmlJsonData['certificate']) ? 
                    (is_array($htmlJsonData['certificate']) ? 
                        ($htmlJsonData['certificate']['url'] ?? '') : 
                        (is_string($htmlJsonData['certificate']) ? $htmlJsonData['certificate'] : '')) : '',
                'video_banner' => isset($htmlJsonData['video_banner']) ? 
                    (is_array($htmlJsonData['video_banner']) ? 
                        ($htmlJsonData['video_banner']['url'] ?? '') : 
                        (is_string($htmlJsonData['video_banner']) ? $htmlJsonData['video_banner'] : '')) : '',
                'strip_banner' => isset($htmlJsonData['strip_banner']) ? 
                    (is_array($htmlJsonData['strip_banner']) ? 
                        ($htmlJsonData['strip_banner']['url'] ?? '') : 
                        (is_string($htmlJsonData['strip_banner']) ? $htmlJsonData['strip_banner'] : '')) : '', 
                'ads_banner' => isset($htmlJsonData['ads_banner']) ? $htmlJsonData['ads_banner'] : '', 

            ],
            'sponsorPages' => $this->getSponsorPages(),
            'specialities' => $this->getSpecialities(),
            'educationPartners' => $this->getEducationPartners(),
        ]);
    }

    /**
     * Process participants data in the required JSON structure format
     */
    private function processParticipantsData($htmlJsonData, $participantType)
    {
        // Check if the participant data exists in the expected structure
        if (isset($htmlJsonData[$participantType]) && is_array($htmlJsonData[$participantType])) {
            // If it's in the new structure with a list key, return that
            if (isset($htmlJsonData[$participantType][$participantType . '_list']) && 
                is_array($htmlJsonData[$participantType][$participantType . '_list'])) {
                return array_map(function($participant) {
                    // Return just the user_id for the form
                    return $participant['user_id'] ?? '';
                }, $htmlJsonData[$participantType][$participantType . '_list']);
            }
            // If it's an array directly, return it
            elseif (is_array($htmlJsonData[$participantType])) {
                return array_map(function($participant) {
                    // Return just the user_id for the form
                    return is_array($participant) ? ($participant['user_id'] ?? '') : $participant;
                }, $htmlJsonData[$participantType]);
            }
        }
        
        // Return empty array as default
        return [];
    }

    /**
     * Convert participants data to the required JSON structure format for saving
     */
    private function convertParticipantsToStructure($participants)
    {
        if (!is_array($participants)) {
            return [];
        }
        
        // If already in the correct structure, return as is
        if (isset($participants[0]) && is_array($participants[0]) && 
            isset($participants[0]['user_id']) && isset($participants[0]['user_name'])) {
            return $participants;
        }
        
        // If it's just an array of IDs, convert to the required structure
        return array_map(function($participant) {
            if (is_string($participant) || is_numeric($participant)) {
                return [
                    'user_id' => (string)$participant,
                    'user_name' => 'Speaker ' . $participant,
                    'user_img' => '',
                    'elevatorPitch' => ''
                ];
            } elseif (is_array($participant)) {
                return [
                    'user_id' => $participant['user_id'] ?? '',
                    'user_name' => $participant['user_name'] ?? 'Unknown Speaker',
                    'user_img' => $participant['user_img'] ?? '',
                    'elevatorPitch' => $participant['elevatorPitch'] ?? ''
                ];
            }
            return [
                'user_id' => '',
                'user_name' => 'Unknown Speaker',
                'user_img' => '',
                'elevatorPitch' => ''
            ];
        }, $participants);
    }

    /**
     * Get participant data from FrontendUser model
     */
    private function getParticipantData($userIds)
    {
        if (empty($userIds)) {
            return [];
        }
        
        // Convert to array if it's a string
        if (!is_array($userIds)) {
            $userIds = explode(',', $userIds);
        }
        
        // Get participant data from FrontendUser model
        $participants = FrontendUser::whereIn('user_id', $userIds)
            ->select('user_id', 'user_FullName', 'title', 'user_img', 'elivatorPitch')
            ->get()
            ->map(function ($user) {
                return [
                    'user_id' => $user->user_id,
                    'user_name' => trim($user->title . ' ' . $user->user_FullName),
                    'user_img' => $user->user_img ? 'https://www.medtalks.in/user_pic_150/' . $user->user_img : '',
                    'elevatorPitch' => $user->elivatorPitch ?? ''
                ];
            })
            ->toArray();
            
        return $participants;
    }

    /**
     * Update the specified seminar in storage.
     */
    public function updateSeminar(Request $request)
    {
        \Log::info("Updating seminar with ID: " . $request->currentStep);
        
        // Prepare validation rules
        $rules = [
            'seminar_title' => 'required|string|max:250',
            'custom_url' => 'required|string|max:256|unique:seminar,custom_url,' . $request->seminar_id . ',seminar_no',
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
            'html_json' => 'nullable|string',
            // Conditional image validation - only required if a new file is being uploaded
            'image' => $request->hasFile('image') ? 'required|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=700,height=393' : 'nullable',
            's_image1' => $request->hasFile('s_image1') ? 'required|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=640,height=360' : 'nullable',
            's_image2' => $request->hasFile('s_image2') ? 'required|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=400,height=400' : 'nullable',
            'ads_banner' => 'nullable|array',
            'ads_banner.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            // Participants
            'moderators' => 'nullable|array',
            'panelists' => 'nullable|array',
            'speakers' => 'nullable|array',
            'chief_guests' => 'nullable|array',
        ];

        // Custom validation messages
        $messages = [
            'image.dimensions' => 'Featured image dimensions must be exactly 700 x 393 pixels.',
            's_image1.dimensions' => 'App banner dimensions must be exactly 640 x 360 pixels.',
            's_image2.dimensions' => 'App square image dimensions must be exactly 400 x 400 pixels.',
            'image.max' => 'Image size must be less than 1MB.',
        ];

        $validated = $request->validate($rules, $messages);

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

        // Get the seminar being updated
        $seminar = Seminar::find($request->seminar_id);
        
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
        
        // Initialize htmlJsonData from the request html_json field
        $htmlJsonData = [];
        // if (isset($validated['html_json'])) {
        //     $htmlJsonData = json_decode($validated['html_json'], true) ?: [];
        //     // Ensure it's an array
        //     if (!is_array($htmlJsonData)) {
        //         $htmlJsonData = [];
        //     }
        // } else {
        //     // If no html_json in request, use existing data from the seminar
        //     if ($seminar->html_json) {
        //         $htmlJsonData = json_decode($seminar->html_json, true) ?: [];
        //         // Ensure it's an array
        //         if (!is_array($htmlJsonData)) {
        //             $htmlJsonData = [];
        //         }
        //     }
        // }
        
        // Handle registration form configuration fields
        if ($request->currentStep == 3) {
            \Log::info('First name: ' . $request->reg_first_name_enabled);
            // Title field
            if ($request->reg_title_enabled) {
                $htmlJsonData['title'] = [
                    'required' => $request->reg_title_required ? "1" : "0",
                    'titles' => $request->reg_title_options ?? ['Dr.', 'Mr.', 'Miss.', 'Mrs.']
                ];
            } 
            
            // First name field
            if ($request->reg_first_name_enabled) {
                $htmlJsonData['first_name'] = [
                    'required' => $request->reg_first_name_required ? "1" : "0"
                ];
            }
            
            // Last name field
            if ($request->reg_last_name_enabled) {
                $htmlJsonData['last_name'] = [
                    'required' => $request->reg_last_name_required ? "1" : "0"
                ];
            } 
            
            // Email field
            if ($request->reg_email_enabled) {
                $htmlJsonData['email'] = [
                    'required' => $request->reg_email_required ? "1" : "0"
                ];
            } 
            
            // Mobile field
            if ($request->reg_mobile_enabled) {
                $htmlJsonData['mobile'] = [
                    'required' => $request->reg_mobile_required ? "1" : "0"
                ];
            }            // City field
            if ($request->reg_city_enabled) {
                $htmlJsonData['city'] = [
                    'required' => $request->reg_city_required ? "1" : "0"
                ];
            } 
            
            // State field
            if ($request->reg_state_enabled) {
                $htmlJsonData['state'] = [
                    'required' => $request->reg_state_required ? "1" : "0"
                ];
            } 
            
            // Specialty field
            if ($request->reg_specialty_enabled) {
                $htmlJsonData['specialty'] = [
                    'required' => $request->reg_specialty_required ? "1" : "0",
                    'specialities' => $request->reg_specialty_options ?? []
                ];
            } 
            
            // Medical registration number field
            if ($request->reg_medical_reg_enabled) {
                $htmlJsonData['medical_regisration_no'] = [
                    'required' => $request->reg_medical_reg_required ? "1" : "0"
                ];
            }
            
            // Medical council field
            if ($request->reg_medical_council_enabled) {
                $htmlJsonData['medical_council'] = [
                    'required' => $request->reg_medical_council_required ? "1" : "0"
                ];
            } 
            
            // Profession field
            if ($request->reg_profession_enabled) {
                $htmlJsonData['profession'] = [
                    'required' => $request->reg_profession_required ? "1" : "0"
                ];
            }
            
            // DRL code field
            if ($request->reg_drl_code_enabled) {
                $htmlJsonData['drl_code'] = [
                    'required' => $request->reg_drl_code_required ? "1" : "0"
                ];
            } 
            
            // Country field
            if ($request->reg_country_enabled) {
                $htmlJsonData['country'] = [
                    'required' => $request->reg_country_required ? "1" : "0"
                ];
            } 
            
            // Additional text fields
            $htmlJsonData['left_text'] = [
                'text' => $request->left_text ?? ''
            ];
            
            $htmlJsonData['note_text'] = [
                'text' => $request->note_text ?? ''
            ];
            
            // Theme and registration settings
            $htmlJsonData['theme_color'] = $request->theme_color ?? '#5d9cec';
            $htmlJsonData['allowed_by'] = $request->allowed_by ?? 'email';
        }
        
        // Handle banner image uploads
        if ($request->currentStep == 3) {
            // Handle ads banner upload (multiple files)
            if ($request->hasFile('ads_banner')) {
                $adsBannerUrls = [];
                
                // Handle existing ads_banner URLs from the database
                $existingAdsBanner = isset($htmlJsonData['ads_banner']) ? $htmlJsonData['ads_banner'] : '';
                if (!empty($existingAdsBanner)) {
                    $adsBannerUrls = explode(',', $existingAdsBanner);
                }
                
                // Handle new file uploads
                $adsBannerFiles = $request->file('ads_banner');
                if (!is_array($adsBannerFiles)) {
                    $adsBannerFiles = [$adsBannerFiles];
                }
                
                foreach ($adsBannerFiles as $file) {
                    if ($file && $file->isValid()) {
                        // Generate filename
                        $fileName = time() . '-ads-banner-' . str_replace(' ', '-', $file->getClientOriginalName());
                        $fileExt = strtolower($file->getClientOriginalExtension());
                        
                        // Define destination path
                        $destinationPath = public_path('../../uploads/webcast-banners');
                        
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
                                    
                                    // Add WebP URL to the list
                                    $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $webpFileName;
                                } else {
                                    // If conversion fails, use original file
                                    $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName;
                                }
                            } catch (\Exception $e) {
                                \Log::error('Image conversion failed: ' . $e->getMessage());
                                // If conversion fails, use original file
                                $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName;
                            }
                        } else {
                            // For non-image files, use original file
                            $adsBannerUrls[] = 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName;
                        }
                    }
                }
                
                // Update the ads_banner field in html_json
                $htmlJsonData['ads_banner'] = implode(',', $adsBannerUrls);
            }
            
            // Handle other banner image uploads
            $bannerFields = [
                'invite_banner',
                'responsive_invite_banner',
                'timezone_banner',
                'responsive_timezone_banner',
                'certificate',
                'video_banner',
                'strip_banner'
            ];
            
            foreach ($bannerFields as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    if ($file && $file->isValid()) {
                        // Generate filename
                        $fileName = time() . '-' . $field . '-' . str_replace(' ', '-', $file->getClientOriginalName());
                        $fileExt = strtolower($file->getClientOriginalExtension());
                        
                        // Define destination path
                        $destinationPath = public_path('/uploads/webcast-banners');
                        
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
                                    
                                    // Update the field in html_json
                                    $htmlJsonData[$field] = [
                                        'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $webpFileName
                                    ];
                                } else {
                                    // If conversion fails, use original file
                                    $htmlJsonData[$field] = [
                                        'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName
                                    ];
                                }
                            } catch (\Exception $e) {
                                \Log::error('Image conversion failed: ' . $e->getMessage());
                                // If conversion fails, use original file
                                $htmlJsonData[$field] = [
                                    'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName
                                ];
                            }
                        } else {
                            // For non-image files, use original file
                            $htmlJsonData[$field] = [
                                'url' => 'https://www.medtalks.in/uploads/webcast-banners/' . $fileName
                            ];
                        }
                    }
                }
            }
        } 
        
        // Process participants data to ensure proper structure
        if ($request->currentStep == 3) {
            if (isset($request->moderators) && is_array($request->moderators)) {
                $moderatorIds = array_filter($request->moderators, function($id) {
                    return !empty($id);
                });
                if (!empty($moderatorIds)) {
                    $htmlJsonData['moderators'] = [
                        'moderators_list' => $this->getParticipantData($moderatorIds)
                    ];
                }
            }
            
            if (isset($request->panelists) && is_array($request->panelists)) {
                $panelistIds = array_filter($request->panelists, function($id) {
                    return !empty($id);
                });
                if (!empty($panelistIds)) {
                    $htmlJsonData['panelists'] = [
                        'panelists_list' => $this->getParticipantData($panelistIds)
                    ];
                }
            }
            
            if (isset($request->speakers) && is_array($request->speakers)) {
                $speakerIds = array_filter($request->speakers, function($id) {
                    return !empty($id);
                });
                if (!empty($speakerIds)) {
                    $htmlJsonData['speakers'] = [
                        'speakers_list' => $this->getParticipantData($speakerIds)
                    ];
                }
            }
            
            if (isset($request->chief_guests) && is_array($request->chief_guests)) {
                $chiefGuestIds = array_filter($request->chief_guests, function($id) {
                    return !empty($id);
                });
                if (!empty($chiefGuestIds)) {
                    $htmlJsonData['chief_guests'] = [
                        'chief_guests_list' => $this->getParticipantData($chiefGuestIds)
                    ];
                }
            }
        }
        
        \Log::info('Updating seminar data: ' . json_encode($htmlJsonData));
        // Update html_json with the modified data
        $validated['html_json'] = json_encode($htmlJsonData);
        
        // Use the seminar instance from route model binding directly
        $seminar->update($validated);
        \Log::info('jsdkfa');
        if($request->currentStep<3)
        {
            return back()->with('success', 'Seminar updated successfully.');
        }
        else{
            return redirect()->route('seminars.index')
            ->with('success', 'Seminar created successfully.');
        }
        

       
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
        $fileName = time() . '-' . $prefix . '-' . str_replace(' ', '-', $file->getClientOriginalName());
        $fileExt = strtolower($file->getClientOriginalExtension());
        
        // Define destination path based on prefix
        $destinationPath = public_path('../../uploads/seminar/orginal');
        
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
                    return $webpFileName;
                } else {
                    // If conversion fails, use original file
                    return $fileName;
                }
            } catch (\Exception $e) {
                \Log::error('Image conversion failed: ' . $e->getMessage());
                // If conversion fails, use original file
                return $fileName;
            }
        } else {
            // For non-image files, use original file
            return $fileName;
        }
    }

    /**
     * Get sponsor pages for dropdown
     */
    private function getSponsorPages()
    {
        return SponsorPage::seminar()
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
    }

    /**
     * Get specialities for dropdown
     */
    private function getSpecialities()
    {
        return Specialty::where('status', 'on')
            ->select('no as value', 'title as label')
            ->orderBy('title')
            ->get()
            ->toArray();
    }

    /**
     * Get education partners for dropdown
     */
    private function getEducationPartners()
    {
        return EducationPartner::where('is_active', 1)
            ->select('id as value', 'name as label')
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    /**
     * Get speakers for dropdown
     */
    public function getSpeakers()
    {
        // Fetch speakers from frontend_users table where userType='instructor'
        $speakers = FrontendUser::where('userType', 'instructor')
            ->where('userStatus', 'active')
            ->select(
                'user_id as value',
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