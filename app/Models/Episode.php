<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Episode extends Model
{
    use HasFactory;

    protected $table = 'medtalks_tv';

    protected $fillable = [
        'title',
        'desc',
        'video_url',
        'feature_image_banner',
        'video_status',
        'custom_url',
        'videoSource',
        'date_time',
        'episode_status',
        'episode_type',
        'speakers_ids',
        'episode_no',
        'speciality_id',
        'question_required',
        'login_required',
        'created_by',
        'created_ip',
        'modified_by',
        'modified_on',
        'modified_ip',
        'is_sponsored',
        'is_register',
        'pdf',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'alt_image',
        'sponserby',
        'deactivated_by',
        'deactivated_on',
        'deactivated_ip',
        'html_json',
        'is_custom_registration',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $casts = [
        'question_required' => 'boolean',
        'login_required' => 'boolean',
        'is_sponsored' => 'boolean',
        'is_register' => 'boolean',
        'is_custom_registration' => 'boolean',
    ];

    /**
     * Get speakers as array
     */
    public function getSpeakersIdsArrayAttribute()
    {
        if (!$this->speakers_ids) {
            return [];
        }
        return array_map(function($id) {
            return (string) trim($id);
        }, explode(',', $this->speakers_ids));
    }

    /**
     * Get specialities as array
     */
    public function getSpecialityIdsArrayAttribute()
    {
        if (!$this->speciality_id) {
            return [];
        }
        return array_map(function($id) {
            return (string) trim($id);
        }, explode(',', $this->speciality_id));
    }

    /**
     * Scope for active episodes
     */
    public function scopeActive($query)
    {
        return $query->where('episode_status', 'active')
                     ->where('video_status', '!=', 'deleted');
    }

    /**
     * Get episode type display name
     */
    public function getTypeDisplayAttribute()
    {
        return $this->episode_type == 'evening' ? 'Non-sponsored' : 'Sponsored';
    }
}
