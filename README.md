# 🐱 HNG13 Stage 0 — Laravel 11 `/api/me` Endpoint

A small REST API that returns profile information plus a random cat fact from the Cat Fact API (https://catfact.ninja/fact). Built in Laravel 11 (API mode) with JSON responses, ISO 8601 UTC timestamps, rate limiting and graceful error handling.

---

## 🚀 Endpoint

### GET `/api/me`

Success (200)

```json
{
  "status": "success",
  "user": {
    "email": "yiranubari4@gmail.com",
    "name": "Yiranubari Maamaa",
    "stack": "Laravel 11 / PHP"
  },
  "timestamp": "2025-10-16T10:03:22Z",
  "fact": "Cats sleep for 70% of their lives."
}
```

External API failure (503)

```json
{
  "status": "error",
  "message": "Failed to fetch cat fact. Please try again later."
}
```

Too many requests (429)

```json
{
  "status": "error",
  "message": "Too many requests. Please slow down and try again later."
}
```

Quick curl example:

```bash
curl -sS http://127.0.0.1:8000/api/me | jq
```

---

## 🗂️ Project Structure

```
app/
├─ Http/Controllers/ProfileController.php
└─ Services/CatFactService.php
routes/
└─ api.php
```

---

## ⚙️ Setup

Clone & install

```bash
git clone https://github.com/<your-repo>.git
cd <your-repo>
composer install
cp .env.example .env
php artisan key:generate
```

Environment (.env) — adjust as needed:

```
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
CATFACT_API_URL=https://catfact.ninja/fact
CACHE_STORE=file
SESSION_DRIVER=file
```

Run

```bash
php artisan serve
# Visit: http://127.0.0.1:8000/api/me
```

---

## 🧠 Notes & Features

- Uses a dedicated CatFactService to encapsulate external API calls and error handling.
- Returns HTTP 503 when the Cat Fact API fails (configurable/strict mode).
- Rate limiting applied (example: 60 requests/minute). Adjust in `RouteServiceProvider` / middleware as needed.
- Timestamps are ISO 8601 in UTC.
- Minimal dependencies for easy local setup.

---

## 🌍 Live Demo

Base URL (example):

```
https://hng13-stage0.pxxl.click/api/me
```
