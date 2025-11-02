<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comment_table';
    
    protected $primaryKey = 'commentID';
    
    public $timestamps = false;
    
    protected $fillable = [
        'comment',
        'type',
        'postID',
        'userID',
        'timeStamp',
        'status',
        'moderation',
        'moderatorID',
        'moderatorNotes',
        'user_ip',
    ];
    
    protected $casts = [
        'timeStamp' => 'datetime',
    ];
    
    /**
     * Scope for approved comments
     */
    public function scopeApproved($query)
    {
        return $query->where('moderation', 'approvedByAdmin');
    }
}