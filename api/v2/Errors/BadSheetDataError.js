export default class BadSheetDataError extends Error{
    constructor(message){
        super(message);
        this.name = 'BadSheetDataError';
        this.status = 500;
    }
}
