<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TagController extends Controller
{
    /**
     * Display a listing of tags.
     */
    public function index()
    {
        $tags = Tag::select(
            'tagId',
            'display_name',
            'tagString',
            DB::raw("(SELECT title FROM user_specialty WHERE no = tags.tagCategory1) as tagCategory1"),
            DB::raw("(SELECT title FROM user_specialty WHERE no = tags.tagCategory2) as tagCategory2"),
            DB::raw("(SELECT title FROM user_specialty WHERE no = tags.tagCategory3) as tagCategory3")
        )
        ->where('display_name', '!=', '')
        ->orderBy('display_name', 'asc')
        ->get();

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new tag.
     */
    public function create()
    {
        $specialities = DB::table('user_specialty')
            ->where(['speciality_type' => 'speciality', 'parentID' => 0, 'parentID2' => 0])
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

        return Inertia::render('Tags/Form', [
            'tag' => null,
            'specialities' => $specialities,
        ]);
    }

    /**
     * Store a newly created tag in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'display_name' => 'required|string|max:400',
            'tagString' => 'required|string|max:250|unique:tags,tagString',
            'tagCategory1' => 'nullable|string|max:255',
            'tagCategory2' => 'nullable|string|max:255',
            'tagCategory3' => 'nullable|string|max:255',
        ]);

        // Format tagString (replace spaces with hyphens)
        $validated['tagString'] = preg_replace('/\s+/', '-', strtolower($validated['tagString']));
        $validated['category'] = 'article';
        $validated['status'] = 'approved';

        Tag::create($validated);

        return redirect()->route('tags.index')->with('success', 'Tag created successfully!');
    }

    /**
     * Show the form for editing the specified tag.
     */
    public function edit(Tag $tag)
    {
        $specialities = DB::table('user_specialty')
            ->where(['speciality_type' => 'speciality', 'parentID' => 0, 'parentID2' => 0])
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

        return Inertia::render('Tags/Form', [
            'tag' => $tag,
            'specialities' => $specialities,
        ]);
    }

    /**
     * Update the specified tag in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'display_name' => 'required|string|max:400',
            'tagString' => 'required|string|max:250|unique:tags,tagString,'.$tag->tagId.',tagId',
            'tagCategory1' => 'nullable|string|max:255',
            'tagCategory2' => 'nullable|string|max:255',
            'tagCategory3' => 'nullable|string|max:255',
        ]);

        // Format tagString (replace spaces with hyphens)
        $validated['tagString'] = preg_replace('/\s+/', '-', strtolower($validated['tagString']));

        $tag->update($validated);

        return redirect()->route('tags.index')->with('success', 'Tag updated successfully!');
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(Tag $tag)
    {
        $tag->update(['status' => 'deleted']);

        return redirect()->route('tags.index')->with('success', 'Tag deleted successfully!');
    }

    /**
     * Check if tag already exists
     */
    public function checkTag(Request $request)
    {
        $tag = $request->get('tag');
        $dname = $request->get('dname');
        $tagId = $request->get('tag_id');

        $query = Tag::where('status', '!=', 'deleted');

        if ($tag) {
            $query->where('tagString', $tag);
        } elseif ($dname) {
            $query->where('display_name', $dname);
        }

        if ($tagId) {
            $query->where('tagId', '!=', $tagId);
        }

        return response()->json($query->exists() ? '1' : '0');
    }
}