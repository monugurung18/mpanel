<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscribe extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'zc_subscribe';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'subscribe_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'type',
        'status',
        'ref_id',
        'remind_me',
        'notification_type',
        'notification_status',
        'accessCode',
        'login_time',
        'logout_time',
        'subscribe_via',
        'subscribe_with',
        'view_attempts',
        'ref',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'timestamp' => 'datetime',
        'login_time' => 'datetime',
        'logout_time' => 'datetime',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'timestamp',
        'login_time',
        'logout_time',
    ];

    /**
     * Get the user that owns the subscription.
     */
    public function user()
    {
        return $this->belongsTo(FrontendUser::class, 'user_id', 'user_id');
    }
}