<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

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
     * API endpoint to retrieve active specialities filtered by speciality_type='speciality' and status='on'
     */
    public function getActiveSpecialities(Request $request)
    {
        $specialities = Specialty::where('speciality_type', 'speciality')
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

        return response()->json($specialities);
    }

    /**
     * Show the form for creating a new specialty.
     */
    public function create()
    {
        // Get parent specialties for dropdowns
        $parentSpecialties = Specialty::where('speciality_type', 'speciality')
            ->where('status', 'on')
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
            'parentSpecialties' => 
                $parentSpecialties
        ]);
    }

    /**
     * Store a newly created specialty in storage.
     */
    public function store(Request $request)
    {
        // Debug: Log all request data
        \Log::info('Specialty store request data:', $request->all());
        
        // First, validate basic fields
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
        ]);

        // Validate images with custom validation
        $this->validateSpecialtyImages($request);

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
        $validated['parentID'] = $request->input('parentID', 0);
        $validated['parentID2'] = $request->input('parentID2', 0);
        $validated['parentID3'] = $request->input('parentID3', 0);
        $validated['parentID4'] = $request->input('parentID4', 0);
        $validated['parentID5'] = $request->input('parentID5', 0);

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
        $parentSpecialties = Specialty::where('speciality_type', 'speciality')
            ->where('status', 'on')
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
            'parentSpecialties' => 
                $parentSpecialties
        ]);
    }

    /**
     * Update the specified specialty in storage.
     */
    public function update(Request $request, Specialty $specialty)
    {
        // Debug: Log all request data
        \Log::info('Specialty update request data:', $request->all());
        
        // First, validate basic fields
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
        ]);

        // Validate images with custom validation
        $this->validateSpecialtyImages($request);

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

    /**
     * Custom validation for specialty images
     */
    private function validateSpecialtyImages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'web_banner' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            'app_banner' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            'icon_banner' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            'banner_img' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
        ], [
            'web_banner.max' => 'Web Banner image must not exceed 1MB.',
            'app_banner.max' => 'App Banner image must not exceed 1MB.',
            'icon_banner.max' => 'Icon Banner image must not exceed 1MB.',
            'banner_img.max' => 'Banner image must not exceed 1MB.',
            'web_banner.image' => 'Web Banner must be an image file.',
            'app_banner.image' => 'App Banner must be an image file.',
            'icon_banner.image' => 'Icon Banner must be an image file.',
            'banner_img.image' => 'Banner image must be an image file.',
        ]);

        // Check image dimensions if files are present
        if ($request->hasFile('web_banner')) {
            $image = getimagesize($request->file('web_banner')->getPathname());
            if ($image[0] != 360 || $image[1] != 260) {
                $validator->errors()->add('web_banner', 'Web Banner image must be exactly 360x260 pixels. Current dimensions: ' . $image[0] . 'x' . $image[1] . ' pixels.');
            }
        }

        if ($request->hasFile('app_banner')) {
            $image = getimagesize($request->file('app_banner')->getPathname());
            if ($image[0] != 451 || $image[1] != 260) {
                $validator->errors()->add('app_banner', 'App Banner image must be exactly 451x260 pixels. Current dimensions: ' . $image[0] . 'x' . $image[1] . ' pixels.');
            }
        }

        if ($request->hasFile('icon_banner')) {
            $image = getimagesize($request->file('icon_banner')->getPathname());
            if ($image[0] != 350 || $image[1] != 490) {
                $validator->errors()->add('icon_banner', 'Icon Banner image must be exactly 350x490 pixels. Current dimensions: ' . $image[0] . 'x' . $image[1] . ' pixels.');
            }
        }

        if ($request->hasFile('banner_img')) {
            $image = getimagesize($request->file('banner_img')->getPathname());
            if ($image[0] != 451 || $image[1] != 260) {
                $validator->errors()->add('banner_img', 'Banner image must be exactly 451x260 pixels. Current dimensions: ' . $image[0] . 'x' . $image[1] . ' pixels.');
            }
        }

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
    }
}