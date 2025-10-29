<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\FrontendUser;
use Illuminate\Support\Facades\DB;

class CommonController extends Controller
{
    /**
     * Return a list of unique speakers in dropdown format.
     */
    public function GetSpeaker()
    {
        $speakers = DB::table('frontend_users')
            ->where('userType', 'instructor')
            ->where('userStatus', 'active')
            ->select('user_no as value', 'user_FullName as label')
            ->orderBy('user_FullName')
            ->get()
            ->map(function ($speaker) {
                return [
                    'value' => (string) $speaker->value,
                    'label' => trim($speaker->label),
                ];
            })
            ->toArray();

        return response()->json($speakers);
    }

    public function getSpecialities()
    {
        
       $specialities = DB::table('user_specialty')
            ->where(['speciality_type'=> 'speciality','parentID'=> 0,'parentID2'=>0])
            ->where('status', 'on')
            ->select('no as value', 'title as label')
            ->orderBy('title')
            ->get()
            ->map(function ($specialty) {
                return [
                    'value' => (string) $specialty->value,
                    'label' => $specialty->label,
                ];
            })
            ->toArray();
        return response()->json($specialities);
    }
}
