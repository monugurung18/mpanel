<?php

use App\Http\Controllers\{DashboardController, FrontendUserController, CertificateVerificationController, BusinessPageController, PageViewController, SpecialtyController, ConferenceController};
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\SeminarController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MarketingCampaignController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\SurveyController; // Added SurveyController
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Episode Management Routes
    Route::resource('episodes', EpisodeController::class);
    Route::post('/update-episode/{id}', [EpisodeController::class, 'updateEpisode'])->name('episodes.updates');
    //
    Route::get('/api/speakers', [CommonController::class, 'GetSpeaker'])->name('api.speakers');
    
    Route::get('/api/tags', [PostController::class, 'getTags'])->name('api.tags');
    Route::get('/api/specialities', [CommonController::class, 'getSpecialities'])->name('api.specialities');
    Route::get('/api/education-partners', [CommonController::class, 'apiEducationPartners']);
    
    // Seminar Management Routes
    Route::resource('seminars', SeminarController::class);
    Route::post('/update-seminar/{id}', [SeminarController::class, 'updateSeminar'])->name('seminars.updates');
    Route::get('/api/seminar-speakers', [SeminarController::class, 'getSpeakers'])->name('api.seminar-speakers');
    
    // Post Management Routes
    Route::resource('posts', PostController::class);
    Route::post('/update-post/{id}', [PostController::class, 'updatePost'])->name('posts.updates');
    
    // Marketing Campaign Routes
    Route::resource('marketing-campaign', MarketingCampaignController::class);
    Route::post('/update-marketing-campaign/{id}', [MarketingCampaignController::class, 'updateMarketingCampaign'])->name('marketing-campaigns.updates');
    Route::get('/api/get-marketing-campaign-target', [MarketingCampaignController::class, 'getCampaignTargets'])->name('api.marketing-campaign-targets');
    
    // Tag Management Routes
    Route::resource('tags', TagController::class);
    Route::post('/check-tag', [TagController::class, 'checkTag'])->name('tags.check');
    
    // Specialty Management Routes
    Route::resource('specialties', SpecialtyController::class);
    Route::post('/update-specialty/{id}', [SpecialtyController::class, 'updateSpecialty'])->name('specialties.updates');
    
    // Conference Management Routes
    Route::resource('conferences', ConferenceController::class);
    
    // Survey Management Routes
    Route::resource('surveys', SurveyController::class);
    
    // Page View Analytics Routes
    Route::get('/page-views', [PageViewController::class, 'index'])->name('page-views.index');
    Route::get('/page-views/data', [PageViewController::class, 'getData'])->name('page-views.data');
    
    // Business Pages Routes
    Route::resource('business-pages', BusinessPageController::class);
    Route::post('/update-business-page/{id}', [BusinessPageController::class, 'updateBusinessPage'])->name('business-pages.updates');
    
    // Certificate Verification Routes
    Route::get('/certificate-verification', [CertificateVerificationController::class, 'index'])->name('certificate-verification.index');
    Route::post('/certificate-verification/update-status', [CertificateVerificationController::class, 'updateStatus'])->name('certificate-verification.update-status');
    
    // Frontend Users Routes
    Route::get('users/create/step1', [FrontendUserController::class, 'create'])->name('users.create');
    Route::post('users/create/step1', [FrontendUserController::class, 'storeStep1'])->name('users.store.step1');
    Route::get('users/create/step2', [FrontendUserController::class, 'createStep2'])->name('users.create.step2');
    Route::post('users/create/step2', [FrontendUserController::class, 'storeStep2'])->name('users.store.step2');
    Route::get('users/create/step3', [FrontendUserController::class, 'createStep3'])->name('users.create.step3');
    Route::post('users/create/step3', [FrontendUserController::class, 'storeStep3'])->name('users.store.step3');
    Route::resource('users', FrontendUserController::class)->except(['create', 'store']);
});

require __DIR__.'/auth.php';