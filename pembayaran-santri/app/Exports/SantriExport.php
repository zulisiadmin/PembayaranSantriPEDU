<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SantriExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return User::where('role', 'santri')->select(
            'name', 'email', 'kelas', 'status', 'no_hp', 'no_kts', 'nik', 'no_kk', 'alamat'
        )->get();
    }

    public function headings(): array
    {
        return [
            'Nama', 'Email', 'Kelas', 'Status', 'No HP', 'No KTS', 'NIK', 'No KK', 'Alamat',
        ];
    }
}
