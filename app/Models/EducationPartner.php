<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationPartner extends Model
{
    protected $table = 'education_partners';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'square_image',
        'rectangle_image',
        'is_active',
        'created_by',
        'created_on',
        'created_ip',
        'modified_by',
        'modified_on',
        'modified_ip',
    ];
}
