<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RegisterSantriController extends Controller
{
    
    public function showRegistrationForm()
    {
        return view('register-santri');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'kts'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'role'     => 'required|in:santri,admin',
        ]);

        if ($request->hasFile('kts')) {
            $filename = $request->file('kts')->store('kts', 'public');
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'kts'      => isset($filename) ? basename($filename) : null,
        ]);

        auth()->login($user);

        // Arahkan sesuai rolenya
        return $user->role === 'admin'
            ? redirect()->route('admin.dashboard')
            : redirect()->route('dashboard.santri');
    }

    //
    }

