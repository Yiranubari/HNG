<?php

namespace App\Services;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CartFactService
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.cartfact.url', env('CATFACT_API_URL'));
        $this->timeout = (int) config('services.cartfact.timeout', env('CATFACT_TIMEOUT', 5));
    }


    /*     
      * Fetch a random cat fact from the external API
     *
     * @return array|string
     */

    public function fetchFact(): array|object
    {
        try {
            //? Disable cache for this request
            Cache::flush();

            //? access cartfact api to get a fact
            $response = Http::timeout($this->timeout)
                ->get("{$this->baseUrl}?t=" . time());


            //? check if response if successfull and fact is present
            if ($response->successful() && isset($response['fact'])) {
                //? return the fact if successfull or return string error message
                return (object) [
                    'status' => 'success',
                    'fact' => $response['fact'],
                    'code' => $response->status(),
                ];
            }

            //? log error warning message if no successful response
            Log::warning("CartFactService: could not fetch fact", [
                'status' => 'error',
                'response' => $response->body(),
            ]);


            //? return error object
            return (object) [
                'status' => 'error',
                'message' => "Could not fecth fact at the moment",
                'code' => $response->status(),
            ];
        } catch (\Exception $e) {
            //? log error message for debugging
            Log::error("CartFactService: error fetching fact", [
                'code' => $e->getCode(),
                'error' => $e->getMessage(),
            ]);

            return (object) [
                'status' => 'error',
                'message' => "An error occurred while fetching fact",
                'code' => 503,
            ];
        }
    }
}