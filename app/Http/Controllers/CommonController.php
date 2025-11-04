<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\FrontendUser;
use Illuminate\Support\Facades\DB;
use App\Models\EducationPartner;
use App\Models\Specialty;


class CommonController extends Controller
{
    /**
     * Return a list of unique speakers in dropdown format.
     */
    public function GetSpeaker()
    {
        $speakers = FrontendUser::where('userStatus', 'active')
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
        
       $specialities = Specialty::where(['speciality_type'=> 'speciality','parentID'=> 0,'parentID2'=>0])
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

    /**
     * Return a list of education partners for dropdowns, etc.
     */
    public function apiEducationPartners()
    {
        $partners = EducationPartner::query()
            ->orderBy('name')
            ->get(['id', 'name', 'square_image', 'rectangle_image', 'is_active'])
            ->map(function ($row) {
                return [
                    'value' => $row->id,
                    'label' => $row->name,
                    'square_image' => $row->square_image,
                    'rectangle_image' => $row->rectangle_image,
                    'is_active' => $row->is_active,
                ];
            })->values();

        return response()->json($partners);
    }
}
