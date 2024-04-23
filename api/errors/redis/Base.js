/**
 * Base error for redis errors.
 */
export default class Base extends Error {
    constructor(message) {
        super(message);
        this.service = 'Redis';
    }
} 
