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
        // Select only necessary columns to avoid loading large content blobs into memory
        $posts = Post::active()
            ->orderBy('created_on', 'desc')
            ->get([
                'articleID',
                'title',
                'status',
                'postType',
                'author1',
                'catagory1',
                'custom_url',
                'featuredThumbnail',
                'isFeatured',
                'post_date',
                'created_on',
            ]);

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

        $specialities = DB::table('user_specialty')
            ->select('no as value', 'title as label')
            ->orderBy('title')
            ->get()
            ->map(fn($spec) => ['value' => (string)$spec->value, 'label' => $spec->label])
            ->toArray();

        // Related posts options (recent 100)
        $relatedPostsOptions = Post::active()
            ->orderBy('created_on', 'desc')
            ->limit(100)
            ->get(['articleID as value', 'title as label'])
            ->map(fn($p) => ['value' => (string) $p->value, 'label' => $p->label])
            ->toArray();

        return Inertia::render('Posts/Form', [
            'post' => null,
            'categories' => $specialities,
            'specialities' => $specialities,
            'relatedPostsOptions' => $relatedPostsOptions,
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
            'featuredThumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=360,height=260',
            'SquareThumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=600,height=600',
            'bannerImage' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=1200,height=400',
            's_image1' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=770,height=550',
            'alt_image' => 'nullable|string|max:200',
            'seo_pageTitle' => 'nullable|string|max:256',
            'seo_metaDesctiption' => 'nullable|string',
            'seo_metaKeywords' => 'nullable|string',
            'seo_canonical' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'article_language' => 'nullable|string|max:50',
            'related_post_id' => 'nullable|array',
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
        if ($request->hasFile('SquareThumbnail')) {
            $image = $request->file('SquareThumbnail');
            $filename = time() . '-square-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image->move($destinationPath, $filename);
            $validated['SquareThumbnail'] = $filename;
        }
        if ($request->hasFile('bannerImage')) {
            $image = $request->file('bannerImage');
            $filename = time() . '-banner-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image->move($destinationPath, $filename);
            $validated['bannerImage'] = $filename;
        }
        if ($request->hasFile('s_image1')) {
            $image = $request->file('s_image1');
            $filename = time() . '-app-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image->move($destinationPath, $filename);
            $validated['s_image1'] = $filename;
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

        // Normalize related posts array (model cast will JSON encode)
        if (isset($validated['related_post_id']) && is_array($validated['related_post_id'])) {
            $validated['related_post_id'] = array_map(fn($v) => (string) $v, $validated['related_post_id']);
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
        

        $specialities = DB::table('user_specialty')
            ->select('no as value', 'title as label')
            ->orderBy('title')
            ->get()
            ->map(fn($spec) => ['value' => (string)$spec->value, 'label' => $spec->label])
            ->toArray();

        // Related posts options (exclude current)
        $relatedPostsOptions = Post::active()
            ->where('articleID', '!=', $post->articleID)
            ->orderBy('created_on', 'desc')
            ->limit(100)
            ->get(['articleID as value', 'title as label'])
            ->map(fn($p) => ['value' => (string) $p->value, 'label' => $p->label])
            ->toArray();

        return Inertia::render('Posts/Form', [
            'post' => $post,
            'categories' => $specialities,
            'relatedPostsOptions' => $relatedPostsOptions,
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
            'featuredThumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=360,height=260',
            'SquareThumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=600,height=600',
            'bannerImage' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=1200,height=400',
            's_image1' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:1024|dimensions:width=770,height=550',
            'alt_image' => 'nullable|string|max:200',
            'seo_pageTitle' => 'nullable|string|max:256',
            'seo_metaDesctiption' => 'nullable|string',
            'seo_metaKeywords' => 'nullable|string',
            'seo_canonical' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'article_language' => 'nullable|string|max:50',
            'related_post_id' => 'nullable|array',
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
        if ($request->hasFile('SquareThumbnail')) {
            if ($post->SquareThumbnail) {
                $old = public_path('uploads/post/orginal/' . $post->SquareThumbnail);
                if (file_exists($old)) unlink($old);
            }
            $image = $request->file('SquareThumbnail');
            $filename = time() . '-square-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) mkdir($destinationPath, 0755, true);
            $image->move($destinationPath, $filename);
            $validated['SquareThumbnail'] = $filename;
        }
        if ($request->hasFile('bannerImage')) {
            if ($post->bannerImage) {
                $old = public_path('uploads/post/orginal/' . $post->bannerImage);
                if (file_exists($old)) unlink($old);
            }
            $image = $request->file('bannerImage');
            $filename = time() . '-banner-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) mkdir($destinationPath, 0755, true);
            $image->move($destinationPath, $filename);
            $validated['bannerImage'] = $filename;
        }
        if ($request->hasFile('s_image1')) {
            if ($post->s_image1) {
                $old = public_path('uploads/post/orginal/' . $post->s_image1);
                if (file_exists($old)) unlink($old);
            }
            $image = $request->file('s_image1');
            $filename = time() . '-app-' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/post/orginal');
            if (!file_exists($destinationPath)) mkdir($destinationPath, 0755, true);
            $image->move($destinationPath, $filename);
            $validated['s_image1'] = $filename;
        }

        // Convert tags array to comma-separated string
        if (isset($validated['tags']) && is_array($validated['tags'])) {
            $validated['tags'] = implode(',', $validated['tags']);
        }

        // Normalize related posts array (model cast will JSON encode)
        if (isset($validated['related_post_id']) && is_array($validated['related_post_id'])) {
            $validated['related_post_id'] = array_map(fn($v) => (string) $v, $validated['related_post_id']);
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
