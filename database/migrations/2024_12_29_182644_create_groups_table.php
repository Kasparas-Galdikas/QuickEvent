<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration
{
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Group name
            $table->text('description'); // Group description
            $table->string('location'); // Group location
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // The user who created the group
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('groups');
    }
}

