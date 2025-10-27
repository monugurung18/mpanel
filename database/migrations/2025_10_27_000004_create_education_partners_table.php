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
        // Check if table already exists before creating
        if (!Schema::hasTable('education_partners')) {
            Schema::create('education_partners', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name', 255);
                $table->string('square_image', 500)->nullable();
                $table->string('rectangle_image', 500)->nullable();
                $table->boolean('is_active')->default(1);
                $table->string('created_by', 200)->nullable();
                $table->datetime('created_on')->useCurrent();
                $table->string('created_ip', 100)->nullable();
                $table->string('modified_by', 200)->nullable();
                $table->datetime('modified_on')->useCurrent()->useCurrentOnUpdate();
                $table->string('modified_ip', 100)->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_partners');
    }
};
