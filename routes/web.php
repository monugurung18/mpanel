<?php

use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\SeminarController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MarketingCampaignController;
use App\Http\Controllers\CommonController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
    
    // Seminar Management Routes
    Route::resource('seminars', SeminarController::class);
    Route::post('/update-seminar/{id}', [SeminarController::class, 'updateSeminar'])->name('seminars.updates');
    Route::get('/api/seminar-speakers', [SeminarController::class, 'getSpeakers'])->name('api.seminar-speakers');
    
    // Post Management Routes
    Route::resource('posts', PostController::class);
    Route::post('/update-post/{id}', [PostController::class, 'updatePost'])->name('posts.updates');
    
    // Marketing Campaign Routes
    Route::resource('marketing-campaign', MarketingCampaignController::class);
});

require __DIR__.'/auth.php';