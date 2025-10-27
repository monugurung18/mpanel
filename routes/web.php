<?php

use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\SeminarController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/api/speakers', [EpisodeController::class, 'getSpeakers'])->name('api.speakers');
    
    // Seminar Management Routes
    Route::resource('seminars', SeminarController::class);
    Route::get('/api/seminar-speakers', [SeminarController::class, 'getSpeakers'])->name('api.seminar-speakers');
});

require __DIR__.'/auth.php';
