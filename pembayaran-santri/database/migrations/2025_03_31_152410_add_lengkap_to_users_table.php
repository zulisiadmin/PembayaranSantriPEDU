<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_kts')->nullable();
            $table->string('nik')->nullable();
            $table->string('no_kk')->nullable();
            $table->text('alamat')->nullable();
            $table->string('kelas')->nullable();
            $table->string('status')->nullable(); // kerja/mahasiswa/smk
            $table->string('no_hp')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'no_kts', 'nik', 'no_kk', 'alamat',
                'kelas', 'status', 'no_hp'
            ]);
        });
    }
    
};
