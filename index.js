const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/me", async (req, res) => {
  try {
    // Fetch cat fact from external API
    const catFactResponse = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000,
    });

    const response = {
      status: "success",
      user: {
        email: "yiranubari4@gmail.com", // REPLACE WITH YOUR EMAIL
        name: "Yiranubari Maamaa", // REPLACE WITH YOUR NAME
        stack: "Node.js/Express", // You can change this
      },
      timestamp: new Date().toISOString(),
      fact: catFactResponse.data.fact,
    };

    res.json(response);
  } catch (error) {
    // Fallback if cat API fails
    const fallbackResponse = {
      status: "success",
      user: {
        email: "yiranubari4@gmail.com",
        name: "Yiranubari Maamaa",
        stack: "Node.js/Express",
      },
      timestamp: new Date().toISOString(),
      fact: "Cats have whiskers on the backs of their front legs too!",
    };

    res.json(fallbackResponse);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
