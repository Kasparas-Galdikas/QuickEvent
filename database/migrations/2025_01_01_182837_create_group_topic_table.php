<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupTopicTable extends Migration
{
    public function up()
    {
        Schema::create('group_topic', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade'); // Foreign key to groups
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade'); // Foreign key to topics
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('group_topic');
    }
}
