<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventTopicTable extends Migration
{
    public function up()
    {
        Schema::create('event_topic', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade'); // Foreign key to events
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade'); // Foreign key to topics
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_topic');
    }
}

