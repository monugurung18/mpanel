<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $table = 'tags';
    
    protected $primaryKey = 'tagId';

    public $timestamps = false;

    protected $fillable = [
        'tagString',
        'category',
        'tagCategory1',
        'tagCategory2',
        'tagCategory3',
        'status',
        'contentCount',
        'tagFeatured',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'clickCount',
        'square_image',
        'banner_image',
        'display_name',
    ];
}