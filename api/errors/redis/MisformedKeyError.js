import Base from './Base.js';

/**
 * Thrown when a key is misformed.
 */
export default class MisformedKeyError extends Base {
    constructor(message, { expectedType, receivedValue } = {}) {
        let smartMessage = message;
        if (expectedType && receivedValue) {
            smartMessage += `; expected ${expectedType}, but got ${typeof receivedValue}`
        }
        super(smartMessage);
        this.name = 'MisformedKeyError'
        this.expectedType = expectedType;
        this.receivedValue = receivedValue;
    }
}
