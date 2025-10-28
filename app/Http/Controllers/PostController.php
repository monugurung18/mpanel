<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     */
    public function index()
    {
        $posts = Post::active()->orderBy('created_on', 'desc')->get();

        // Get available categories
        $categories = Post::active()
            ->whereNotNull('catagory1')
            ->distinct()
            ->pluck('catagory1')
            ->merge(
                Post::active()->whereNotNull('catagory2')->distinct()->pluck('catagory2')
            )
            ->merge(
                Post::active()->whereNotNull('catagory3')->distinct()->pluck('catagory3')
            )
            ->unique()
            ->filter()
            ->map(fn($cat) => ['value' => $cat, 'label' => $cat])
            ->values()
            ->toArray();

        $specialities = DB::table('user_specialty')
            ->select('no as value', 'title as label')
            ->orderBy('title')
            ->get()
            ->toArray();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'specialities' => $specialities,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        $categories = Post::active()
            ->whereNotNull('catagory1')
            ->distinct()
            ->pluck('catagory1')
            ->merge(
                Post::active()->whereNotNull('catagory2')->distinct()->pluck('catagory2')
            )
            ->merge(
                Post::active()->whereNotNull('catagory3')->distinct()->pluck('catagory3')
            )
            ->unique()
            ->filter()
            ->map(fn($cat) => ['value' => $cat, 'label' => $cat])
            ->values()
            ->toArray();

        $specialities = DB::table('speciality')
            ->select('s_id as value', 'speciality as label')
            ->orderBy('speciality')
            ->get()
            ->map(fn($spec) => ['value' => (string)$spec->value, 'label' => $spec->label])
            ->toArray();

        return Inertia::render('Posts/Form', [
            'post' => null,
            'categories' => $categories,
            'specialities' => $specialities,
        ]);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'custom_url' => 'required|string|max:255|unique:post,custom_url',
            'postType' => 'nullable|string|max:255',
            'theContent' => 'required|string',
            'transcript' => 'nullable|string',
            'videoLink' => 'nullable|string|max:256',
            'linkType' => 'nullable|string|max:255',
            'catagory1' => 'nullable|string|max:100',
            'diseaseRelations' => 'nullable|string|max:50',
            'author1' => 'nullable|string|max:300',
            'status' => 'required|in:draft,published,deleted',
            'isFeatured' => 'boolean',
            'post_date' => 'required|date',
            'featuredThumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            'alt_image' => 'nullable|string|max:200',
            'seo_pageTitle' => 'nullable|string|max:256',
            'seo_metaDesctiption' => 'nullable|string',
            'seo_metaKeywords' => 'nullable|string',
            'seo_canonical' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
        ]);

        // Handle image upload
        if ($request->hasFile('featuredThumbnail')) {
            $image = $request->file('featuredThumbnail');
            $filename = time() . '-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            
            // Store in public/uploads/post/orginal directory
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image->move($destinationPath, $filename);
            $validated['featuredThumbnail'] = $filename;
        }

        // Set default values
        $validated['postType'] = $validated['postType'] ?? 'article';
        $validated['isActive'] = '1';
        $validated['isFeatured'] = $validated['isFeatured'] ?? 0;
        $validated['post_like'] = 0;
        $validated['post_comment'] = 0;
        
        // Convert tags array to comma-separated string
        if (isset($validated['tags']) && is_array($validated['tags'])) {
            $validated['tags'] = implode(',', $validated['tags']);
        }

        // Format post_date as string (Y-m-d H:i:s)
        if (isset($validated['post_date'])) {
            $validated['post_date'] = date('Y-m-d H:i:s', strtotime($validated['post_date']));
        }

        // Set audit fields
        $validated['created_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['created_ip'] = $request->ip();
        $validated['created_on'] = now()->format('Y-m-d H:i:s');

        // Auto-set post_date if status is published and not set
        if ($validated['status'] === 'published' && !isset($validated['post_date'])) {
            $validated['post_date'] = now()->format('Y-m-d H:i:s');
        }

        $post = Post::create($validated);

        return redirect()->route('posts.index')->with('success', 'Post created successfully!');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        $categories = Post::active()
            ->whereNotNull('catagory1')
            ->distinct()
            ->pluck('catagory1')
            ->merge(
                Post::active()->whereNotNull('catagory2')->distinct()->pluck('catagory2')
            )
            ->merge(
                Post::active()->whereNotNull('catagory3')->distinct()->pluck('catagory3')
            )
            ->unique()
            ->filter()
            ->map(fn($cat) => ['value' => $cat, 'label' => $cat])
            ->values()
            ->toArray();

        $specialities = DB::table('speciality')
            ->select('s_id as value', 'speciality as label')
            ->orderBy('speciality')
            ->get()
            ->map(fn($spec) => ['value' => (string)$spec->value, 'label' => $spec->label])
            ->toArray();

        return Inertia::render('Posts/Form', [
            'post' => $post,
            'categories' => $categories,
            'specialities' => $specialities,
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'custom_url' => 'required|string|max:255|unique:post,custom_url,' . $post->articleID . ',articleID',
            'postType' => 'nullable|string|max:255',
            'theContent' => 'required|string',
            'transcript' => 'nullable|string',
            'videoLink' => 'nullable|string|max:256',
            'linkType' => 'nullable|string|max:255',
            'catagory1' => 'nullable|string|max:100',
            'diseaseRelations' => 'nullable|string|max:50',
            'author1' => 'nullable|string|max:300',
            'status' => 'required|in:draft,published,deleted',
            'isFeatured' => 'boolean',
            'post_date' => 'required|date',
            'featuredThumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024',
            'alt_image' => 'nullable|string|max:200',
            'seo_pageTitle' => 'nullable|string|max:256',
            'seo_metaDesctiption' => 'nullable|string',
            'seo_metaKeywords' => 'nullable|string',
            'seo_canonical' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
        ]);

        // Handle image upload
        if ($request->hasFile('featuredThumbnail')) {
            // Delete old image
            if ($post->featuredThumbnail) {
                $oldImagePath = public_path('uploads/post/orginal/' . $post->featuredThumbnail);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = $request->file('featuredThumbnail');
            $filename = time() . '-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image->move($destinationPath, $filename);
            $validated['featuredThumbnail'] = $filename;
        }

        // Convert tags array to comma-separated string
        if (isset($validated['tags']) && is_array($validated['tags'])) {
            $validated['tags'] = implode(',', $validated['tags']);
        }

        // Format post_date as string (Y-m-d H:i:s)
        if (isset($validated['post_date'])) {
            $validated['post_date'] = date('Y-m-d H:i:s', strtotime($validated['post_date']));
        }

        // Set audit fields
        $validated['modified_by'] = auth()->user()->username ?? auth()->user()->display_name;
        $validated['modified_ip'] = $request->ip();
        $validated['modified_on'] = now()->format('Y-m-d H:i:s');

        // Auto-set post_date if status changed to published
        if ($validated['status'] === 'published' && !$post->post_date) {
            $validated['post_date'] = now()->format('Y-m-d H:i:s');
        }

        $post->update($validated);

        return redirect()->route('posts.index')->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        // Soft delete by setting status to 'deleted'
        $post->update([
            'status' => 'deleted',
            'deactivated_by' => auth()->user()->username ?? auth()->user()->display_name,
            'deactivated_ip' => request()->ip(),
            'deactivated_on' => now()->format('Y-m-d H:i:s'),
        ]);

        return redirect()->route('posts.index')->with('success', 'Post deleted successfully!');
    }
}
