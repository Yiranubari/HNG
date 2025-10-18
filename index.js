// Import required dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_NAME = process.env.USER_NAME;
const USER_STACK = process.env.USER_STACK;
const CAT_API_URL = process.env.CAT_API_URL || 'https://catfact.ninja/fact';
const CAT_API_TIMEOUT = parseInt(process.env.CAT_API_TIMEOUT || '5000', 10);

// Apply security middleware - sets various HTTP headers for security
// This removes X-Powered-By and adds headers like X-Content-Type-Options, X-Frame-Options, etc.
app.use(helmet());

// Enable CORS - allows cross-origin requests from browsers
// This sets Access-Control-Allow-Origin headers
app.use(cors());

/**
 * Fetches a cat fact from the external API with timeout handling
 * @returns {Promise<string>} The cat fact or fallback message
 */
async function fetchCatFact() {
  // Create an AbortController to handle request timeout
  // This is the modern Node.js v22 way to cancel fetch requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, CAT_API_TIMEOUT);

  try {
    console.log(`Fetching cat fact from ${CAT_API_URL}...`);
    
    // Make HTTP request using native fetch (available in Node.js v22+)
    const response = await fetch(CAT_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    // Clear the timeout since request completed
    clearTimeout(timeoutId);

    // Check if response was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    
    if (data && data.fact) {
      console.log('Cat fact fetched successfully');
      return data.fact;
    } else {
      throw new Error('Invalid response format from cat API');
    }
  } catch (error) {
    // Clear timeout in case of error
    clearTimeout(timeoutId);

    // Log the error for debugging
    if (error.name === 'AbortError') {
      console.error(`Cat API request timed out after ${CAT_API_TIMEOUT}ms`);
    } else {
      console.error('Failed to fetch cat fact:', error.message);
    }

    // Return fallback fact on any error
    return 'The cat is mysterious today';
  }
}

/**
 * GET /me endpoint
 * Returns profile information along with a dynamic cat fact
 */
app.get('/me', async (req, res) => {
  // Log incoming request
  console.log(`[${new Date().toISOString()}] GET /me - Request received`);

  try {
    // Generate current UTC timestamp in ISO 8601 format
    const timestamp = new Date().toISOString();

    // Fetch cat fact (dynamically on every request, no caching)
    const catFact = await fetchCatFact();

    // Build response object with exact required structure
    const response = {
      status: 'success',
      user: {
        email: USER_EMAIL,
        name: USER_NAME,
        stack: USER_STACK
      },
      timestamp: timestamp,
      fact: catFact
    };

    // Return JSON response with 200 OK status
    // res.json() automatically sets Content-Type: application/json
    res.status(200).json(response);

    console.log(`[${timestamp}] Response sent successfully`);
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error processing /me request:', error);

    // Even on error, return 200 with fallback data
    const response = {
      status: 'success',
      user: {
        email: USER_EMAIL,
        name: USER_NAME,
        stack: USER_STACK
      },
      timestamp: new Date().toISOString(),
      fact: 'The cat is mysterious today'
    };

    res.status(200).json(response);
  }
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🐱 Cat API: ${CAT_API_URL}`);
  console.log(`⏱️  API Timeout: ${CAT_API_TIMEOUT}ms`);
  console.log('='.repeat(50));
  console.log(`\nReady to serve requests at GET /me\n`);
});

