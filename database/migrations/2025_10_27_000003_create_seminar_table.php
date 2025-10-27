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
        Schema::create('seminar', function (Blueprint $table) {
            $table->integer('seminar_no', false, true)->length(100)->autoIncrement();
            $table->string('seminar_title', 250)->charset('utf8');
            $table->text('seminar_desc')->charset('utf8')->nullable();
            $table->string('seminar_auth', 245)->nullable();
            $table->string('video_url', 250)->nullable();
            $table->string('video_url2', 250)->nullable();
            $table->string('video_url3', 250)->nullable();
            $table->enum('video_status', ['live', 'deleted', 'new', 'schedule', 'archive'])->default('new');
            $table->integer('video_button', false, true)->length(10)->default(1);
            $table->enum('videoSource', ['youTube', 'faceBook', 'other', 'mp4'])->default('youTube');
            $table->text('offline_url')->nullable();
            $table->text('video_image')->nullable();
            $table->timestamp('schedule_timestamp')->nullable();
            $table->string('uploade_date', 150)->nullable();
            $table->enum('countdown', ['yes', 'no'])->default('no');
            $table->string('stream_url', 200)->nullable();
            $table->string('countdowntime', 250)->nullable();
            $table->string('sponsor_ids', 256)->nullable();
            $table->text('speakerids')->nullable();
            $table->string('custom_url', 256)->nullable();
            $table->string('seminar_speciality', 15)->nullable();
            $table->enum('isFeatured', ['0', '1'])->default('0');
            $table->enum('sand_notifaction', ['yes', 'no'])->default('no');
            $table->integer('featured', false, true)->length(11)->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->string('seo_pageTitle', 256)->nullable();
            $table->string('seo_metaKeywords', 256)->nullable();
            $table->string('seo_metaDesctiption', 256)->nullable();
            $table->string('seo_metaImage', 256)->nullable();
            $table->string('seo_OgTitle', 256)->nullable();
            $table->string('seo_canonical', 255)->nullable();
            $table->string('hasMCQ', 100)->default('0');
            $table->enum('businessSponsered', ['0', '1'])->default('0');
            $table->enum('chatBox', ['0', '1'])->default('0');
            $table->enum('questionBox', ['0', '1'])->default('0');
            $table->enum('showArchive', ['1', '0'])->default('1');
            $table->string('alt_image', 200)->nullable();
            $table->tinyInteger('is_registered')->nullable();
            $table->string('s_image1', 200)->nullable();
            $table->string('s_image2', 200)->nullable();
            $table->text('html_json')->nullable();
            $table->tinyInteger('re_attempts')->default(0);
            $table->string('seminar_type', 255)->nullable();
            $table->string('poll_link', 255)->nullable();
            $table->string('created_by', 255)->nullable();
            $table->string('created_ip', 255)->nullable();
            $table->string('modified_on', 255)->nullable();
            $table->string('modified_by', 255)->nullable();
            $table->string('modified_ip', 255)->nullable();
            $table->string('deactivated_on', 255)->nullable();
            $table->string('deactivated_by', 255)->nullable();
            $table->string('deactivated_ip', 255)->nullable();
            $table->string('shorten_url', 255)->nullable();
            $table->tinyInteger('is_custom_registration')->default(0);
            $table->json('education_partners')->nullable();
            
            $table->primary('seminar_no');
            $table->index('video_status', 'video_status_index');
            $table->index('custom_url', 'custom_url_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seminar');
    }
};
