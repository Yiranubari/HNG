const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "HNG Stage 0 API is live!",
    endpoint: "GET /me",
  });
});

// Main endpoint
app.get("/me", async (req, res) => {
  try {
    console.log("📞 Fetching cat fact...");
    const catResponse = await axios.get("https://catfact.ninja/fact", {
      timeout: 10000,
    });

    const response = {
      status: "success",
      user: {
        email: "yiranubari4@gmail.com",
        name: "Yiranubari Maamaa",
        stack: "Node.js/Express",
      },
      timestamp: new Date().toISOString(),
      fact: catResponse.data.fact,
    };

    console.log("✅ Success:", response.user.name);
    res.json(response);
  } catch (error) {
    console.log("❌ Cat API failed, using fallback");
    const fallbackResponse = {
      status: "success",
      user: {
        email: "yiranubari4@gmail.com",
        name: "Yiranubari Maamaa",
        stack: "Node.js/Express",
      },
      timestamp: new Date().toISOString(),
      fact: "A group of cats is called a clowder.",
    };

    res.json(fallbackResponse);
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://0.0.0.0:${PORT}`);
});
