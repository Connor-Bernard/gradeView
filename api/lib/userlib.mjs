import config from 'config';
import { getStudent } from './redisHelper.mjs';

/**
 * Checks if the specified user is an admin.
 * @param {string} email - the email of the user to check.
 * @returns {boolean} whether the user is an admin.
 */
export function isAdmin(email) {
    const admins = config.get('admins');
    return admins.includes(email);
}

/**
 * Checks if the specified user is a student.
 * @param {string} email - the email of the user to check.
 * @returns {boolean} whether the user is a student.
 */
export async function isStudent(email) {
    // TODO:at some point we should handle this more gracefully (check to see if the user exists instead of throwing an error).
    try {
        const student = await getStudent(email);
        return !!student;
    } catch (err) {
        switch (typeof err) {
            case 'StudentNotEnrolledError':
                return false;
            default:
                throw err;
        }
    }
}
