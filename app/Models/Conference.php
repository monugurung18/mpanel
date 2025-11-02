<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conference extends Model
{
    use HasFactory;

    protected $table = 'conference';
    
    protected $primaryKey = 'conference_id';

    protected $fillable = [
        'conference_title',
        'conference_description',
        'conference_agenda',
        'conference_whyAttend',
        'conference_date',
        'conference_endDate',
        'conference_start_time',
        'conference_end_time',
        'conference_banner',
        'frame_image',
        'conference_liveStram',
        'conference_replay',
        'conference_address',
        'conference_subtile',
        'stream_source',
        'conference_customURL',
        'status',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_colonical',
        'conferenceName',
        'hall',
        'speakerids',
        'speciality_id',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $casts = [
        // Add any necessary casts here
    ];

    /**
     * Get speakers as array
     */
    public function getSpeakersIdsArrayAttribute()
    {
        return $this->speakerids ? explode(',', $this->speakerids) : [];
    }

    /**
     * Get specialities as array
     */
    public function getSpecialityIdsArrayAttribute()
    {
        return $this->speciality_id ? explode(',', $this->speciality_id) : [];
    }

    /**
     * Scope for active conferences
     */
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'deleted');
    }

    /**
     * Scope for live conferences
     */
    public function scopeLive($query)
    {
        return $query->where('status', 'live');
    }

    /**
     * Scope for scheduled conferences
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'schedule');
    }

    /**
     * Scope for archived conferences
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'archive');
    }
}