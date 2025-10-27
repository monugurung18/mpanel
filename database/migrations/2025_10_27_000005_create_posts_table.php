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
        // Check if table already exists
        if (!Schema::hasTable('post')) {
            Schema::create('post', function (Blueprint $table) {
                $table->integer('articleID', true, true)->comment('Auto increment primary key');
                $table->string('postType', 255)->charset('utf8')->collation('utf8_bin');
                $table->string('title', 200)->charset('utf8')->collation('utf8_bin');
                $table->enum('status', ['published', 'draft', 'deleted'])->charset('utf8mb4')->collation('utf8mb4_bin')->default('published');
                $table->longText('theContent')->charset('utf8')->collation('utf8_bin')->nullable();
                $table->longText('transcript')->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->string('videoLink', 256)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('linkType', 255)->charset('latin1')->nullable();
                $table->string('mobileVideoLink', 256)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('mobileLinkType', 255)->charset('latin1')->nullable();
                $table->string('post_date', 200)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('custom_url', 255)->charset('utf8')->nullable();
                $table->string('article_language', 200)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->integer('post_like', false, true)->nullable();
                $table->integer('post_comment', false, true)->nullable();
                $table->string('featuredThumbnail', 50)->charset('latin1')->nullable();
                $table->string('SquareThumbnail', 256)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('bannerImage', 50)->charset('latin1')->nullable();
                $table->string('metaTitle', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('metaDiscription', 200)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('metaKeywords', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('tags', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('author1', 300)->charset('utf8')->collation('utf8_bin')->default('');
                $table->string('catagory1', 100)->charset('latin1')->nullable();
                $table->string('diseaseRelations', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('searchAlias1', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('searchAlias2', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('searchAlias3', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('searchAlias4', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('author2', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('author3', 50)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('catagory2', 100)->charset('latin1')->nullable();
                $table->string('catagory3', 100)->charset('latin1')->nullable();
                $table->string('seo_pageTitle', 256)->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->text('seo_metaKeywords')->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->text('seo_metaDesctiption')->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->text('seo_metaImage')->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->string('seo_OgTitle', 256)->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->string('seo_canonical', 255)->charset('utf8mb4')->collation('utf8mb4_bin')->nullable();
                $table->integer('isFeatured', false, false)->default(0);
                $table->string('isActive', 256)->charset('utf8')->collation('utf8_bin')->default('1');
                $table->string('alt_image', 200)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('s_image1', 200)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->json('related_post_id')->nullable();
                $table->string('created_by', 200)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('created_ip', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('modified_by', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('modified_on', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('modified_ip', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('deactivated_by', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('deactivated_ip', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->string('deactivated_on', 255)->charset('utf8')->collation('utf8_bin')->nullable();
                $table->timestamp('created_on')->nullable();
                
                // Indexes
                $table->index('catagory1');
                $table->index('catagory2');
                $table->index('catagory3');
                $table->index('title');
                $table->index('author1');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post');
    }
};
