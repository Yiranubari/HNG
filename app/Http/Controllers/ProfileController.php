<?php

namespace App\Http\Controllers;

use App\Services\CartFactService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    protected CartFactService $cartFactService;

    public function __construct(CartFactService $cartFactService)
    {
        $this->cartFactService = $cartFactService;
    }


    public function me()
    {
        //? Fetch Cat (Service return fallback string if an error occurs)
        $catFactResponse = $this->cartFactService->fetchFact();

        // dd($catFactResponse);
        if ($catFactResponse->status === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $catFactResponse->message ?? 'Could not fetch fact at the moment',
            ], $catFactResponse->code);
        }

        //? time stamp in current UTC IsO 8601 format
        $timestamp = now()->utc()->toIso8601String();

        //? prepare payload
        $payLoad = [
            'status' => 'success',
            'user' => [
                'email' => 'yiranubari4@gmail.com',
                'name' => 'Yiranubari Maamaa',
                'stack' => 'Laravel 11 / PHP',
            ],
            'fact' => $catFactResponse->fact,
            'timestamp' => $timestamp,
        ];

        //? return success response
        return response()->json($payLoad, 200, [
            'Content-Type' => 'application/json'
        ]);
    }
}
