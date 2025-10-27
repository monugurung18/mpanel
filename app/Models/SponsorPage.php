<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsorPage extends Model
{
    use HasFactory;

    protected $table = 'sponsor_pages';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $fillable = [
        'type',
        'title',
        'desc',
        'strip_banner',
        'square_banner',
        'advt_banner',
        'link',
        'orders',
        'is_active',
        'section',
        'custom_url',
        'parent_custom_url',
        'logo',
        'category',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'orders' => 'integer',
    ];

    /**
     * Scope for active sponsor pages
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    /**
     * Scope for seminar type pages
     */
    public function scopeSeminar($query)
    {
        return $query->where('type', 'seminar');
    }

    /**
     * Scope for sponsor section
     */
    public function scopeSponsor($query)
    {
        return $query->where('section', 'sponsor');
    }

    /**
     * Get sponsor pages ordered
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('orders');
    }

    /**
     * Get sponsor pages with custom URL
     */
    public function scopeWithCustomUrl($query)
    {
        return $query->whereNotNull('custom_url')
                     ->where('custom_url', '!=', '');
    }
}
