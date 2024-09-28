import Base from './Base.js';

/**
 * Thrown when a student is not enrolled in a course or program.
 */
export default class StudentNotEnrolledError extends Base {
    /**
     * Creates a new StudentNotEnrolledError.
     * @constructor
     * @param {string} message - The base error message.
     * @param {string} studentEmail - The queried student email.
     * @param {Error|null} err [err=null] - the existing error that was thrown if any.
     */
    constructor(message, studentEmail, err=null) {
        super(`${message}; student '${studentEmail}' is not enrolled`, err);
        this.name = 'StudentNotEnrolledError';
        this.studentEmail = studentEmail;
    }
}
