<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('education_partners', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 255);
            $table->string('square_image', 500)->nullable();
            $table->string('rectangle_image', 500)->nullable();
            $table->tinyInteger('is_active')->default(1);
            $table->string('created_by', 200)->nullable();
            $table->dateTime('created_on')->useCurrent();
            $table->string('created_ip', 100)->nullable();
            $table->string('modified_by', 200)->nullable();
            $table->dateTime('modified_on')->useCurrent()->useCurrentOnUpdate();
            $table->string('modified_ip', 100)->nullable();
        });
    }
    public function down()
    {
        Schema::dropIfExists('education_partners');
    }
};
