import Base from './Base.js';

/**
 * Thrown when a key is not found in Redis.
 */
export default class KeyNotFoundError extends Base {
    /**
     * Creates a new KeyNotFoundError.
     * @constructor
     * @param {string} message - The base error message.
     * @param {string} keyName - The key that was queried.
     * @param {int} databaseIndex - The index of the db that was queried.
     * @param {Error|null} [err=null] - the existing error that was thrown if any.
     */
    constructor(message, keyName, databaseIndex, err=null) {
        super(`${message}; key '${keyName}' not found in database with index ${databaseIndex}`, err);
        this.name = 'KeyNotFoundError';
        this.keyName = keyName;
        this.databaseIndex = databaseIndex;
    }
}
