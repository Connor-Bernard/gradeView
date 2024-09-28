/**
 * Base error for redis errors.
 */
export default class Base extends Error {
    /**
     * Creates a new base error.
     * @constructor
     * @param {string} message The base error message.
     * @param {Error|null} [err=null] - the existing error that was thrown if any.
     */
    constructor(message, err) {
        super(message);
        this.service = 'Redis';
        this.errorStack = [];
        if (err?.errorStack) {
            this.errorStack = [...err.errorStack, this];
        }
    }
}
