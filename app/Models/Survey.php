<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $table = 'survey';
    
    protected $primaryKey = 'id';

    protected $fillable = [
        'title',
        'desp',
        'emb_url',
        'custom_url',
        'created_on',
        'modified_on',
        'created_by',
        'modified_by',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $casts = [
        'created_on' => 'date',
        'modified_on' => 'date',
    ];
}