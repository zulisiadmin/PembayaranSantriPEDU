<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembayaranSantri extends Model
{
    protected $table = 'pembayaran_santri';
    protected $fillable = [
        'user_id', 'tagihan_id', 'status', 'paid_at',
        'payment_method', 'amount_paid', 'external_id', 'invoice_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function tagihan() {
        return $this->belongsTo(Tagihan::class);
    }
}

