<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\SeminarController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MarketingCampaignController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\SpecialtyController; // Added SpecialtyController
use App\Http\Controllers\ConferenceController; // Added ConferenceController
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
});

require __DIR__.'/auth.php';