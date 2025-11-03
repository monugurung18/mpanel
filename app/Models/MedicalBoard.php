<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalBoard extends Model
{
    use HasFactory;

    protected $table = 'medical_boards';
    
    protected $primaryKey = 'boardId';

    public $timestamps = true;

    protected $fillable = [
        'medicalBoardName',
        'medicalBoardLogo',
        'medicalBoardAddress',
        'web_address',
    ];
}