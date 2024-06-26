import NotFoundError from './NotFoundError.js';

/**
 * Should be thrown when a student resource is requested but not found.
 */
export default class StudentNotFoundError extends NotFoundError {
    constructor(message) {
        super(message);
        this.name = 'StudentNotFoundError';
    }
}
