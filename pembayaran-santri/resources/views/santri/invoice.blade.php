<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice Tagihan</title>
    <style>
        body { font-family: sans-serif; }
        h2 { text-align: center; }
        .detail { margin-top: 20px; }
    </style>
</head>
<body>
    <h2>Invoice Pembayaran Tagihan</h2>
    <div class="detail">
        <p><strong>Nama Santri:</strong> {{ $user->name }}</p>
        <p><strong>Email:</strong> {{ $user->email }}</p>
        <p><strong>Nama Tagihan:</strong> {{ $tagihan->nama }}</p>
        <p><strong>Jumlah Dibayar:</strong> Rp {{ number_format($pembayaran->amount_paid ?? $tagihan->nominal, 0, ',', '.') }}</p>
        <p><strong>Status:</strong> {{ ucfirst($pembayaran->status) }}</p>
        <p><strong>Tanggal Bayar:</strong> {{ $pembayaran->paid_at }}</p>
    </div>
</body>
</html>
