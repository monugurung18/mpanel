<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use HasFactory;

    protected $table = 'user_specialty';
    
    protected $primaryKey = 'no';

    public $timestamps = false;

    protected $fillable = [
        'parentID',
        'parentID2',
        'parentID3',
        'parentID4',
        'parentID5',
        'custom_url',
        'title',
        'spec_desc',
        'meta_title',
        'thumbnail_img',
        'mobileThumb',
        'banner_img',
        'featured_img',
        'meta_desc',
        'cmeDescription',
        'meta_image',
        'meta_key',
        'status',
        'speciality_type',
        'shortName',
        'isFeatured',
        'categoryAlias',
        'post_english_count',
        'medtalks_tv_count',
        'cme_count',
        'webinar_count',
        'news_english_count',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'total_count',
        'post_hindi_count',
        'news_hindi_count',
        'uk_title',
        'medacademy_count',
        'advt',
        'target_platform',
    ];
}