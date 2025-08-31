const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  try {
    const response = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: req.body.q,
        source: req.body.source,
        target: req.body.target,
        format: "text",
        api_key: "YOUR_API_KEY_HERE", // Replace with your actual key
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Translation failed", details: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
