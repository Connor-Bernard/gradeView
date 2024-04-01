/**
 * Should be thrown if the data from a sheet is not in the expected format.
 * @deprecated
 */
export default class BadSheetDataError extends Error{
    constructor(message){
        super(message);
        this.name = 'BadSheetDataError';
        this.status = 500;
    }
}
