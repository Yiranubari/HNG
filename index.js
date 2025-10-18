const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "HNG Stage 0 API - Profile Endpoint",
    available_endpoints: {
      "GET /me": "Returns profile info with cat fact",
    },
  });
});

// Main endpoint
app.get("/me", async (req, res) => {
  try {
    console.log("Fetching cat fact...");
    const catFactResponse = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000,
    });

    const response = {
      status: "success",
      user: {
        email: "yiranubari4@gmail.com",
        name: "Yiranubari Maamaa",
        stack: "Node.js/Express",
      },
      timestamp: new Date().toISOString(),
      fact: catFactResponse.data.fact,
    };

    console.log("Success:", response);
    res.json(response);
  } catch (error) {
    console.log("Cat API failed, using fallback");
    const fallbackResponse = {
      status: "success",
      user: {
        email: "yiranubari4@gmail.com",
        name: "Yiranubari Maamaa",
        stack: "Node.js/Express",
      },
      timestamp: new Date().toISOString(),
      fact: "Cats can jump up to 6 times their height!",
    };

    res.json(fallbackResponse);
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Test endpoint: http://0.0.0.0:${PORT}/me`);
});
