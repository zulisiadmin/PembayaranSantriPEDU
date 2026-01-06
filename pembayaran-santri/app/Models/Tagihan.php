<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'nominal',
        'awal_pembayaran',
        'akhir_pembayaran',
        'surat'
    ];

    public function kelas()
    {
        return $this->hasMany(\App\Models\KelasTagihan::class);
    }
    
    public function pembayaran()
    {
        return $this->hasMany(\App\Models\PembayaranSantri::class);
    }
    

    
}
