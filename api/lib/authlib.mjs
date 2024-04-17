import AuthorizationError from './HttpErrors/AuthorizationError.js';
import UnauthorizedAccessError from './HttpErrors/UnauthorizedAccessError.js';
import { getEmailFromAuth } from './googleAuthHelper.mjs';
import { isAdmin, isStudent } from './userlib.mjs';

/**
 * Validates that the requester is either an admin or a student.
 * @param {Request} req request to validate.
 * @param {*} _ 
 * @param {Function} next trigger the next middleware / request.
 */
export async function validateAdminOrStudentMiddleware(req, _, next) {
    try {
        await validateAdminMiddleware(req, _, next);
    } catch (err) {
        switch (err.constructor) {
            case UnauthorizedAccessError:
                await validateStudentMiddleware(req, _, next);
                break;
            default:
                throw err;
        }
    }
}

/**
 * Validates that an admin request is permitted.
 * @param {Request} req the request to validate.
 * @param {*} _
 * @param {Function} next trigger the next middleware / request.
 * @throws {UnauthorizedAccessError} if the requester is not an admin.
 */
export async function validateAdminMiddleware(req, _, next) {
    validateAuthenticatedRequestFormat(req);

    const authEmail = await getEmailFromAuth(req.headers['authorization']);
    if (!isAdmin(authEmail)) {
        throw new UnauthorizedAccessError('not permitted');
    }

    next();
}

/**
 * Validates that a student request is permitted.
 * @param {Request} req the request to validate.
 * @param {*} _
 * @param {Function} next trigger the next middleware / request.
 * @throws {AuthorizationError} if the domain is not berkeley.
 * @throws {UnauthorizedAccessError} if the requester is not the route email param.
 */
export async function validateStudentMiddleware(req, _, next) {
    const { email } = req.params
    validateAuthenticatedRequestFormat(req);

    const authEmail = await getEmailFromAuth(req.headers['authorization']);
    if (!isStudent(authEmail)) {
        throw new AuthorizationError('not a registered student.');
    }

    if (email && (authEmail !== email)) {
        throw new UnauthorizedAccessError('not permitted');
    }

    next();
}

/**
 * Validates that a request has authorization headers.
 * @param {Request} req the request object to validate.
 * @throws {AuthorizationError} if the request does not have an authorization header.
 */
function validateAuthenticatedRequestFormat(req) {
    let token = req.headers['authorization'];
    if (!token) {
        throw new AuthorizationError('no authorization token provided.');
    }
}
