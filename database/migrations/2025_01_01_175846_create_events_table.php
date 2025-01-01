<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('title'); // Event title
            $table->date('event_date'); // Event date
            $table->time('event_time'); // Event time
            $table->integer('duration'); // Duration in minutes
            $table->text('description'); // Event description
            $table->string('location'); // Event location
            $table->string('image_path')->nullable(); // Optional image path for the event
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
}
