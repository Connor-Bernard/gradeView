import Base from './Base.js';

/**
 * Thrown when a key is not found in Redis.
 */
export default class KeyNotFoundError extends Base {
    constructor(keyName, databaseIndex) {
        if (typeof keyName !== 'string') {
            throw new Error('keyName must be a string');
        }

        let smartMessage = "";
        if (keyName) {
            smartMessage += `Key "${keyName}" was not found in databaseIndex ${databaseIndex}`;
        }
        super(smartMessage);
        this.name = 'KeyNotFoundError';
        this.keyName = keyName;
    }
}
