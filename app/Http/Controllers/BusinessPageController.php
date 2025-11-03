<?php

namespace App\Http\Controllers;

use App\Models\BusinessPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BusinessPageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $businesses = BusinessPage::all();
        
        return Inertia::render('BusinessPages/Index', [
            'businesses' => $businesses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('BusinessPages/Form', [
            'business' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_Name' => 'required|string|max:256',
            'business_description' => 'required|string',
            'businessType' => 'required|string|max:256',
            'businessEmail' => 'nullable|email|max:100',
            'businessContactNumber' => 'nullable|string|max:20|regex:/^\+\d{1,3}-\d{7,15}$/',
            'businessCategory' => 'required|string|max:50',
            'businessAddress' => 'nullable|string',
            'city' => 'nullable|string|max:25',
            'state' => 'nullable|string|max:25',
            'country' => 'nullable|string|max:25',
            'businessPincode' => 'nullable|string|max:256',
            'businessWebsite' => 'nullable|url|max:100',
            'isCustomPage' => 'nullable|string|max:10',
            'custom_url' => 'nullable|string|max:200',
            'businessLogo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024|dimensions:width=240,height=71',
        ], [
            'businessContactNumber.regex' => 'The contact number must be in the format +[1-3 digits]-[7-15 digits] (e.g., +1-234567890 or +91-9876543210).',
        ]);

        // Handle businessLogo upload
        $businessLogoPath = null;
        if ($request->hasFile('businessLogo')) {
            $file = $request->file('businessLogo');
            $filename = Str::slug($validated['business_Name']) . '_logo.' . $file->getClientOriginalExtension();
            $businessLogoPath = $file->storeAs('uploads/business_banners', $filename, 'public');
        }

        // Create the business page
        $businessData = $validated;
        if ($businessLogoPath) {
            $businessData['businessLogo'] = $businessLogoPath;
        }

        BusinessPage::create($businessData);

        return redirect()->route('business-pages.index')->with('success', 'Business created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BusinessPage $businessPage)
    {
        return Inertia::render('BusinessPages/Show', [
            'business' => $businessPage,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BusinessPage $businessPage)
    {
        return Inertia::render('BusinessPages/Form', [
            'business' => $businessPage,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateBusinessPage(Request $request, BusinessPage $businessPage)
    {
        $validated = $request->validate([
            'business_Name' => 'required|string|max:256',
            'business_description' => 'required|string',
            'businessType' => 'required|string|max:256',
            'businessEmail' => 'nullable|email|max:100',
            'businessContactNumber' => 'nullable|string|max:20|regex:/^\+\d{1,3}-\d{7,15}$/',
            'businessCategory' => 'required|string|max:50',
            'businessAddress' => 'nullable|string',
            'city' => 'nullable|string|max:25',
            'state' => 'nullable|string|max:25',
            'country' => 'nullable|string|max:25',
            'businessPincode' => 'nullable|string|max:256',
            'businessWebsite' => 'nullable|url|max:100',
            'isCustomPage' => 'nullable|string|max:10',
            'custom_url' => 'nullable|string|max:200',
            'businessLogo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024|dimensions:width=240,height=71',
        ], [
            'businessContactNumber.regex' => 'The contact number must be in the format +[1-3 digits]-[7-15 digits] (e.g., +1-234567890 or +91-9876543210).',
        ]);
        $businessPage = BusinessPage::findOrFail($request->id);

        // Handle businessLogo upload
        $businessLogoPath = $businessPage->businessLogo;
        if ($request->hasFile('businessLogo')) {
            // Delete old logo if exists
            if ($businessPage->businessLogo) {
                Storage::disk('public')->delete($businessPage->businessLogo);
            }
            
            $file = $request->file('businessLogo');
            $filename = Str::slug($validated['business_Name']) . '_logo.' . $file->getClientOriginalExtension();
            $businessLogoPath = $file->storeAs('uploads/business_banners', $filename, 'public');
        }

        // Update the business page
        $businessData = $validated;
        if ($businessLogoPath !== $businessPage->businessLogo) {
            $businessData['businessLogo'] = $filename;
        }

        $businessPage->update($businessData);

        return redirect()->route('business-pages.index')->with('success', 'Business updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessPage $businessPage)
    {
        // Delete business logo if it exists
        if ($businessPage->businessLogo) {
            Storage::disk('public')->delete($businessPage->businessLogo);
        }

        $businessPage->delete();

        return redirect()->route('business-pages.index')->with('success', 'Business deleted successfully.');
    }
}