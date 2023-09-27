const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define the CORS middleware to allow all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Define a route to proxy GET requests
app.get("/proxy", async (req, res) => {
  try {
    const apiUrl = req.query.url; // Get the API URL from the query parameter
    const authHeader = req.header("Authorization"); // Get the Authorization header from the request
    const userAgent = req.header("User-Agent"); // Get the User-Agent header from the request
    const contentType = req.header("Content-Type"); // Get the Content-Type header from the request

    // Define headers to include in the GET request to the API
    const headers = {
      Authorization: authHeader, 
      "User-Agent": userAgent, 
      "Content-Type": contentType,
    };

    // Make a GET request to the API with the specified headers
    const response = await axios.get(apiUrl, { headers });

    // Send the API response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route to proxy POST requests
app.post("/proxy", async (req, res) => {
  try {
    const apiUrl = req.body.url; // Get the API URL from the request body
    const authHeader = req.header("Authorization"); // Get the Authorization header from the request
    const userAgent = req.header("User-Agent"); // Get the User-Agent header from the request
    const contentType = req.header("Content-Type"); // Get the Content-Type header from the request

    // Define headers to include in the POST request to the API
    const headers = {
      Authorization: authHeader, 
      "User-Agent": userAgent, 
      "Content-Type": contentType,
    };

    // Make a POST request to the API with the specified headers and data
    const response = await axios.post(apiUrl, req.body.data, { headers });

    // Send the API response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
