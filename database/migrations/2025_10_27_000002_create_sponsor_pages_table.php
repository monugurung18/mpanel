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
        Schema::create('sponsor_pages', function (Blueprint $table) {
            $table->id();
            $table->string('type', 150)->nullable();
            $table->string('title', 200)->nullable();
            $table->text('desc')->nullable();
            $table->string('strip_banner', 150)->nullable();
            $table->string('square_banner', 150)->nullable();
            $table->string('advt_banner', 150)->nullable();
            $table->string('link', 200)->nullable();
            $table->integer('orders')->nullable();
            $table->tinyInteger('is_active')->default(1);
            $table->string('section', 255)->nullable();
            $table->string('custom_url', 100)->nullable();
            $table->string('parent_custom_url', 100)->nullable();
            $table->string('logo', 200)->nullable();
            $table->string('category', 200)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsor_pages');
    }
};
