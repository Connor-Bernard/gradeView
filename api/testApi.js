import express, { json } from 'express';
import Router from './Router.js';

const app = express();
app.use(json());
app.use('/', (req, res, next) => {
    console.log('--- BEGIN REQUEST ---');
    console.log(req);
    console.log('--- END REQUEST ---');
    console.log();
    console.log('--- BEGIN RESPONSE ---');
    console.log(res);
    console.log('--- END RESPONSE ---');
    next();
});
app.use('/api', Router);

app.listen(3333, () => {
    console.log('Test server is running on port 3333.');
    console.warn('THIS IS A TEST SERVER. DO NOT USE IN PRODUCTION.');
});