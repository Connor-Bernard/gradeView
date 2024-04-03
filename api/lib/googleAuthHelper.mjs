import config from "config";
import { OAuth2Client } from "google-auth-library";
import AuthorizationError from "./HttpErrors/AuthorizationError.js";

/**
 * Gets an email from a google auth token.
 * @param {string} token user token to retrieve email from.
 * @returns {string} user's email.
 */
export async function getEmailFromAuth(token) {
    try {
        let oauthClient = new OAuth2Client(config.get('googleconfig.oauth.clientid'));
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: config.get('googleconfig.oauth.clientid'),
        });
        const payload = ticket.getPayload();
        if (payload['hd'] !== 'berkeley.edu') {
            throw new AuthorizationError('domain mismatch');
        }
        return payload['email'];
    } catch (err) {
        throw new AuthorizationError('Could not authenticate authorization token.');
    }
}

/**
 * Ensures that an email is a properly formatted berkeley email.
 * @param {string} email email to verify.
 * @returns {boolean} success of verification.
 * @deprecated
 */
export function verifyBerkeleyEmail(email) {
    return email.split("@").length === 2
            && email.split("@")[1] === "berkeley.edu";
}

// TODO: check if the user is included in the list of users (in the db);
/**
 * Checks to see if an email is a student email or an admin.
 * @param {string} email email to check access to.
 * @returns {boolean} whether the email is an admin or student.
 * @deprecated use api/lib/userlib.mjs middlewares instead.
 */
export function ensureStudentOrAdmin(email) {
    const isAdmin = config.get('admins').includes(email);
    return isAdmin;
}
