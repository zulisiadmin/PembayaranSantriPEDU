<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelasTagihan extends Model
{
    protected $fillable = ['tagihan_id', 'kelas'];
    protected $table = 'kelas_tagihan';


    public function tagihan()
    {
        return $this->belongsTo(Tagihan::class);
    }
}
