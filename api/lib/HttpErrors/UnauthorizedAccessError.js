/**
 * Should be thrown when a user tries to access a resource that they are not authorized to access.
 */
export default class UnauthorizedAccessError extends Error{
    constructor(message){
        super(message);
        this.name = 'UnauthorizedAccessError';
        this.status = 403;
    }
}
