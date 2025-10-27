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
        Schema::create('medtalks_tv', function (Blueprint $table) {
            $table->id();
            $table->string('title', 250)->charset('utf8');
            $table->text('desc')->charset('utf8');
            $table->enum('video_status', ['live', 'deleted', 'new', 'schedule', 'archive'])->default('new');
            $table->tinyInteger('is_sponsored')->nullable();
            $table->tinyInteger('is_register')->nullable();
            $table->enum('videoSource', ['youTube', 'faceBook', 'other', 'mp4'])->default('youTube');
            $table->text('video_url');
            $table->string('feature_image_banner', 200);
            $table->string('custom_url', 256)->index('custom_url_index');
            $table->text('pdf')->nullable();
            $table->string('date_time', 200)->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->string('seo_pageTitle', 256)->nullable();
            $table->string('seo_metaKeywords', 256)->nullable();
            $table->string('seo_metaDesctiption', 256)->nullable();
            $table->string('seo_metaImage', 256)->nullable();
            $table->string('seo_OgTitle', 256)->nullable();
            $table->string('seo_canonical', 255)->nullable();
            $table->string('alt_image', 200)->nullable();
            $table->string('episode_status', 200)->nullable()->index('episode_status_index');
            $table->string('episode_type', 45)->nullable()->index('episode_type_index');
            $table->string('speakers_ids', 200)->nullable();
            $table->string('episode_no', 200)->nullable();
            $table->string('speciality_id', 200)->nullable();
            $table->tinyInteger('question_required')->default(0);
            $table->string('sponserby', 200)->nullable();
            $table->tinyInteger('login_required')->default(0);
            $table->string('created_by', 200)->nullable();
            $table->string('created_ip', 200)->nullable();
            $table->string('modified_by', 200)->nullable();
            $table->string('modified_on', 200)->nullable();
            $table->string('modified_ip', 200)->nullable();
            $table->string('deactivated_by', 200)->nullable();
            $table->string('deactivated_on', 200)->nullable();
            $table->string('deactivated_ip', 200)->nullable();
            $table->text('html_json')->nullable();
            $table->tinyInteger('is_custom_registration')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medtalks_tv');
    }
};
