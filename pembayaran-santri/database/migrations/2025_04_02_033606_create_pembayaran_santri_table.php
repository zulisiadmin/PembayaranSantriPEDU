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
        Schema::create('pembayaran_santri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tagihan_id')->constrained('tagihans')->onDelete('cascade');
            $table->string('status')->default('pending');
            $table->datetime('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->integer('amount_paid')->nullable();
            $table->string('external_id')->nullable();
            $table->string('invoice_id')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_santri');
    }
};
