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

// Start the server listening on the unix socket or port if configured otherwise port 3000.
const sock = process.env.SOCKETS_DIR && `${process.env.SOCKETS_DIR}/app.sock`;
const port = process.env.PORT || 3000;
app.listen(sock || port, () => {
    if (sock) {
        console.log(`Server is listening on ${sock}`);
        require('child_process').exec(`chmod o+rw ${sock}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`[ERROR] execution error: ${err}`);
            }
            console.log(`[LOG]: ${stdout}`);
            console.error(`[ERROR]: ${stderr}`);
        });
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});
