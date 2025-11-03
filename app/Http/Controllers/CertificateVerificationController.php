<?php

namespace App\Http\Controllers;

use App\Models\FrontendUser;
use App\Models\MedicalBoard;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Exception;

class CertificateVerificationController extends Controller
{
    /**
     * Display a listing of users with certificates for verification.
     */
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'unverified');
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        
        // Join with specialty and medical board tables to get related data
        $usersQuery = FrontendUser::query()
            ->join('user_specialty', 'frontend_users.specialities', '=', 'user_specialty.no')
            ->leftJoin('medical_boards', 'frontend_users.MedicalBoard', '=', 'medical_boards.boardId')
            ->where('frontend_users.reg_certificate', '!=', '')
            ->where('frontend_users.is_verified_certificate', $filter)
            ->select(
                'frontend_users.user_id as u_id',
                'frontend_users.MedicalRegistratioNo as mregno',
                'frontend_users.title as ft',
                'frontend_users.is_verified_certificate as isVerifiedCertificate',
                'frontend_users.user_phone as fp',
                'frontend_users.user_email as ue',
                'frontend_users.reg_certificate as fr',
                'frontend_users.user_FullName as funame',
                'medical_boards.medicalBoardName as mb',
                'user_specialty.title as ut'
            );
            
        $total = $usersQuery->count();
        $users = $usersQuery->skip(($page - 1) * $perPage)->take($perPage)->get();
        
        return Inertia::render('CertificateVerification/Index', [
            'users' => $users,
            'filter' => $filter,
            'pagination' => [
                'current_page' => (int) $page,
                'per_page' => (int) $perPage,
                'total' => (int) $total,
                'last_page' => (int) ceil($total / $perPage),
            ]
        ]);
    }

    /**
     * Update the verification status of a certificate.
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'uid' => 'required|string',
        ]);

        $status = $validated['type'] === 'verified' ? 'verified' : 'rejected';
        
        FrontendUser::where('user_id', $validated['uid'])
            ->update(['is_verified_certificate' => $status]);

        // Return a valid Inertia response instead of plain JSON
        return back()->with('success', 'Certificate status updated successfully.');
    }
}