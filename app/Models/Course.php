<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'zc_course';
    protected $primaryKey = 'course_id';
    public $timestamps = false;

    protected $fillable = [
        'course_title',
        'courseType',
        'speciality',
        'course_desc',
        'course_featured_img',
        'course_featured_image_thumb',
        'instructor',
        'instructorType',
        'status',
        'pricing',
        'cost_in_inr',
        'cost_in_dollar',
        'timestamp',
        'form_step',
        'course_time',
        'custom_url',
        'featured_course',
        'completionCertificate',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'coursePassMark',
        'accessCodeLimited',
        'alt_image',
        'sponsored_certificate_title',
        'is_certificate_required',
        'credit_points_applicable',
        'sponsor',
        's_image1',
        's_image2',
        'sample_certificate',
        'sample_video',
        'cme_webcast_url',
        'reattempt',
        'course_presentation',
    ];

    protected $casts = [
        'course_id' => 'integer',
        'cost_in_inr' => 'integer',
        'cost_in_dollar' => 'integer',
        'coursePassMark' => 'integer',
        'accessCodeLimited' => 'integer',
        'is_certificate_required' => 'boolean',
        'reattempt' => 'integer',
    ];
}