import config from 'config';
import { getStudent } from './redisHelper.mjs';
import StudentNotEnrolledError from '../errors/redis/StudentNotEnrolled.js';

/**
 * Checks if the specified user is an admin.
 * @param {string} email the email of the user to check.
 * @returns {boolean} whether the user is an admin.
 */
export function isAdmin(email) {
    const admins = config.get('admins');
    return admins.includes(email);
}

/**
 * Checks if the specified user is a student.
 * @param {string} email the email of the user to check.
 * @returns {boolean} whether the user is a student.
 */
export async function isStudent(email) {
    try {
        const student = await getStudent(email);
        return !!student;
    } catch (error) {
        if (error instanceof StudentNotEnrolledError) {
            return false;
        }
        // If it's another type of error, rethrow it to be handled elsewhere
        throw error;
    }
}
