export default class AuthorizationError extends Error{
    constructor(message){
        super(message);
        this.name = 'AuthorizationError';
        this.status = 401;
    }
}
