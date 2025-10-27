<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Only create if table doesn't exist
        if (!Schema::hasTable('zc_mindpress_users')) {
            Schema::create('zc_mindpress_users', function (Blueprint $table) {
                $table->id('no');
                $table->string('username')->unique();
                $table->string('password');
                $table->string('userid')->nullable();
                $table->string('userlevel')->default('user');
                $table->string('email')->unique();
                $table->timestamp('timestamp')->nullable();
                $table->string('usser_Type')->default('admin');
                $table->string('action')->default('active');
                $table->string('mobile_no')->nullable();
                $table->string('display_name')->nullable();
                $table->timestamp('user_registered')->nullable();
                $table->string('image_url')->nullable();
                $table->string('frontend_users')->nullable();
                $table->unsignedBigInteger('frontend_users_id')->nullable();
                $table->string('remember_token', 100)->nullable();
                $table->timestamp('email_verified_at')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zc_mindpress_users');
    }
};
