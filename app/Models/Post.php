<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'post';
    
    protected $primaryKey = 'articleID';

    public $timestamps = false;

    protected $fillable = [
        'postType',
        'title',
        'status',
        'theContent',
        'transcript',
        'videoLink',
        'linkType',
        'mobileVideoLink',
        'mobileLinkType',
        'post_date',
        'custom_url',
        'article_language',
        'post_like',
        'post_comment',
        'featuredThumbnail',
        'SquareThumbnail',
        'bannerImage',
        'metaTitle',
        'metaDiscription',
        'metaKeywords',
        'tags',
        'author1',
        'catagory1',
        'diseaseRelations',
        'searchAlias1',
        'searchAlias2',
        'searchAlias3',
        'searchAlias4',
        'author2',
        'author3',
        'catagory2',
        'catagory3',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'isFeatured',
        'isActive',
        'alt_image',
        's_image1',
        'related_post_id',
        'created_by',
        'created_ip',
        'modified_by',
        'modified_on',
        'modified_ip',
        'deactivated_by',
        'deactivated_ip',
        'deactivated_on',
        'created_on',
    ];

    protected $casts = [
        'isFeatured' => 'boolean',
        'post_like' => 'integer',
        'post_comment' => 'integer',
        'related_post_id' => 'array',
        'created_on' => 'datetime',
    ];

    /**
     * Scope for published posts
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for draft posts
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope for active posts (not deleted)
     */
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'deleted')->where('isActive', '1');
    }

    /**
     * Scope for featured posts
     */
    public function scopeFeatured($query)
    {
        return $query->where('isFeatured', 1);
    }

    /**
     * Scope for posts by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('catagory1', $category)
                    ->orWhere('catagory2', $category)
                    ->orWhere('catagory3', $category);
    }

    /**
     * Scope for posts by author
     */
    public function scopeByAuthor($query, $author)
    {
        return $query->where('author1', 'LIKE', "%{$author}%")
                    ->orWhere('author2', 'LIKE', "%{$author}%")
                    ->orWhere('author3', 'LIKE', "%{$author}%");
    }

    /**
     * Get comments for this post
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'postID', 'articleID');
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'published' => 'green',
            'draft' => 'yellow',
            'deleted' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get status display name
     */
    public function getStatusDisplayAttribute()
    {
        return ucfirst($this->status);
    }

    /**
     * Get primary category
     */
    public function getCategoryAttribute()
    {
        return $this->catagory1;
    }

    /**
     * Get primary author
     */
    public function getAuthorAttribute()
    {
        return $this->author1;
    }

    /**
     * Get all categories as array
     */
    public function getAllCategoriesAttribute()
    {
        return array_filter([
            $this->catagory1,
            $this->catagory2,
            $this->catagory3,
        ]);
    }

    /**
     * Get all authors as array
     */
    public function getAllAuthorsAttribute()
    {
        return array_filter([
            $this->author1,
            $this->author2,
            $this->author3,
        ]);
    }
}