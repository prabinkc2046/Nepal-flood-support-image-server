const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// Create an express application
const app = express();

// Set up CORS to allow only from the domain specified in the environment variable
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGIN, // Use env variable for origin, fallback to *
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// API endpoint to dynamically serve images by name
app.get('/images/:imagename', (req, res) => {
  const imagename = req.params.imagename; // Get image name from URL

  // Ensure imagename does not contain malicious characters like "../"
  const sanitizedImagename = path.basename(imagename);

  const imagePath = path.join(__dirname, 'images', sanitizedImagename); // Define image path

  // Check if the image exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({
        message: 'Image not found',
        status: 'fail',
      });
    }

    // Send the image file with correct headers
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(500).json({
          message: 'Error sending file',
          status: 'error',
        });
      }
    });
  });
});

// Use PORT from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on all interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
