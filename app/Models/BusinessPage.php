<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessPage extends Model
{
    protected $table = 'business_pages';
    protected $primaryKey = 'businessID';
    public $timestamps = false;

    protected $fillable = [
        'business_Name',
        'business_description',
        'businessType',
        'businessLogo',
        'businessEmail',
        'businessContactNumber',
        'businessCategory',
        'businessAddress',
        'city',
        'state',
        'country',
        'businessPincode',
        'businessMetaTitle',
        'businessMetaDescription',
        'businessKeywords',
        'businessMetaImage',
        'businessWebsite',
        'squareBanner',
        'rectangleBanner',
        'longBanner1',
        'businessPageBanner',
        'isFeaturedBusiness',
        'isCustomPage',
        'custom_url',
    ];

    protected $casts = [
        'businessID' => 'integer',
    ];
}