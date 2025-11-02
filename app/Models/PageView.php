<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    protected $table = 'page_view';
    
    protected $primaryKey = 'view_id';
    
    public $timestamps = false;
    
    protected $fillable = [
        'article_id',
        'article_type',
        'view_count_web',
        'view_count_app',
        'date_time',
        'utm_source',
    ];
}