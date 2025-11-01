<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleTag extends Model
{
    protected $table = 'article_tags';
    protected $primaryKey = 'relationID';
    public $timestamps = false; // Disable timestamps since the table doesn't have created_at/updated_at columns
    
    protected $fillable = [
        'postID',
        'tagTitle',
    ];
}