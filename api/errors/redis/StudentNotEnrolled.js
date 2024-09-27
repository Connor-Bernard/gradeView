import Base from './Base.js';

/**
 * Thrown when a student is not enrolled in a course or program.
 */
export default class StudentNotEnrolledError extends Base {
    constructor(message, studentEmail) {
        let smartMessage = message;
        
        // Append additional details if available
        if (studentEmail) {
            smartMessage += `; student "${studentEmail}" is not enrolled`;
        }

        // Call the Base class constructor with the smart message
        super(smartMessage);
        this.name = 'StudentNotEnrolledError';
        this.studentEmail = studentEmail;
    }
}
