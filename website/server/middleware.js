const RateLimit = require('express-rate-limit');
const createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware;
const dotenv = require('dotenv');
dotenv.config();

// API proxy middleware
exports.proxy = createProxyMiddleware({ target: process.env.REACT_APP_PROXY_SERVER || `http://localhost:${process.env.PORT || 8000}`, changeOrigin: true });

/**
 * Use to exclude a route from being verified with middleware.
 * @param {String} path 
 * @param {Function} middleware 
 * @returns Function
 */
exports.unless = (path, middleware) => {
    return function (req, res, next) {
        console.log(path, req.path);
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    }
}

/**
 * Use to limit the number of requests made per minute.
 * @param {int} requests 
 * @returns {RateLimit} rate limiter middleware
 */
exports.limit = (requests) => {
    return RateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: requests, // limit each IP input requests per minute
        message: 'Too many requests, please try again after 1 minute'
    });
}