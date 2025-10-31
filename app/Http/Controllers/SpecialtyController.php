<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SpecialtyController extends Controller
{
    /**
     * Display a listing of specialties.
     */
    public function index()
    {
        $specialties = Specialty::select(
            'no',
            'title',
            'spec_desc',
            'mobileThumb',
            'banner_img',
            'status'
        )->get();

        return Inertia::render('Specialties/Index', [
            'specialties' => $specialties,
        ]);
    }

    /**
     * Show the form for creating a new specialty.
     */
    public function create()
    {
        // Get parent specialties for dropdowns
        $parentSpecialties = Specialty::where('parentID', 0)
            ->where('parentID2', 0)
            ->where('parentID3', 0)
            ->where('parentID4', 0)
            ->where('parentID5', 0)
            ->select('no', 'title')
            ->get()
            ->map(function ($spec) {
                return [
                    'value' => (string) $spec->no,
                    'label' => $spec->title,
                ];
            })
            ->toArray();

        return Inertia::render('Specialties/Form', [
            'specialty' => null,
            'parentSpecialties' => [
                $parentSpecialties, // parentID
                $parentSpecialties, // parentID2
                $parentSpecialties, // parentID3
                $parentSpecialties, // parentID4
                $parentSpecialties, // parentID5
            ],
        ]);
    }

    /**
     * Store a newly created specialty in storage.
     */
    public function store(Request $request)
    {
        // Debug: Log all request data
        \Log::info('Specialty store request data:', $request->all());
        
        $validated = $request->validate([
            'title' => 'required|string|max:250',
            'spec_desc' => 'nullable|string',
            'meta_title' => 'nullable|string|max:256',
            'meta_desc' => 'nullable|string',
            'meta_key' => 'nullable|string',
            'custom_url' => 'nullable|string|max:256',
            'cmeDescription' => 'nullable|string',
            'speciality_type' => 'nullable|in:speciality,preference,follow,sponsored',
            'parentID' => 'nullable|integer',
            'parentID2' => 'nullable|integer',
            'parentID3' => 'nullable|integer',
            'parentID4' => 'nullable|integer',
            'parentID5' => 'nullable|integer',
            'status' => 'nullable|in:on,off', // Add validation for status
            'web_banner' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'app_banner' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'icon_banner' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'banner_img' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        // Debug: Log validated data
        \Log::info('Specialty validated data:', $validated);
        
        // Handle image uploads
        $imageFields = ['web_banner', 'app_banner', 'icon_banner', 'banner_img'];
        $imageNames = [];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $filename = time() . '-' . $field . '-' . Str::slug($file->getClientOriginalName()) . '.webp';
                $file->move(public_path('uploads/specialty'), $filename);
                $imageNames[$field] = $filename;
            }
        }

        // Map image names to database fields
        $validated['thumbnail_img'] = $imageNames['web_banner'] ?? $request->input('web_banner_old', null);
        $validated['mobileThumb'] = $imageNames['app_banner'] ?? $request->input('app_banner_old', null);
        $validated['featured_img'] = $imageNames['icon_banner'] ?? $request->input('icon_banner_old', null);
        $validated['banner_img'] = $imageNames['banner_img'] ?? $request->input('banner_img_old', null);

        // Set default status if not provided
        $validated['status'] = $request->input('status', 'on');

        // Debug: Log final data before creation
        \Log::info('Specialty final data before creation:', $validated);
        
        // Ensure title is not empty
        if (empty($validated['title'])) {
            \Log::error('Title is empty in validated data', ['validated' => $validated]);
            return redirect()->back()->withErrors(['title' => 'The title field is required.']);
        }

        $specialty = Specialty::create($validated);
        \Log::info('Specialty created successfully', ['specialty_id' => $specialty->no]);

        return redirect()->route('specialties.index')->with('success', 'Specialty created successfully!');
    }

    /**
     * Show the form for editing the specified specialty.
     */
    public function edit(Specialty $specialty)
    {
        // Get parent specialties for dropdowns
        $parentSpecialties = Specialty::where('parentID', 0)
            ->where('parentID2', 0)
            ->where('parentID3', 0)
            ->where('parentID4', 0)
            ->where('parentID5', 0)
            ->select('no', 'title')
            ->get()
            ->map(function ($spec) {
                return [
                    'value' => (string) $spec->no,
                    'label' => $spec->title,
                ];
            })
            ->toArray();

        return Inertia::render('Specialties/Form', [
            'specialty' => $specialty,
            'parentSpecialties' => [
                $parentSpecialties, // parentID
                $parentSpecialties, // parentID2
                $parentSpecialties, // parentID3
                $parentSpecialties, // parentID4
                $parentSpecialties, // parentID5
            ],
        ]);
    }

    /**
     * Update the specified specialty in storage.
     */
    public function update(Request $request, Specialty $specialty)
    {
        // Debug: Log all request data
        \Log::info('Specialty update request data:', $request->all());
        
        $validated = $request->validate([
            'title' => 'required|string|max:250',
            'spec_desc' => 'nullable|string',
            'meta_title' => 'nullable|string|max:256',
            'meta_desc' => 'nullable|string',
            'meta_key' => 'nullable|string',
            'custom_url' => 'nullable|string|max:256',
            'cmeDescription' => 'nullable|string',
            'speciality_type' => 'nullable|in:speciality,preference,follow,sponsored',
            'parentID' => 'nullable|integer',
            'parentID2' => 'nullable|integer',
            'parentID3' => 'nullable|integer',
            'parentID4' => 'nullable|integer',
            'parentID5' => 'nullable|integer',
            'status' => 'nullable|in:on,off', // Add validation for status
            'web_banner' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'app_banner' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'icon_banner' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'banner_img' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        // Debug: Log validated data
        \Log::info('Specialty update validated data:', $validated);

        // Handle image uploads
        $imageFields = ['web_banner', 'app_banner', 'icon_banner', 'banner_img'];
        
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $filename = time() . '-' . $field . '-' . Str::slug($file->getClientOriginalName()) . '.webp';
                $file->move(public_path('uploads/specialty'), $filename);
                
                // Delete old image if exists
                $dbField = $this->getImageField($field);
                if ($specialty->$dbField) {
                    $oldImagePath = public_path('uploads/specialty/' . $specialty->$dbField);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                
                $validated[$dbField] = $filename;
            } else {
                // Keep existing image if no new one is uploaded
                $dbField = $this->getImageField($field);
                $oldValue = $request->input($field . '_old');
                if ($oldValue !== null && $oldValue !== '') {
                    $validated[$dbField] = $oldValue;
                }
            }
        }

        // Set status if provided, otherwise keep existing or default to 'on'
        if ($request->has('status')) {
            $validated['status'] = $request->input('status');
        }

        // Debug: Log final data before update
        \Log::info('Specialty final data before update:', $validated);
        
        // Ensure title is not empty
        if (empty($validated['title'])) {
            \Log::error('Title is empty in validated data for update', ['validated' => $validated]);
            return redirect()->back()->withErrors(['title' => 'The title field is required.']);
        }

        $specialty->update($validated);
        \Log::info('Specialty updated successfully', ['specialty_id' => $specialty->no]);

        return redirect()->route('specialties.index')->with('success', 'Specialty updated successfully!');
    }

    /**
     * Remove the specified specialty from storage.
     */
    public function destroy(Specialty $specialty)
    {
        // Delete associated images
        $imageFields = ['thumbnail_img', 'mobileThumb', 'featured_img', 'banner_img'];
        foreach ($imageFields as $field) {
            if ($specialty->$field) {
                $imagePath = public_path('uploads/specialty/' . $specialty->$field);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
        }

        $specialty->delete();

        return redirect()->route('specialties.index')->with('success', 'Specialty deleted successfully!');
    }

    /**
     * Map form field names to database field names
     */
    private function getImageField($formField)
    {
        $fieldMap = [
            'web_banner' => 'thumbnail_img',
            'app_banner' => 'mobileThumb',
            'icon_banner' => 'featured_img',
            'banner_img' => 'banner_img',
        ];

        return $fieldMap[$formField] ?? $formField;
    }
}