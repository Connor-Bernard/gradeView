export default class UnauthorizedAccessError extends Error{
    constructor(message){
        super(message);
        this.name = "UnauthorizedAccessError";
        this.status = 401;
    }
}
