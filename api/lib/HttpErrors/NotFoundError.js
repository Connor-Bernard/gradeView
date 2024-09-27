/**
 * Should be thrown on an arbitrary resource not being found.
 */
export default class NotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404;
    }
}
