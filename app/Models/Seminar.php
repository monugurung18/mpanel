<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seminar extends Model
{
    use HasFactory;

    protected $table = 'seminar';
    
    protected $primaryKey = 'seminar_no';

    protected $fillable = [
        'seminar_title',
        'seminar_desc',
        'seminar_auth',
        'video_url',
        'video_url2',
        'video_url3',
        'video_status',
        'video_button',
        'videoSource',
        'offline_url',
        'video_image',
        'schedule_timestamp',
        'uploade_date',
        'countdown',
        'stream_url',
        'countdowntime',
        'sponsor_ids',
        'speakerids',
        'custom_url',
        'seminar_speciality',
        'isFeatured',
        'sand_notifaction',
        'featured',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'hasMCQ',
        'businessSponsered',
        'chatBox',
        'questionBox',
        'showArchive',
        'alt_image',
        'is_registered',
        's_image1',
        's_image2',
        'html_json',
        're_attempts',
        'seminar_type',
        'poll_link',
        'created_by',
        'created_ip',
        'modified_on',
        'modified_by',
        'modified_ip',
        'deactivated_on',
        'deactivated_by',
        'deactivated_ip',
        'shorten_url',
        'is_custom_registration',
        'education_partners',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $casts = [
        'video_button' => 'boolean',
        'is_registered' => 'boolean',
        'is_custom_registration' => 'boolean',
        're_attempts' => 'integer',
        'education_partners' => 'array',
        'schedule_timestamp' => 'datetime',
    ];

    /**
     * Get speakers as array
     */
    public function getSpeakersIdsArrayAttribute()
    {
        return $this->speakerids ? explode(',', $this->speakerids) : [];
    }

    /**
     * Get sponsors as array
     */
    public function getSponsorsArrayAttribute()
    {
        return $this->sponsor_ids ? explode(',', $this->sponsor_ids) : [];
    }

    /**
     * Scope for active seminars
     */
    public function scopeActive($query)
    {
        return $query->where('video_status', '!=', 'deleted');
    }

    /**
     * Scope for live seminars
     */
    public function scopeLive($query)
    {
        return $query->where('video_status', 'live');
    }

    /**
     * Scope for scheduled seminars
     */
    public function scopeScheduled($query)
    {
        return $query->where('video_status', 'schedule');
    }

    /**
     * Scope for featured seminars
     */
    public function scopeFeatured($query)
    {
        return $query->where('isFeatured', 1);
    }

    /**
     * Get seminar type display name
     */
    public function getTypeDisplayAttribute()
    {
        return $this->businessSponsered ? 'Sponsored' : 'Non-Sponsored';
    }
}
