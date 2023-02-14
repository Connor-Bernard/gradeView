const express = require('express');
const cors = require('cors');
const path = require('path');
const createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware;
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', createProxyMiddleware({target: process.env.REACT_APP_PROXY_SERVER, changeOrigin: true}));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});