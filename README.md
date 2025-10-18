# Profile Endpoint API

A lightweight RESTful API built with Node.js and Express that provides a single dynamic endpoint returning profile information along with random cat facts from an external API.

## Features

- ✅ Single `GET /me` endpoint with dynamic content
- ✅ Real-time cat facts fetched from external API (no caching)
- ✅ ISO 8601 timestamp generation
- ✅ Security headers via Helmet
- ✅ CORS support for cross-origin requests
- ✅ Robust error handling with timeouts
- ✅ Request logging
- ✅ Graceful fallback on API failures

## Prerequisites

- **Node.js v22 or later** (required for native `fetch` support)
- **npm** (Node Package Manager)

You can verify your Node.js version with:
```bash
node --version
```

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd profile-endpoint
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - `express` - Fast, minimalist web framework for Node.js
   - `dotenv` - Loads environment variables from `.env` file
   - `cors` - Express middleware to enable Cross-Origin Resource Sharing
   - `helmet` - Secures Express apps by setting various HTTP headers

## Setup

1. **Create a `.env` file** in the project root by copying from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables** in the `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   USER_EMAIL=yiranubari4@gmail.com
   USER_NAME=Yiranubari Maamaa
   USER_STACK=Node.js/Express
   CAT_API_URL=https://catfact.ninja/fact
   CAT_API_TIMEOUT=5000
   ```

### Environment Variables Explanation

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port number for the server to listen on | `3000` |
| `NODE_ENV` | Environment mode (development/production) | `development` |
| `USER_EMAIL` | Your email address | Required |
| `USER_NAME` | Your full name | Required |
| `USER_STACK` | Your technology stack | Required |
| `CAT_API_URL` | External API endpoint for cat facts | `https://catfact.ninja/fact` |
| `CAT_API_TIMEOUT` | Timeout for cat API requests (milliseconds) | `5000` |

## Running the Application

Start the server with:
```bash
npm start
```

You should see output like:
```
==================================================
🚀 Server is running on http://localhost:3000
📝 Environment: development
🐱 Cat API: https://catfact.ninja/fact
⏱️  API Timeout: 5000ms
==================================================

Ready to serve requests at GET /me
```

## Testing the Endpoint

### Using curl
```bash
curl http://localhost:3000/me
```

### Using curl with headers visible
```bash
curl -i http://localhost:3000/me
```

### Using a web browser
Simply navigate to:
```
http://localhost:3000/me
```

### Expected Response

**Status Code:** `200 OK`

**Headers:**
- `Content-Type: application/json; charset=utf-8`
- `Access-Control-Allow-Origin: *` (from CORS middleware)
- Security headers from Helmet (X-Content-Type-Options, X-Frame-Options, etc.)
- **Note:** `X-Powered-By` header is removed by Helmet for security

**Response Body:**
```json
{
  "status": "success",
  "user": {
    "email": "yiranubari4@gmail.com",
    "name": "Yiranubari Maamaa",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-18T14:30:45.123Z",
  "fact": "Cats have 32 muscles in each ear."
}
```

**Key Points:**
- The `timestamp` field updates on every request with the current UTC time in ISO 8601 format
- The `fact` field contains a different cat fact on each request (fetched live, not cached)
- If the cat API fails or times out, the fallback fact will be: `"The cat is mysterious today"`

## API Documentation

### `GET /me`

Returns profile information along with a dynamically fetched cat fact.

**Request:**
- Method: `GET`
- URL: `/me`
- No request body or parameters required

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"success"` |
| `user` | object | User profile information |
| `user.email` | string | User's email address |
| `user.name` | string | User's full name |
| `user.stack` | string | User's technology stack |
| `timestamp` | string | Current UTC timestamp in ISO 8601 format |
| `fact` | string | Random cat fact from external API |

**Status Codes:**
- `200 OK` - Request successful (even if cat API fails, fallback is used)
- `404 Not Found` - Route does not exist

## Dependencies

### Production Dependencies

1. **express** (`^4.18.2`)
   - Fast, unopinionated web framework for Node.js
   - Handles routing, middleware, and HTTP requests/responses

2. **dotenv** (`^16.3.1`)
   - Zero-dependency module that loads environment variables from `.env` file
   - Keeps sensitive configuration out of source code

3. **cors** (`^2.8.5`)
   - Express middleware for enabling Cross-Origin Resource Sharing
   - Allows the API to be accessed from different domains (e.g., frontend on different port)

4. **helmet** (`^7.1.0`)
   - Helps secure Express apps by setting various HTTP headers
   - Removes `X-Powered-By`, adds `X-Content-Type-Options`, `X-Frame-Options`, etc.
   - Protects against common web vulnerabilities

## Project Structure

```
profile-endpoint/
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment file (template)
├── .gitignore          # Git ignore rules
├── index.js            # Main application file
├── package.json        # Project metadata and dependencies
└── README.md           # This file
```

## Technical Implementation Details

### Modern Fetch API (Node.js v22+)
This project uses Node.js's native `fetch()` API instead of external libraries like `axios` or `node-fetch`. This is available natively in Node.js v22 and later.

### Timeout Handling with AbortController
The application uses the modern `AbortController` pattern to implement request timeouts:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), CAT_API_TIMEOUT);
await fetch(url, { signal: controller.signal });
```

This ensures that if the external cat API is slow or unresponsive, the request is cancelled after the configured timeout period.

### Error Handling Strategy
- All errors are caught and logged
- The API always returns HTTP 200 with valid JSON
- On external API failures, a fallback cat fact is used: `"The cat is mysterious today"`
- This ensures the endpoint is reliable even when external dependencies fail

### Security Best Practices
- **Helmet**: Sets security headers to protect against common vulnerabilities
- **CORS**: Properly configured for cross-origin requests
- **Environment Variables**: Sensitive data kept in `.env` file (excluded from git)
- **Error Messages**: Generic error messages in responses (detailed logs server-side only)

## Deployment

### Environment Variables on Hosting Platforms

When deploying to platforms like Heroku, Vercel, Railway, or AWS, set these environment variables in your platform's dashboard:

**Required:**
- `USER_EMAIL`
- `USER_NAME`
- `USER_STACK`

**Optional (have defaults):**
- `PORT` (often set automatically by the platform)
- `NODE_ENV` (set to `production`)
- `CAT_API_URL`
- `CAT_API_TIMEOUT`

### Deployment Checklist

- ✅ `.env` is in `.gitignore` (never commit secrets)
- ✅ `.env.example` is committed (shows required variables)
- ✅ All environment variables set on hosting platform
- ✅ `node_modules/` is in `.gitignore`
- ✅ `package.json` includes `start` script
- ✅ Node.js version is v22 or later (set in `engines` field of `package.json`)

### Example Deployment Commands

For platforms that use start scripts:
```bash
npm install
npm start
```

The server will automatically use the `PORT` environment variable provided by most hosting platforms.

## Logging

The application logs:
- ✅ Server startup information
- ✅ Incoming requests to `/me` endpoint
- ✅ Successful cat fact fetches
- ✅ API failures and timeouts
- ✅ Response completion

Example log output:
```
[2025-10-18T14:30:45.123Z] GET /me - Request received
Fetching cat fact from https://catfact.ninja/fact...
Cat fact fetched successfully
[2025-10-18T14:30:45.456Z] Response sent successfully
```

## Testing Checklist

- ✅ Server starts without errors
- ✅ `GET /me` returns `200 OK`
- ✅ Response has correct `Content-Type: application/json` header
- ✅ `X-Powered-By` header is removed (Helmet working)
- ✅ `Access-Control-Allow-Origin` header is present (CORS working)
- ✅ All required fields present in response
- ✅ Timestamp is in ISO 8601 format
- ✅ Cat fact changes on each request
- ✅ Error handling works (test by using invalid CAT_API_URL)
- ✅ Timeout handling works (test with very short CAT_API_TIMEOUT)

## Troubleshooting

### Port Already in Use
If you see `EADDRINUSE` error, the port is already taken. Either:
- Stop the process using that port
- Change `PORT` in `.env` to a different number (e.g., `3001`)

### Cat API Timeout
If you see timeout errors:
- Check your internet connection
- Increase `CAT_API_TIMEOUT` in `.env`
- The API will use the fallback fact on timeout

### Module Not Found
If you see module errors:
- Ensure you ran `npm install`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Node Version Error
If native `fetch` is not available:
- Ensure you're using Node.js v22 or later
- Run `node --version` to check
- Update Node.js if necessary

## License

ISC

## Author

Built following best practices for RESTful API development with Node.js and Express.

