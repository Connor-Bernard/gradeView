import config from 'config';
import dotenv from 'dotenv';

import { createClient } from 'redis';

dotenv.config();

/**
 * Gets an authenticated Redis client.
 * @param {number} databaseIndex the index the entry is stored in.
 * @returns {RedisClient} Redis client.
 */
export function getClient(databaseIndex = 0) {
    const client = createClient({
        url: `redis://${config.get('redis.username')}:${process.env.REDIS_DB_SECRET}` +
            `@${config.get('redis.host')}:${config.get('redis.port')}/${databaseIndex}`,
    });
    client.on('error', (err) => {
        console.error('Redis error: ', err);
    });
    return client;
}

/**
 * Gets the value of a specified key in the database.
 * @param {string} key the key of the entry to get.
 * @param {number} databaseIndex the index the entry is stored in.
 * @returns {object} the entry's information.
 */
export async function getEntry(key, databaseIndex = 0) {
    const client = getClient(databaseIndex);
    await client.connect();

    const res = await client.get(key);
    // TODO: Throw error if the key does not exist in the db.

    await client.quit();

    return JSON.parse(res);
}

/**
 * Gets the categories of all assignments from the Redis database.
 * @returns {object} the assignment categories.
 */
export async function getCategories() {
    return await getEntry('Categories');
}

/**
 * Gets a specified student's information from the Redis database. 
 * @param {string} email the email of the student whose information to get. 
 * @returns {object} the student's information.
 */
export async function getStudent(email) {
    return await getEntry(email);
}

/**
 * Gets the grade bins of all assignments from the Redis database.
 * @returns {object} the assignment categories.
 */
export async function getBins() {
    const databaseIndex = 1;
    return await getEntry('bins', databaseIndex);
}

/**
 * Gets just the student's scores from the Redis database.
 * @param {string} email the email of the student whose information to get.
 * @returns {object} the student's scores.
 */
export async function getStudentScores(email) {
    const studentInfo = await getStudent(email);
    return studentInfo['Assignments'];
}

/**
 * Gets the total amount of points a user has gotten so far.
 * @param {string} email the email of the student whose information to get.
 * @returns {number} the total amount of points the user has accumulated.
 */
export async function getStudentTotalScore(email) {
    const studentInfo = await getStudent(email);
    return Object.values(studentInfo).reduce((acc, curr) => acc + curr, 0);
}

/**
 * Gets the total amount of points in the class so far.
 * @returns {boolean} the total amount of points possible for the class.
 */
export async function getTotalPossibleScore() {
    const categories = await getCategories();
    return Object.values(categories).reduce((acc, curr) => acc + curr, 0);
}

export async function getMaxPointsSoFar() {
    return await getStudent("MAX POINTS")
}
