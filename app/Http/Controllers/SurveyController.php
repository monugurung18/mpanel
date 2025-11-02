<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SurveyController extends Controller
{
    /**
     * Display a listing of the surveys.
     */
    public function index()
    {
        $surveys = Survey::orderBy('id', 'desc')->get();

        return Inertia::render('Surveys/Index', [
            'surveys' => $surveys,
        ]);
    }

    /**
     * Show the form for creating a new survey.
     */
    public function create()
    {
        return Inertia::render('Surveys/Form', [
            'survey' => null,
        ]);
    }

    /**
     * Store a newly created survey in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'custom_url' => 'required|string|max:200|unique:survey,custom_url',
            'emb_url' => 'nullable|string|max:200',
            'desp' => 'nullable|string|max:100',
        ]);

        $validated['created_on'] = now();
        $validated['created_by'] = auth()->user()->username ?? auth()->user()->display_name;

        Survey::create($validated);

        return redirect()->route('surveys.index')->with('success', 'Survey created successfully!');
    }

    /**
     * Show the form for editing the specified survey.
     */
    public function edit(Survey $survey)
    {
        return Inertia::render('Surveys/Form', [
            'survey' => $survey,
        ]);
    }

    /**
     * Update the specified survey in storage.
     */
    public function update(Request $request, Survey $survey)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'custom_url' => 'required|string|max:200|unique:survey,custom_url,'.$survey->id.',id',
            'emb_url' => 'nullable|string|max:200',
            'desp' => 'nullable|string|max:100',
        ]);

        $validated['modified_on'] = now();
        $validated['modified_by'] = auth()->user()->username ?? auth()->user()->display_name;

        $survey->update($validated);

        return redirect()->route('surveys.index')->with('success', 'Survey updated successfully!');
    }

    /**
     * Remove the specified survey from storage.
     */
    public function destroy(Survey $survey)
    {
        $survey->delete();

        return redirect()->route('surveys.index')->with('success', 'Survey deleted successfully!');
    }

    /**
     * Create the survey table manually.
     */
    public function createSurveyTable()
    {
        try {
            // Check if table exists
            if (!\Illuminate\Support\Facades\DB::getSchemaBuilder()->hasTable('survey')) {
                \Illuminate\Support\Facades\DB::statement("CREATE TABLE `survey` (
                  `id` int(11) NOT NULL AUTO_INCREMENT,
                  `title` varchar(100) DEFAULT NULL,
                  `desp` varchar(100) DEFAULT NULL,
                  `emb_url` varchar(200) DEFAULT NULL,
                  `custom_url` varchar(200) DEFAULT NULL,
                  `created_on` date DEFAULT NULL,
                  `modified_on` date DEFAULT NULL,
                  `created_by` varchar(255) DEFAULT NULL,
                  `modified_by` varchar(255) DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  KEY `custom_url_index` (`custom_url`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
                
                return response()->json(['message' => 'Survey table created successfully!']);
            } else {
                return response()->json(['message' => 'Survey table already exists.']);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}