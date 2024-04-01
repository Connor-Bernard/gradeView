/**
 * Should be thrown if a user tries to access a resource without proper credentials.
 */
export default class AuthorizationError extends Error{
    constructor(message){
        super(message);
        this.name = 'AuthorizationError';
        this.status = 401;
    }
}
