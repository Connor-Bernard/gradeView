const express = require('express');
const cors = require('cors');
const path = require('path');
const { proxy, limit } = require('./middleware');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

// Set up API proxy middleware
app.use('/api', proxy);

// Set up rate limiting middleware
app.use(limit(10));

// Serve static files from the React app
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});