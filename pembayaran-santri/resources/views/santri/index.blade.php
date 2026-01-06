@extends('layouts.santri')

@section('konten')
<div class="container">
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if(session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    {{-- Isi dashboard di sini --}}
    <h1>Dashboard Santri</h1>
@endsection