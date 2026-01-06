<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tagihan;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();
    
        \Log::info('Xendit Webhook Payload:', $payload);
    
        $externalId = $payload['external_id'] ?? null;
        $status = $payload['status'] ?? null;
    
        if ($externalId && $status === 'PAID') {
            $parts = explode('_', $externalId); // invoice_4_8
            $tagihanId = $parts[1] ?? null;
            $userId = $parts[2] ?? null;
    
            if ($tagihanId && $userId) {
                \App\Models\PembayaranSantri::where('external_id', $externalId)->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'payment_method' => $payload['payment_method'] ?? '-',
                    'amount_paid' => $payload['paid_amount'] ?? 0,
                ]);
            }
        }
    
        return response()->json(['message' => 'Webhook processed'], 200);
    }
    
    
}
