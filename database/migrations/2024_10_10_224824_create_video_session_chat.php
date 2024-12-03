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
        Schema::create('video_session_chat_messages', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->unsignedBigInteger('user_id');
            $table->string("chat_name_color")->default("#000000");
            $table->text('from');
            $table->text('message');
            $table->timestamps();
            $table->foreign('session_id')->references('session_id')->on('video_session')->onDelete('cascade');  // Referencing session_id in video_session table
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_session_chat_messages');
    }
};
