<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateEventsTableAddGroupId extends Migration
{
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade'); // Link event to a group
        });
    }

    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropColumn('group_id');
        });
    }
}
