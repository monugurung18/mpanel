<?php

namespace App\Http\Controllers;

use App\Models\MarketingCampaign;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarketingCampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $campaigns = MarketingCampaign::with('business')
            ->orderBy('created_on', 'desc')
            ->get();

        return Inertia::render('MarketingCampaign/Index', [
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Show the form for creating a new marketing campaign.
     */
    public function create(Request $request)
    {
        $businessID = $request->get('businessID');
        
        if (empty($businessID)) {
            return redirect()->back()->with('error', 'No Business ID Found');
        }

        // Get business information
        $business = DB::table('business_pages')->where('businessID', $businessID)->first();
        
        if (!$business) {
            return redirect()->back()->with('error', 'Business not found');
        }

        // Get courses for sponsored CME
        $courses = DB::table('zc_course')
            ->whereIn('status', ['new', 'live', 'draft'])
            ->orderBy('course_id', 'desc')
            ->get(['course_id', 'course_title'])
            ->toArray();

        // Get seminars for sponsor seminar
        $seminars = DB::table('seminar')
            ->where('video_status', '!=', 'deleted')
            ->orderBy('schedule_timestamp', 'DESC')
            ->get(['seminar_no', 'seminar_title'])
            ->toArray();

        // Get specialities for speciality sponsor
        $specialities = DB::table('user_specialty')
            ->orderBy('title', 'ASC')
            ->get(['no', 'title'])
            ->toArray();

        // Get FAQs for sponsored FAQ
        $faqs = DB::table('post')
            ->where('status', 'published')
            ->where('postType', 'FAQ')
            ->whereNotNull('custom_url')
            ->orderBy('articleID', 'DESC')
            ->get(['articleID', 'title'])
            ->toArray();

        // Get episodes for sponsored episode
        $episodes = DB::table('medtalks_tv')
            ->where('video_status', '!=', 'deleted')
            ->where('episode_status', 'active')
            ->whereIn('episode_type', ['evening', 'diabetes-prime', '4d'])
            ->orderBy('id', 'desc')
            ->get(['id', 'title'])
            ->toArray();

        return Inertia::render('MarketingCampaign/Form', [
            'business' => $business,
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
            return redirect()->back()->with('error', 'No Business ID Found');
        }

        $validated = $request->validate([
            'businessID' => 'required|integer',
            'campaigntitle' => 'required|string|max:256',
            'campaign_type' => 'required|in:sponseredCME,sponserSeminar,specialitySponsor,sponsorMedtalks,sponsoredFaq,sponsoredEpisode,none',
            'campaignTargetID' => 'required|string|max:10',
            'campaignmission' => 'required|in:clicks,impressions,subscriptions,followers,interactions,accessCode',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image1' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image3' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image4' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image5' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        // Process images
        $imageNames = [];
        $imageFields = ['image', 'image1', 'image3', 'image4', 'image5'];
        $dbFields = [
            'image', 'image1', 'image3', 'image4', 'image5'
        ];
        $columnNames = [
            'marketingBannerSquare', 
            'marketingBannerRectangle', 
            'marketingBanner1', 
            'marketingBanner2', 
            'marketingBanner3'
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
            'marketingBannerSquare' => $imageNames['marketingBannerSquare'] ?? '',
            'marketingBannerRectangle' => $imageNames['marketingBannerRectangle'] ?? '',
            'marketingBanner1' => $imageNames['marketingBanner1'] ?? '',
            'marketingBanner2' => $imageNames['marketingBanner2'] ?? '',
            'marketingBanner3' => $imageNames['marketingBanner3'] ?? '',
            'created_by' => auth()->user()->username ?? auth()->user()->display_name,
            'created_ip' => $request->ip(),
        ]);

        return redirect()->route('marketing-campaign.index')->with('success', 'Marketing campaign created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(MarketingCampaign $marketing_campaign)
    {
        return Inertia::render('MarketingCampaign/Show', [
            'campaign' => $marketing_campaign,
        ]);
    }

    /**
     * Show the form for editing the specified marketing campaign.
     */
    public function edit(MarketingCampaign $marketing_campaign)
    {
        $business = DB::table('business_pages')->where('businessID', $marketing_campaign->businessID)->first();
        
        if (!$business) {
            return redirect()->back()->with('error', 'Business not found');
        }

        // Get courses for sponsored CME
        $courses = DB::table('zc_course')
            ->whereIn('status', ['new', 'live', 'draft'])
            ->orderBy('course_id', 'desc')
            ->get(['course_id', 'course_title'])
            ->toArray();

        // Get seminars for sponsor seminar
        $seminars = DB::table('seminar')
            ->where('video_status', '!=', 'deleted')
            ->orderBy('schedule_timestamp', 'DESC')
            ->get(['seminar_no', 'seminar_title'])
            ->toArray();

        // Get specialities for speciality sponsor
        $specialities = DB::table('user_specialty')
            ->orderBy('title', 'ASC')
            ->get(['no', 'title'])
            ->toArray();

        // Get FAQs for sponsored FAQ
        $faqs = DB::table('post')
            ->where('status', 'published')
            ->where('postType', 'FAQ')
            ->whereNotNull('custom_url')
            ->orderBy('articleID', 'DESC')
            ->get(['articleID', 'title'])
            ->toArray();

        // Get episodes for sponsored episode
        $episodes = DB::table('medtalks_tv')
            ->where('video_status', '!=', 'deleted')
            ->where('episode_status', 'active')
            ->whereIn('episode_type', ['evening', 'diabetes-prime', '4d'])
            ->orderBy('id', 'desc')
            ->get(['id', 'title'])
            ->toArray();

        return Inertia::render('MarketingCampaign/Form', [
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
    public function update(Request $request, MarketingCampaign $marketing_campaign)
    {
        $validated = $request->validate([
            'businessID' => 'required|integer',
            'campaigntitle' => 'required|string|max:256',
            'campaign_type' => 'required|in:sponseredCME,sponserSeminar,specialitySponsor,sponsorMedtalks,sponsoredFaq,sponsoredEpisode,none',
            'campaignTargetID' => 'required|string|max:10',
            'campaignmission' => 'required|in:clicks,impressions,subscriptions,followers,interactions,accessCode',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image1' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image3' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image4' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image5' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        // Process images
        $imageNames = [];
        $imageFields = ['image', 'image1', 'image3', 'image4', 'image5'];
        $dbFields = [
            'image', 'image1', 'image3', 'image4', 'image5'
        ];
        $columnNames = [
            'marketingBannerSquare', 
            'marketingBannerRectangle', 
            'marketingBanner1', 
            'marketingBanner2', 
            'marketingBanner3'
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

        // Update campaign in database
        $marketing_campaign->update([
            'businessID' => $validated['businessID'],
            'campaignTitle' => $validated['campaigntitle'],
            'campaignType' => $validated['campaign_type'],
            'campaignTargetID' => $validated['campaignTargetID'],
            'campaignMission' => $validated['campaignmission'],
            'marketingBannerSquare' => $imageNames['marketingBannerSquare'],
            'marketingBannerRectangle' => $imageNames['marketingBannerRectangle'],
            'marketingBanner1' => $imageNames['marketingBanner1'],
            'marketingBanner2' => $imageNames['marketingBanner2'],
            'marketingBanner3' => $imageNames['marketingBanner3'],
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
}