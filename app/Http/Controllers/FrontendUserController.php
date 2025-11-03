<?php

namespace App\Http\Controllers;

use App\Models\FrontendUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class FrontendUserController extends Controller
{
    /**
     * Display a listing of instructors.
     */
    public function index()
    {
        $users = FrontendUser::where('userType', 'instructor')
            ->orderBy('user_no', 'desc')
            ->paginate(10);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user - Step 1.
     */
    public function create()
    {
        return Inertia::render('Users/Step1', [
            'user' => null,
        ]);
    }

    /**
     * Store step 1 data and redirect to step 2.
     */
    public function storeStep1(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:10',
            'user_Fname' => 'required|string|max:255',
            'user_Lname' => 'required|string|max:255',
            'user_email' => 'required|email|unique:frontend_users,user_email',
            'user_phone' => 'nullable|string|max:20',
            'gender' => 'required|in:male,female',
            'userType' => 'required|in:user,instructor',
            'profession' => 'nullable|string|max:255',
            'custom_url' => 'nullable|string|max:255|unique:frontend_users,custom_url',
            'specialities' => 'nullable|string|max:255',
            'userLocality' => 'nullable|string|max:255',
            'userCountry' => 'nullable|string|max:255',
            'userState' => 'nullable|string|max:255',
            'elivatorPitch' => 'nullable|string|max:500',
            'user_img' => 'nullable|string|max:255',
        ]);

        // Generate user ID if not provided
        if (empty($validated['user_id'])) {
            $validated['user_id'] = $this->generateUserId();
        }

        // Generate full name
        $validated['user_FullName'] = $validated['user_Fname'] . ' ' . $validated['user_Lname'];

        // Generate username from full name if not provided
        if (empty($validated['username'])) {
            $validated['username'] = Str::slug($validated['user_FullName']);
        }

        // Set default status
        $validated['userStatus'] = 'new';

        // Store step 1 data in session
        $request->session()->put('user_registration_step1', $validated);

        return redirect()->route('users.create.step2');
    }

    /**
     * Show step 2 form.
     */
    public function createStep2(Request $request)
    {
        $step1Data = $request->session()->get('user_registration_step1');

        if (!$step1Data) {
            return redirect()->route('users.create');
        }

        // Get existing education and work history if editing
        $userId = $step1Data['user_id'] ?? null;
        $education = [];
        $workHistory = [];

        if ($userId) {
            $education = DB::table('zc_education')
                ->where('u_id', $userId)
                ->where('status', 'active')
                ->get();

            $workHistory = DB::table('zc_work as w')
                ->leftJoin('user_specialty as s', 'w.speciality', '=', 's.no')
                ->where('w.u_id', $userId)
                ->where('w.status', 'active')
                ->select('w.*', 's.title as speciality_title')
                ->get();
        }

        // Get specialities for work history form
        $specialities = DB::table('user_specialty')
            ->where('status', 'on')
            ->select('no', 'title')
            ->get();

        return Inertia::render('Users/Step2', [
            'step1Data' => $step1Data,
            'education' => $education,
            'workHistory' => $workHistory,
            'specialities' => $specialities,
        ]);
    }

    /**
     * Store step 2 data and redirect to step 3.
     */
    public function storeStep2(Request $request)
    {
        $step1Data = $request->session()->get('user_registration_step1');

        if (!$step1Data) {
            return redirect()->route('users.create');
        }

        // Store step 2 data in session
        $step2Data = [
            'education' => $request->input('education', []),
            'workHistory' => $request->input('workHistory', []),
        ];

        $request->session()->put('user_registration_step2', $step2Data);

        return redirect()->route('users.create.step3');
    }

    /**
     * Show step 3 form.
     */
    public function createStep3(Request $request)
    {
        $step1Data = $request->session()->get('user_registration_step1');
        $step2Data = $request->session()->get('user_registration_step2');

        if (!$step1Data) {
            return redirect()->route('users.create');
        }

        return Inertia::render('Users/Step3', [
            'step1Data' => $step1Data,
            'step2Data' => $step2Data,
        ]);
    }

    /**
     * Finalize user registration.
     */
    public function storeStep3(Request $request)
    {
        $step1Data = $request->session()->get('user_registration_step1');
        $step2Data = $request->session()->get('user_registration_step2');

        if (!$step1Data) {
            return redirect()->route('users.create');
        }

        // Set status to active
        $step1Data['userStatus'] = 'active';

        // Create the user
        $user = FrontendUser::create($step1Data);

        $userId = $step1Data['user_id'];

        // Create user details record
        DB::table('user_details')->insert([
            'userID' => $userId,
            'user_country' => $step1Data['userCountry'] ?? '',
            'Locality' => $step1Data['userLocality'] ?? '',
            'user_pincode' => '',
            'user_city' => $step1Data['userLocality'] ?? '',
            'user_state' => $step1Data['userState'] ?? '',
            'About_user' => '',
            'fb_link' => '',
            'gp_link' => '',
            'linkedin_link' => '',
            'pint_link' => '',
            'twt_link' => '',
            'user_speciality' => $step1Data['specialities'] ?? '',
        ]);

        // Create education records
        if (isset($step2Data['education']) && is_array($step2Data['education'])) {
            foreach ($step2Data['education'] as $edu) {
                DB::table('zc_education')->insert([
                    'u_id' => $userId,
                    'degree' => $edu['degree'] ?? '',
                    'university' => $edu['university'] ?? '',
                    'completed_in' => $edu['completed_in'] ?? '',
                    'speciality' => $edu['speciality'] ?? '',
                    'status' => 'active',
                ]);
            }
        }

        // Create work history records
        if (isset($step2Data['workHistory']) && is_array($step2Data['workHistory'])) {
            foreach ($step2Data['workHistory'] as $work) {
                DB::table('zc_work')->insert([
                    'u_id' => $userId,
                    'clinic_name' => $work['clinic_name'] ?? '',
                    'clinic_locality' => $work['clinic_locality'] ?? '',
                    'designaion' => $work['designation'] ?? '',
                    'speciality' => $work['speciality'] ?? '',
                    'status' => 'active',
                ]);
            }
        }

        // Clear session data
        $request->session()->forget(['user_registration_step1', 'user_registration_step2']);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(FrontendUser $user)
    {
        return Inertia::render('Users/Step1', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, FrontendUser $user)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:10',
            'user_Fname' => 'required|string|max:255',
            'user_Lname' => 'required|string|max:255',
            'user_email' => 'required|email|unique:frontend_users,user_email,' . $user->user_no . ',user_no',
            'user_phone' => 'nullable|string|max:20',
            'gender' => 'required|in:male,female',
            'userType' => 'required|in:user,instructor',
            'profession' => 'nullable|string|max:255',
            'custom_url' => 'nullable|string|max:255|unique:frontend_users,custom_url,' . $user->user_no . ',user_no',
            'specialities' => 'nullable|string|max:255',
            'userLocality' => 'nullable|string|max:255',
            'userCountry' => 'nullable|string|max:255',
            'userState' => 'nullable|string|max:255',
            'elivatorPitch' => 'nullable|string|max:500',
            'user_img' => 'nullable|string|max:255',
        ]);

        // Generate full name
        $validated['user_FullName'] = $validated['user_Fname'] . ' ' . $validated['user_Lname'];

        // Generate username from full name if not provided
        if (empty($validated['username'])) {
            $validated['username'] = Str::slug($validated['user_FullName']);
        }

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(FrontendUser $user)
    {
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Generate a unique user ID.
     */
    private function generateUserId()
    {
        return 'user_' . Str::random(10);
    }
}