# HNG Stage 0 - Profile API

A simple Node.js/Express API that returns profile information with dynamic cat facts from the Cat Facts API.

## 🚀 API Endpoint

**GET** `/me`

### Response Format

```json
{
  "status": "success",
  "user": {
    "email": "your-email@example.com",
    "name": "Your Full Name",
    "stack": "Node.js/Express"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "fact": "Random cat fact from Cat Facts API"
}
```

📋 Prerequisites
Node.js (version 14 or higher)

npm (comes with Node.js)

🛠️ Local Development
Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/Yiranubari/HNG.git
cd HNG
```

2. Install dependencies

```bash
npm install
```

3. Run the Application

```bash
# Development
npm run dev

# Or production
npm start
```

4. Test the API
   Open your browser or use curl:

```bash
curl http://localhost:3000/me
```

📦 Dependencies
Production Dependencies:
express: Web framework for Node.js

cors: Enable Cross-Origin Resource Sharing

axios: HTTP client for making API requests

Install all dependencies:

```bash
npm install
```

⚙️ Environment Variables
No environment variables are required for basic functionality. The application will:

Use port 3000 by default locally

Use the port provided by Railway in production

Automatically handle CORS

Optional Environment Variables

```bash
PORT=3000  # Set custom port (optional)
```

🌐 Deployment
This API is deployed on Railway.app. The live endpoint is available at:
https://your-app-name.up.railway.app/me

🐛 Error Handling
If the Cat Facts API is unavailable, a fallback cat fact is returned

Proper timeout handling for external API calls (5 seconds)

Always returns 200 status with consistent response structure

📞 API Documentation
Method: GET

URL: /me

Content-Type: application/json

Response: Always returns JSON with the specified structure
