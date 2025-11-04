<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\{MarketingCampaign, BusinessPage, Course, Seminar, Specialty, Post};


class MarketingCampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get filter parameters from request
        $search = request('search');
        $campaignType = request('campaignType');
        $campaignStatus = request('campaignStatus');

        // Build query with filters
        $query = MarketingCampaign::with('business')
        
            ->orderBy('campaignID', 'desc');

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('campaignTitle', 'like', '%' . $search . '%')
                  ->orWhere('campaignType', 'like', '%' . $search . '%');
            });
        }

        // Apply campaign type filter
        if ($campaignType) {
            $query->where('campaignType', $campaignType);
        }

        // Apply campaign status filter
        if ($campaignStatus) {
            $query->where('campaignStatus', $campaignStatus);
        }

        $campaigns = $query->paginate(10);

        // Fetch target titles for all campaigns in this page
        $this->addTargetTitlesToCampaigns($campaigns);

        // Prepare filters array for frontend
        $filters = [
            'search' => $search,
            'campaignType' => $campaignType,
            'campaignStatus' => $campaignStatus,
        ];

        return Inertia::render('MarketingCampaign/Index', [
            'campaigns' => $campaigns,
            'filters' => $filters
        ]);
    }

    /**
     * Add target titles to campaigns based on their type and target ID
     */
    private function addTargetTitlesToCampaigns($campaigns)
    {
        // Group campaigns by type for efficient querying
        $campaignsByType = [];
        foreach ($campaigns as $campaign) {
            $campaignsByType[$campaign->campaignType][] = $campaign;
        }

        // Process each campaign type
        foreach ($campaignsByType as $type => $typeCampaigns) {
            $targetIds = array_map(function ($campaign) {
                return $campaign->campaignTargetID;
            }, $typeCampaigns);

            $targetTitles = [];

            switch ($type) {
                case 'sponserSeminar':
                    // Fetch seminar titles
                    $seminars = Seminar::whereIn('seminar_no', $targetIds)
                        ->pluck('seminar_title', 'seminar_no');
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = $seminars->get($campaign->campaignTargetID, 'Unknown Seminar');
                    }
                    break;

                case 'specialitySponsor':
                    // Fetch specialty titles
                    $specialties = Specialty::whereIn('no', $targetIds)
                        ->pluck('title', 'no');
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = $specialties->get($campaign->campaignTargetID, 'Unknown Specialty');
                    }
                    break;

                case 'sponseredCME':
                    // Fetch course titles
                    $courses = Course::whereIn('course_id', $targetIds)
                        ->pluck('course_title', 'course_id');
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = $courses->get($campaign->campaignTargetID, 'Unknown Course');
                    }
                    break;

                case 'sponsoredFaq':
                    // Fetch FAQ titles
                    $faqs = Post::whereIn('articleID', $targetIds)
                        ->whereIn('articleID', $targetIds)
                        ->pluck('title', 'articleID');
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = $faqs->get($campaign->campaignTargetID, 'Unknown FAQ');
                    }
                    break;

                case 'sponsoredEpisode':
                    // Fetch episode titles
                    $episodes = MedtalksTv::whereIn('id', $targetIds)
                        ->pluck('title', 'id');
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = $episodes->get($campaign->campaignTargetID, 'Unknown Episode');
                    }
                    break;

                case 'sponsorMedtalks':
                    // Fetch medtalks titles (similar to episodes)
                    $medtalks = MedtalksTv::whereIn('id', $targetIds)
                        ->whereIn('id', $targetIds)
                        ->pluck('title', 'id');
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = $medtalks->get($campaign->campaignTargetID, 'Unknown Medtalk');
                    }
                    break;

                default:
                    // For other types, set a default value
                    foreach ($typeCampaigns as $campaign) {
                        $campaign->targetTitle = 'N/A';
                    }
                    break;
            }
        }
    }

    /**
     * Show the form for creating a new marketing campaign.
     */
    public function create()
    {
        $businesses = BusinessPage::select('businessID', 'business_Name')
            ->orderBy('business_Name')
            ->get();

        // Get courses for sponsored CME
        $courses = Course::whereIn('status', ['new', 'live', 'draft'])
            ->orderBy('course_id', 'desc')
            ->get(['course_id', 'course_title'])
            ->toArray();

        // Get seminars for sponsor seminar
        $seminars = Seminar::where('video_status', '!=', 'deleted')
            ->orderBy('schedule_timestamp', 'DESC')
            ->get(['seminar_no', 'seminar_title'])
            ->toArray();

        // Get specialities for speciality sponsor
        $specialities = Specialty::orderBy('title', 'ASC')
            ->where('status', 'on')
            ->get(['no', 'title'])
            ->toArray();

        // Get FAQs for sponsored FAQ
        $faqs = Post::whereIn('articleID', $targetIds)
            ->where('status', 'published')
            ->where('postType', 'FAQ')
            ->whereNotNull('custom_url')
            ->orderBy('articleID', 'DESC')
            ->get(['articleID', 'title'])
            ->toArray();

        // Get episodes for sponsored episode
        $episodes = MedtalksTv::where('video_status', '!=', 'deleted')
            ->where('video_status', '!=', 'deleted')
            ->where('episode_status', 'active')
            ->whereIn('episode_type', ['evening', 'diabetes-prime', '4d'])
            ->orderBy('id', 'desc')
            ->get(['id', 'title'])
            ->toArray();

        return Inertia::render('MarketingCampaign/Form', [
            'businesses' => $businesses,
            'business' => null,
            'campaign' => null,
            'courses' => $courses,
            'seminars' => $seminars,
            'specialities' => $specialities,
            'faqs' => $faqs,
            'episodes' => $episodes
        ]);
    }

    /**
     * Store a newly created marketing campaign in storage.
     */
    public function store(Request $request)
    {
        $businessID = $request->get('businessID');
        
        if (empty($businessID)) {
            // If businessID wasn't in the GET params, check if it's in the POST data
            $businessID = $request->input('businessID');
            
            if (empty($businessID)) {
                return redirect()->back()->with('error', 'No Business ID Found');
            }
        }

        $validated = $request->validate([
            'businessID' => 'required|integer',
            'campaigntitle' => 'required|string|max:256',
            'campaign_type' => 'required|in:sponseredCME,sponserSeminar,specialitySponsor,sponsorMedtalks,sponsoredFaq,sponsoredEpisode,none',
            'campaignTargetID' => 'required|string|max:10',
            'campaignmission' => 'required|in:clicks,impressions,subscriptions,followers,interactions,accessCode',
            'promotionTimeSettings' => 'nullable|in:none,limtied',
            'campaignStartTime' => 'nullable|date',
            'campaignEndTime' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'image1' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048'
        ]);

        // Process images
        $imageNames = [];
        $imageFields = ['image', 'image1'];
        $dbFields = [
            'image', 'image1', 'image3', 'image4', 'image5'
        ];
        $columnNames = [
            'marketingBannerSquare', 
            'marketingBannerRectangle'
        ];
        
        foreach ($imageFields as $index => $field) {
            if ($request->hasFile($field)) {
                $image = $request->file($field);
                $filename = time() . '_' . $index . '_' . Str::slug($image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
                
                // Create directory if it doesn't exist
                $destinationPath = public_path('uploads/marketing-campaign');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                
                $image->move($destinationPath, $filename);
                $imageNames[$columnNames[$index]] = $filename;
            } else {
                // Keep existing image names if no new image is uploaded
                $imageNames[$columnNames[$index]] = $request->get($dbFields[$index] . 'name', '');
            }
        }

        // Create campaign in database
        $campaign = MarketingCampaign::create([
            'businessID' => $validated['businessID'],
            'campaignTitle' => $validated['campaigntitle'],
            'campaignType' => $validated['campaign_type'],
            'campaignTargetID' => $validated['campaignTargetID'],
            'campaignMission' => $validated['campaignmission'],
            'promotionTimeSettings' => $validated['promotionTimeSettings'] ?? 'none',
            'campaignStartTime' => $validated['campaignStartTime'] ?? now(),
            'campaignEndTime' => $validated['campaignEndTime'] ?? '0000-00-00 00:00:00',
            'marketingBannerSquare' => $imageNames['marketingBannerSquare'] ?? '',
            'marketingBannerRectangle' => $imageNames['marketingBannerRectangle'] ?? '',
            'marketingBanner1' => '',
            'marketingBanner2' => '',
            'marketingBanner3' => '',
            'created_by' => auth()->user()->username ?? auth()->user()->display_name,
            'created_ip' => $request->ip(),
        ]);

        return redirect()->route('marketing-campaign.index')->with('success', 'Marketing campaign created successfully!');
    }

   

    /**
     * Show the form for editing the specified marketing campaign.
     */
    public function edit(MarketingCampaign $marketing_campaign)
    {
        $marketing_campaign->business_Name = $business = BusinessPage::select('businessID', 'business_Name')
            ->where('businessID', $marketing_campaign->businessID)
            ->value('business_Name');
         $business = BusinessPage::select('businessID', 'business_Name')
            ->get();

        if (!$business) {
            return redirect()->back()->with('error', 'Business not found');
        }

        // Get courses for sponsored CME
        $courses = Course::whereIn('status', ['new', 'live', 'draft'])
            ->orderBy('course_id', 'desc')
            ->get(['course_id', 'course_title'])
            ->toArray();

        // Get seminars for sponsor seminar
        $seminars = Seminar::where('video_status', '!=', 'deleted')
            ->where('video_status', '!=', 'deleted')
            ->orderBy('schedule_timestamp', 'DESC')
            ->get(['seminar_no', 'seminar_title'])
            ->toArray();

        // Get specialities for speciality sponsor
        $specialities = Specialty::orderBy('title', 'ASC')
            ->get(['no', 'title'])
            ->toArray();

        // Get FAQs for sponsored FAQ
        $faqs = Post::where('status', 'published')
            ->where('status', 'published')
            ->where('postType', 'FAQ')
            ->whereNotNull('custom_url')
            ->orderBy('articleID', 'DESC')
            ->get(['articleID', 'title'])
            ->toArray();

        // Get episodes for sponsored episode
        $episodes = MedtalksTv::where('video_status', '!=', 'deleted')
            ->where('video_status', '!=', 'deleted')
            ->where('episode_status', 'active')
            ->whereIn('episode_type', ['evening', 'diabetes-prime', '4d'])
            ->orderBy('id', 'desc')
            ->get(['id', 'title'])
            ->toArray();

        return Inertia::render('MarketingCampaign/Form', [
            'businesses' => $business,
            'business' => $business,
            'campaign' => $marketing_campaign,
            'courses' => $courses,
            'seminars' => $seminars,
            'specialities' => $specialities,
            'faqs' => $faqs,
            'episodes' => $episodes
        ]);
    }

    /**
     * Update the specified marketing campaign in storage.
     */
    public function updateMarketingCampaign(Request $request, MarketingCampaign $marketing_campaign)
    {
        $validated = $request->validate([
            'businessID' => 'required|integer',
            'campaigntitle' => 'required|string|max:256',
            'campaign_type' => 'required|in:sponseredCME,sponserSeminar,specialitySponsor,sponsorMedtalks,sponsoredFaq,sponsoredEpisode,none',
            'campaignTargetID' => 'required|string|max:10',
            'campaignmission' => 'required|in:clicks,impressions,subscriptions,followers,interactions,accessCode',
            'promotionTimeSettings' => 'nullable|in:none,limtied',
            'campaignStartTime' => 'nullable|date',
            'campaignEndTime' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:1024',
            'image1' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:1024'
        ]);
        $marketing_campaign = MarketingCampaign::find($request->id);
        if (!$marketing_campaign) {
            return redirect()->back()->with('error', 'Marketing campaign not found');
        }

        // Process images
        $imageNames = [];
        $imageFields = ['image', 'image1'];
        $dbFields = [
            'image', 'image1', 'image3', 'image4', 'image5'
        ];
        $columnNames = [
            'marketingBannerSquare', 
            'marketingBannerRectangle'
        ];
        
        foreach ($imageFields as $index => $field) {
            if ($request->hasFile($field)) {
                // Delete old image if exists
                $oldImageName = $marketing_campaign->{$columnNames[$index]};
                if ($oldImageName) {
                    $oldImagePath = public_path('uploads/marketing-campaign/' . $oldImageName);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                
                $image = $request->file($field);
                $filename = time() . '_' . $index . '_' . Str::slug($image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
                
                // Create directory if it doesn't exist
                $destinationPath = public_path('uploads/marketing-campaign');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                
                $image->move($destinationPath, $filename);
                $imageNames[$columnNames[$index]] = $filename;
            } else {
                // Keep existing image names if no new image is uploaded
                $imageNames[$columnNames[$index]] = $request->get($dbFields[$index] . 'name', $marketing_campaign->{$columnNames[$index]});
            }
        }

        \Log::info('Marketing Campaign Updated:', [
            'marketing_campaign_id' => $marketing_campaign,
            'image'=>$imageNames['marketingBannerSquare'],
            'user_id' => auth()->user()->id,
            'user_ip' => $request->ip(),
        ]);
        // Update campaign in database
        $marketing_campaign->update([
            'businessID' => $validated['businessID'],
            'campaignTitle' => $validated['campaigntitle'],
            'campaignType' => $validated['campaign_type'],
            'campaignTargetID' => $validated['campaignTargetID'],
            'campaignMission' => $validated['campaignmission'],
            'promotionTimeSettings' => $validated['promotionTimeSettings'] ?? 'none',
            'campaignStartTime' => $validated['campaignStartTime'] ?? $marketing_campaign->campaignStartTime,
            'campaignEndTime' => $validated['campaignEndTime'] ?? $marketing_campaign->campaignEndTime,
            'marketingBannerSquare' => $imageNames['marketingBannerSquare'],
            'marketingBannerRectangle' => $imageNames['marketingBannerRectangle'],
            'marketingBanner1' => '',
            'marketingBanner2' => '',
            'marketingBanner3' => '',
            'modified_by' => auth()->user()->username ?? auth()->user()->display_name,
            'modified_ip' => $request->ip(),
        ]);

        return redirect()->route('marketing-campaign.index')->with('success', 'Marketing campaign updated successfully!');
    }

    /**
     * Remove the specified marketing campaign from storage.
     */
    public function destroy(MarketingCampaign $marketing_campaign)
    {
        // Delete images
        $imageFields = [
            'marketingBannerSquare', 
            'marketingBannerRectangle', 
            'marketingBanner1', 
            'marketingBanner2', 
            'marketingBanner3'
        ];
        
        foreach ($imageFields as $field) {
            if ($marketing_campaign->$field) {
                $imagePath = public_path('uploads/marketing-campaign/' . $marketing_campaign->$field);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
        }

        // Delete campaign from database
        $marketing_campaign->delete();

        return redirect()->route('marketing-campaign.index')->with('success', 'Marketing campaign deleted successfully!');
    }

    /**
     * Get campaign targets based on campaign type.
     */
    public function getCampaignTargets(Request $request)
    {
        \Log::info('Getting campaign targets:', [
            'user_id' => auth()->user()->id,
            'user_ip' => $request->ip(),
            'campaign_type' => $request->get('campaign_type')
        ]);
        $campaignType = $request->get('campaign_type');
        
        switch ($campaignType) {
            case 'cme':
                // Fetch records from zc_course table where status is 'new' or 'live'
                $targets = Course::whereIn('status', ['new', 'live'])
                    ->orderBy('course_id', 'desc')
                    ->get(['course_id as id', 'course_title as title'])
                    ->toArray();
                break;
                
            case 'seminar':
                // Fetch records from seminar table where video_status is not 'deleted'
                $targets = Seminar::where('video_status', '!=', 'deleted')
                    ->where('video_status', '!=', 'deleted')
                    ->orderBy('schedule_timestamp', 'DESC')
                    ->get(['seminar_no as id', 'seminar_title as title'])
                    ->toArray();
                break;         
                
            case 'speciality':
                // Fetch records from specialty table
                $targets = Specialty::where(['status' => 'on'])
                    ->orderBy('title', 'asc')
                    ->select('no as id', 'title')->get()
                    ->toArray();
                break;
            case 'episode':
                // Fetch records from medtalks_tv table
                $targets = MedtalksTv::select('id as id', 'title as title')
                ->where('video_status', '!=', 'deleted')
                ->orderBy('id', 'DESC')->get()
                    ->toArray();
                break;
            case 'faq':
                // Fetch records from faqs table
                $targets = Post::select('articleID as id', 'title as title')
                    ->where('status', '=', 'published')
                    ->orderBy('articleID', 'desc')->get()
                    ->toArray();
                break;
            default:
                $targets = [];
                break;
        }
        
        return response()->json($targets);
    }
}