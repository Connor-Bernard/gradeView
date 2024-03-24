import * as redisHelper from './lib/redisHelper.mjs';

const redisClient = redisHelper.getClient();
await redisClient.connect();
console.log('--- BEGIN CLIENT ---');
console.debug(redisClient);
console.log('--- END CLIENT ---');
await redisClient.quit();
